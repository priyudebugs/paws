const { app, BrowserWindow, Tray, Menu, screen, ipcMain, powerMonitor, nativeImage, globalShortcut, nativeTheme, dialog, Notification } = require('electron');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { BREAKS, SPECIAL, NAMED, GEAR, MOODS, COVERS, PRIORITY, AWAY_COLORS, getBreak } = require('./src/breaks');
const { createStore, defaults, today } = require('./src/store');
const { grabFocus } = require('./src/focus');

const DEMO = process.argv.includes('--demo');
// In demo mode every "minute" in the settings is two seconds, so the whole flow can be shown in a meeting.
const MINUTE = DEMO ? 2 : 60;
const STARTED_HIDDEN = process.argv.includes('--hidden');
const SRC = path.join(__dirname, 'src');
const ICON = path.join(__dirname, 'assets', 'icon.png');
const MIN_GAP_MS = (DEMO ? 25 : 90) * 1000;
const CALL_HOLD_MAX_MS = 30 * 60 * 1000;
const AWAY_SHORTCUT = 'CommandOrControl+Alt+B';
const AWAY_GRACE_MS = 2000;
const AWAY_MOVE_PX = 12;

let store;
let tray = null;
let settingsWin = null;
let warnWin = null;
let quitting = false;

const overlays = new Map();
const awayViews = new Map();
const timers = {};
const snoozedUntil = {};
let activeSecs = 0;
let pausedUntil = 0;
let current = null;
let warning = null;
let away = null;
let lastBreakEnd = 0;
let lastTick = Date.now();
let inCall = false;
let callHoldStart = 0;
let lastTip = '';

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => openSettings());
  app.on('window-all-closed', () => {});
  app.on('before-quit', () => {
    quitting = true;
  });
  app.on('will-quit', () => globalShortcut.unregisterAll());
  app.on('web-contents-created', (e, contents) => {
    contents.on('will-navigate', (ev) => ev.preventDefault());
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
  });
  app.whenReady().then(init);
}

function init() {
  app.setAppUserModelId('com.paws.desktop');
  nativeTheme.themeSource = 'light';
  store = createStore(app.getPath('userData'));
  applyInstallChoices();
  resetTimers();
  applyLoginItem();
  applyShortcut();
  createTray();
  registerIpc();
  powerMonitor.on('lock-screen', () => {
    closeWarning();
    resetTimers();
    endAway();
  });
  powerMonitor.on('suspend', closeWarning);
  powerMonitor.on('unlock-screen', resetTimers);
  powerMonitor.on('resume', resetTimers);
  setInterval(tick, 1000);
  setInterval(pollCall, 20000);
  pollCall();
  if (store.firstRun || !STARTED_HIDDEN) openSettings();
}

function resetTimers() {
  for (const id of Object.keys(BREAKS)) timers[id] = 0;
  activeSecs = 0;
  callHoldStart = 0;
}

function webPrefs() {
  return {
    preload: path.join(SRC, 'preload.js'),
    contextIsolation: true,
    sandbox: true,
    autoplayPolicy: 'no-user-gesture-required',
  };
}

// ---------- scheduler ----------

function tick() {
  const now = Date.now();
  const dt = Math.min((now - lastTick) / 1000, 5);
  lastTick = now;
  if (current || warning || away) return;
  const s = store.getSettings();
  if (now < pausedUntil) return refreshTray();

  const idle = powerMonitor.getSystemIdleTime();
  if (idle >= s.idleResetMinutes * 60) {
    resetTimers();
    return refreshTray();
  }
  if (idle < 120) {
    for (const id of Object.keys(BREAKS)) if (s.breaks[id]?.enabled) timers[id] += dt;
    activeSecs += dt;
  }

  const due = nextDue(now, s);
  if (due && now - lastBreakEnd > MIN_GAP_MS) {
    const held = s.pauseOnCalls && inCall && !(callHoldStart && now - callHoldStart > CALL_HOLD_MAX_MS);
    if (held) {
      if (!callHoldStart) callHoldStart = now;
    } else {
      callHoldStart = 0;
      startWarning(due);
    }
  }
  refreshTray();
}

function nextDue(now, s) {
  const due = new Set();
  for (const [id, cfg] of Object.entries(s.breaks)) {
    if (cfg.enabled && timers[id] >= cfg.every * MINUTE && !(snoozedUntil[id] > now)) due.add(id);
  }
  if (s.marathon.enabled && activeSecs >= s.marathon.hours * 60 * MINUTE && !(snoozedUntil.marathon > now)) {
    due.add('marathon');
  }
  if (winddownDue(now, s)) due.add('winddown');
  if (reportDue(now, s)) due.add('report');
  return PRIORITY.find((id) => due.has(id)) || null;
}

// Friday between 3 and 7 PM, once a week, and only if there is something to report.
function reportDue(now, s) {
  if (!s.report || snoozedUntil.report > now) return false;
  const d = new Date(now);
  if (d.getDay() !== 5 || d.getHours() < 15 || d.getHours() >= 19) return false;
  if (store.lastReport() === today()) return false;
  return store.weekReport().taken > 0;
}

function winddownDue(now, s) {
  if (!s.winddown.enabled || store.lastWinddown() === today() || snoozedUntil.winddown > now) return false;
  const d = new Date(now);
  if (s.winddown.weekdaysOnly && (d.getDay() === 0 || d.getDay() === 6)) return false;
  const [h, m] = s.winddown.time.split(':').map(Number);
  const mins = d.getHours() * 60 + d.getMinutes();
  return mins >= h * 60 + m && mins < h * 60 + m + 180;
}

function upcoming() {
  const s = store.getSettings();
  return Object.entries(s.breaks)
    .filter(([, cfg]) => cfg.enabled)
    .map(([id, cfg]) => ({ id, secs: Math.max(0, Math.round(cfg.every * MINUTE - timers[id])) }))
    .sort((a, b) => a.secs - b.secs);
}

function pollCall() {
  const s = store.getSettings();
  if (process.platform !== 'win32' || !s.pauseOnCalls) {
    inCall = false;
    callHoldStart = 0;
    return;
  }
  // Windows writes LastUsedTimeStop = 0 for any app currently holding the microphone.
  const key = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone';
  execFile('reg', ['query', key, '/s', '/v', 'LastUsedTimeStop'], { windowsHide: true, timeout: 5000 }, (err, stdout) => {
    inCall = !!stdout && /LastUsedTimeStop\s+REG_QWORD\s+0x0\s*$/m.test(stdout);
    if (!inCall) callHoldStart = 0;
  });
}

function pause(minutes) {
  pausedUntil = Date.now() + minutes * 60 * 1000;
  closeWarning();
  refreshTray();
}

function pauseUntilTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(6, 0, 0, 0);
  pausedUntil = d.getTime();
  closeWarning();
  refreshTray();
}

// ---------- break lifecycle ----------

function snoozeMinutes(id) {
  return id === 'winddown' || id === 'report' ? 30 : 5;
}

function snoozeLabel(id) {
  return id === 'winddown' ? '30 more minutes' : `Snooze ${snoozeMinutes(id)} min`;
}

// Previews (Try it) can always be skipped and are never snoozed.
function permissions(id, preview = false) {
  const s = store.getSettings();
  if (preview) return { canSkip: true, canSnooze: false };
  return { canSkip: !s.strict, canSnooze: !s.strict || id === 'winddown' };
}

function applyResult(id, result, mood, preview = false) {
  const now = Date.now();
  if (preview) return refreshTray();
  if (id === 'report') {
    if (result === 'snoozed') snoozedUntil.report = now + snoozeMinutes(id) * MINUTE * 1000;
    else store.markReport(today());
    return refreshTray();
  }
  if (result === 'snoozed') {
    snoozedUntil[id] = now + snoozeMinutes(id) * MINUTE * 1000;
  } else {
    if (id in timers) timers[id] = 0;
    if (result === 'done') for (const c of COVERS[id] || []) timers[c] = 0;
    if (id === 'marathon' || (id === 'walk' && result === 'done')) activeSecs = 0;
    if (id === 'winddown') store.markWinddown(today());
  }
  store.record(id, result, mood);
  if (settingsWin && !settingsWin.isDestroyed()) settingsWin.webContents.send('stats:changed');
  refreshTray();
}

function startWarning(id) {
  const s = store.getSettings();
  if (!s.warnSeconds) return startBreak(id);
  const ms = s.warnSeconds * 1000;
  warning = {
    id,
    endsAt: Date.now() + ms,
    timeout: setTimeout(() => startBreak(id), ms),
  };
  const { workArea } = screen.getPrimaryDisplay();
  const w = 420;
  const h = 132;
  warnWin = new BrowserWindow({
    width: w,
    height: h,
    x: workArea.x + workArea.width - w - 12,
    y: workArea.y + workArea.height - h - 12,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    show: false,
    webPreferences: webPrefs(),
  });
  warnWin.setAlwaysOnTop(true, 'screen-saver');
  warnWin.loadFile(path.join(SRC, 'warn.html'));
  const win = warnWin;
  win.once('ready-to-show', () => !win.isDestroyed() && win.showInactive());
}

function closeWarning() {
  if (warning) clearTimeout(warning.timeout);
  warning = null;
  if (warnWin && !warnWin.isDestroyed()) warnWin.destroy();
  warnWin = null;
}

function scaleSteps(steps, duration) {
  const total = steps.reduce((sum, st) => sum + st.secs, 0);
  return steps.map((st) => ({ ...st, secs: (st.secs * duration) / total }));
}

function profile() {
  const p = store.getSettings().profile;
  return { name: p.name.trim(), dog: p.dog.trim() || 'Paws' };
}

function fillNames(text, names) {
  return text.replace(/\{name\}/g, () => names.name).replace(/\{dog\}/g, () => names.dog);
}

// Personal lines come up about a third of the time, so the dog's name doesn't get old.
function pickQuip(id, def, names) {
  const named = (NAMED[id] || []).filter((q) => names.name || !q.includes('{name}'));
  const list = named.length && Math.random() < 0.35 ? named : def.quips;
  return fillNames(pick(list), names);
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function wardrobe() {
  if (!store.getSettings().profile.outfit) return [];
  const best = DEMO ? Infinity : store.summary().best;
  return GEAR.filter((g) => best >= g.days).map((g) => g.id);
}

function reportCard() {
  const names = profile();
  const w = store.weekReport();
  const ratio = w.taken / Math.max(1, w.taken + w.skipped);
  let grade = !w.taken ? 'Incomplete' : ratio >= 0.9 ? 'A' : ratio >= 0.75 ? 'B' : ratio >= 0.5 ? 'C' : 'D';
  if (w.taken && w.taken / Math.max(1, w.days) >= 6) grade += '+';
  const water = w.byType.water || 0;
  const walks = w.byType.walk || 0;
  const bestDay = w.best && w.best.taken ? new Date(`${w.best.date}T12:00`).toLocaleDateString('en-US', { weekday: 'long' }) : '';
  const text =
    `${w.taken} break${w.taken === 1 ? '' : 's'} this week, ${w.skipped} skipped.` +
    (bestDay ? ` Best day: ${bestDay} with ${w.best.taken}.` : '') +
    ` Water: ${water}. Walks: ${walks}.`;
  let quip = 'Solid week. {dog} approves of this human.';
  if (!w.taken) quip = '{dog} has nothing to report. That is the report.';
  else if (w.skipped > w.taken) quip = 'More skips than breaks. {dog} is filing a formal complaint.';
  else if (water < 3) quip = `Only ${water} water break${water === 1 ? '' : 's'}. The water bowl is offended.`;
  else if (walks >= 5) quip = `${walks} walks this week. {dog} is impressed and a little jealous.`;
  else if (grade.startsWith('A')) quip = '{dog} would give you a treat, if {dog} had thumbs.';
  return { title: `Report card: ${grade}`, text, quip: fillNames(quip, names) };
}

// Windows often won't hand keyboard focus to a break that pops up over another app,
// so Escape is grabbed system-wide for exactly as long as a skippable break is on screen.
function armSkipKey(on) {
  globalShortcut.unregister('Escape');
  if (!on) return;
  globalShortcut.register('Escape', () => {
    if (current && permissions(current.id, current.preview).canSkip) endBreak('skipped');
  });
}

function startBreak(id, preview = false) {
  if (current) return;
  closeWarning();
  const s = store.getSettings();
  const def = getBreak(id);
  const card = id === 'report' ? reportCard() : null;
  const duration = s.breaks[id]?.duration ?? def.duration;
  const primaryId = screen.getPrimaryDisplay().id;
  const base = {
    id,
    title: card ? card.title : def.title,
    field: def.field,
    light: !!def.light,
    act: def.act,
    gear: wardrobe(),
    takenToday: store.summary().today.taken,
    steps: card ? [{ secs: duration, text: card.text }] : scaleSteps(def.steps, duration),
    duration,
    startedAt: Date.now(),
    quip: card ? card.quip : pickQuip(id, def, profile()),
    names: profile(),
    sound: s.sound,
    breathing: !!def.breathing,
    moods: def.mood ? MOODS : null,
    snoozeLabel: snoozeLabel(id),
    canAway: id === 'walk' && (!s.strict || preview || lockEnabled()),
    ...permissions(id, preview),
  };
  current = { id, preview, mood: null, timeout: setTimeout(() => endBreak('done'), duration * 1000 + 250) };
  for (const display of screen.getAllDisplays()) {
    createOverlay(display, { ...base, primary: display.id === primaryId });
  }
  armSkipKey(base.canSkip);
  refreshTray();
}

// Full-screen, always-on-top window that only our own code may close (we destroy() it).
function createCover(display, file, background, focus, registry, payload) {
  const win = new BrowserWindow({
    ...display.bounds,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    backgroundColor: background,
    webPreferences: webPrefs(),
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setMenu(null);
  registry.set(win.webContents.id, { win, payload });
  win.on('close', (e) => {
    if (!quitting) e.preventDefault();
  });
  win.loadFile(path.join(SRC, file));
  win.once('ready-to-show', () => {
    if (win.isDestroyed()) return;
    win.setBounds(display.bounds);
    win.show();
    if (focus) grabFocus(win);
  });
  // Keep the keyboard on the cover until it closes, so typing never leaks into the app behind it.
  if (focus) {
    const stillUp = () => !quitting && !win.isDestroyed() && (registry === overlays ? !!current : !!away && !away.locking);
    let regrabs = 0;
    win.on('blur', () => {
      if (!stillUp() || regrabs >= 30) return;
      regrabs++;
      setTimeout(() => stillUp() && grabFocus(win), 80);
    });
  }
  return win;
}

function createOverlay(display, payload) {
  createCover(display, 'break.html', payload.field, payload.primary, overlays, payload);
}

function endBreak(result, quiet = false) {
  if (!current) return;
  const { id, mood, preview } = current;
  clearTimeout(current.timeout);
  armSkipKey(false);
  current = null;
  lastBreakEnd = Date.now();
  const wins = [...overlays.values()].map((o) => o.win);
  overlays.clear();
  const bestBefore = store.summary().best;
  applyResult(id, result, mood, preview);

  const alive = () => wins.filter((w) => !w.isDestroyed());
  if (result === 'done' && !quiet) {
    const { today: day, streak, best } = store.summary();
    const outfit = store.getSettings().profile.outfit && !DEMO;
    const unlocked = outfit ? GEAR.filter((g) => bestBefore < g.days && best >= g.days).map((g) => g.name).pop() || null : null;
    const info = { taken: day.taken, streak, unlocked, gear: wardrobe() };
    alive().forEach((w) => w.webContents.send('break:complete', info));
    setTimeout(() => alive().forEach((w) => w.destroy()), 2600);
  } else {
    alive().forEach((w) => w.destroy());
  }
}

// ---------- away screen ----------

function startAway() {
  if (away || current) return;
  closeWarning();
  const s = store.getSettings();
  const color = AWAY_COLORS.find((c) => c.value === s.away.color) || AWAY_COLORS[0];
  const payload = {
    title: s.away.title.trim() || defaults().away.title,
    subtitle: s.away.subtitle.trim(),
    field: color.value,
    light: !!color.light,
    locks: lockEnabled(),
    ...profile(),
    gear: wardrobe(),
    since: Date.now(),
    graceMs: AWAY_GRACE_MS,
  };
  const primaryId = screen.getPrimaryDisplay().id;
  away = { since: payload.since, poll: null, arm: null, origin: null, lastIdle: 0, locking: null };
  for (const display of screen.getAllDisplays()) {
    createCover(display, 'away.html', color.value, display.id === primaryId, awayViews, payload);
  }
  // After the grace period, cursor movement or any input anywhere (idle time dropping) means someone is back.
  away.arm = setTimeout(() => {
    if (!away) return;
    away.origin = screen.getCursorScreenPoint();
    away.lastIdle = powerMonitor.getSystemIdleTime();
    away.poll = setInterval(() => {
      const p = screen.getCursorScreenPoint();
      const idle = powerMonitor.getSystemIdleTime();
      const moved = Math.hypot(p.x - away.origin.x, p.y - away.origin.y) > AWAY_MOVE_PX;
      if (moved || idle < away.lastIdle) returnFromAway();
      else away.lastIdle = idle;
    }, 150);
  }, AWAY_GRACE_MS);
  refreshTray();
}

function lockEnabled() {
  return process.platform === 'win32' && store.getSettings().away.lock;
}

// With the lock on, coming back goes through the Windows lock screen; the away screen closes once Windows locks.
function returnFromAway() {
  if (!away) return;
  if (!lockEnabled()) return endAway();
  if (away.locking) return;
  clearInterval(away.poll);
  away.locking = setTimeout(lockFailed, 4000);
  execFile('rundll32.exe', ['user32.dll,LockWorkStation'], { windowsHide: true }, (err) => err && endAway());
}

function lockFailed() {
  endAway();
  if (Notification.isSupported()) {
    new Notification({
      title: "Paws couldn't lock your PC",
      body: 'Windows did not lock, so the away screen closed. Your IT settings may block locking. Press Win+L to lock manually.',
      icon: ICON,
    }).show();
  }
}

function endAway() {
  if (!away) return;
  const awayMs = Date.now() - away.since;
  clearTimeout(away.arm);
  clearTimeout(away.locking);
  clearInterval(away.poll);
  away = null;
  const wins = [...awayViews.values()].map((v) => v.win);
  awayViews.clear();
  wins.forEach((w) => !w.isDestroyed() && w.destroy());
  if (awayMs >= store.getSettings().idleResetMinutes * 60 * 1000) resetTimers();
  lastBreakEnd = Date.now();
  refreshTray();
}

function applyShortcut() {
  globalShortcut.unregister(AWAY_SHORTCUT);
  if (store.getSettings().away.shortcut) {
    globalShortcut.register(AWAY_SHORTCUT, () => (away ? returnFromAway() : startAway()));
  }
}

// ---------- IPC ----------

function registerIpc() {
  ipcMain.handle('break:payload', (e) => overlays.get(e.sender.id)?.payload ?? null);

  ipcMain.on('break:action', (e, type, data) => {
    if (!current) return;
    const perms = permissions(current.id, current.preview);
    const payload = overlays.get(e.sender.id)?.payload;
    if (type === 'skip' && perms.canSkip) endBreak('skipped');
    else if (type === 'snooze' && perms.canSnooze) endBreak('snoozed');
    else if (type === 'done' && payload && Date.now() - payload.startedAt >= payload.duration * 500) endBreak('done');
    else if (type === 'away' && payload?.canAway && current.id === 'walk') {
      endBreak('done', true);
      startAway();
    }
    else if (type === 'mood') {
      const mood = MOODS.find((m) => m.label === data);
      if (!mood) return;
      current.mood = mood.label;
      for (const { win } of overlays.values()) if (!win.isDestroyed()) win.webContents.send('break:mood', mood);
    }
  });

  ipcMain.handle('warn:payload', () => {
    if (!warning) return null;
    const def = getBreak(warning.id);
    return { title: def.short || def.title, field: def.field, light: !!def.light, endsAt: warning.endsAt, dog: profile().dog, gear: wardrobe(), snoozeLabel: snoozeLabel(warning.id), ...permissions(warning.id) };
  });

  ipcMain.on('warn:action', (e, action) => {
    if (!warning) return;
    const { id } = warning;
    if (action === 'now') return startBreak(id);
    if (action === 'snooze' && permissions(id).canSnooze) {
      closeWarning();
      lastBreakEnd = Date.now();
      applyResult(id, 'snoozed');
    } else if (action === 'skip' && permissions(id).canSkip) {
      closeWarning();
      lastBreakEnd = Date.now();
      applyResult(id, 'skipped');
    }
  });

  ipcMain.handle('settings:get', () => ({
    settings: store.getSettings(),
    catalog: Object.fromEntries(
      Object.entries({ ...BREAKS, ...SPECIAL }).map(([id, b]) => [id, { title: b.short || b.title, field: b.field }]),
    ),
    awayColors: AWAY_COLORS,
    firstRun: store.firstRun,
    version: app.getVersion(),
    demo: DEMO,
  }));

  const saveFromRenderer = (next) => {
    const wasOn = Object.fromEntries(Object.entries(store.getSettings().breaks).map(([id, b]) => [id, b.enabled]));
    const saved = store.saveSettings(next);
    for (const [id, b] of Object.entries(saved.breaks)) if (b.enabled && !wasOn[id]) timers[id] = 0;
    applyLoginItem();
    applyShortcut();
    pollCall();
    refreshTray();
    return saved;
  };
  ipcMain.handle('settings:save', (e, next) => saveFromRenderer(next));
  ipcMain.on('settings:save-now', (e, next) => saveFromRenderer(next));

  ipcMain.handle('stats:get', () => ({
    ...store.summary(),
    gear: wardrobe(),
    gearList: GEAR,
    demo: DEMO,
    upcoming: upcoming(),
    pausedUntil: pausedUntil > Date.now() ? pausedUntil : 0,
    inCall: inCall && store.getSettings().pauseOnCalls,
    minuteSecs: MINUTE,
  }));

  ipcMain.on('break:preview', (e, id) => {
    if (getBreak(id)) startBreak(id, true);
  });

  ipcMain.handle('away:payload', (e) => awayViews.get(e.sender.id)?.payload ?? null);
  ipcMain.on('away:end', (e) => {
    const view = awayViews.get(e.sender.id);
    if (view && Date.now() - view.payload.since >= AWAY_GRACE_MS) returnFromAway();
  });
  ipcMain.on('away:show', () => startAway());

  ipcMain.on('app:quit', () => app.quit());

  ipcMain.on('app:pause', (e, minutes) => (minutes > 0 ? pause(minutes) : ((pausedUntil = 0), refreshTray())));
}

// ---------- tray + windows ----------

function fmt(secs) {
  if (secs < 60) return `${Math.max(1, Math.ceil(secs))}s`;
  const mins = Math.ceil(secs / 60);
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function statusText() {
  if (away) return 'Away screen is up';
  if (current) return `On a break: ${getBreak(current.id).title}`;
  if (pausedUntil > Date.now()) {
    return `Paused until ${new Date(pausedUntil).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }
  if (callHoldStart) return 'On a call: breaks on hold';
  const next = upcoming()[0];
  if (!next) return 'All reminders are off';
  return `Next: ${BREAKS[next.id].title.toLowerCase()} in ${fmt(next.secs)}`;
}

function createTray() {
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray.png')));
  tray.on('click', openSettings);
  tray.on('right-click', () => tray.popUpContextMenu(buildMenu()));
  refreshTray();
}

function refreshTray() {
  if (!tray) return;
  const tip = `Paws${DEMO ? ' (demo)' : ''}\n${statusText()}`;
  if (tip !== lastTip) tray.setToolTip(tip);
  lastTip = tip;
}

function buildMenu() {
  const paused = pausedUntil > Date.now();
  return Menu.buildFromTemplate([
    { label: statusText(), enabled: false },
    { type: 'separator' },
    {
      label: "I'm stepping away",
      accelerator: store.getSettings().away.shortcut ? AWAY_SHORTCUT : undefined,
      registerAccelerator: false,
      click: startAway,
    },
    {
      label: 'Take a break now',
      submenu: Object.entries({ ...BREAKS, ...SPECIAL }).map(([id, b]) => ({
        label: b.short || b.title,
        click: () => startBreak(id),
      })),
    },
    paused
      ? { label: 'Resume reminders', click: () => ((pausedUntil = 0), refreshTray()) }
      : {
          label: "Pause (I'm in the zone)",
          submenu: [
            { label: '30 minutes', click: () => pause(30) },
            { label: '1 hour', click: () => pause(60) },
            { label: '2 hours', click: () => pause(120) },
            { label: 'Until tomorrow', click: pauseUntilTomorrow },
          ],
        },
    { type: 'separator' },
    { label: 'Settings && stats', click: openSettings },
    { label: 'About Paws', click: showAbout },
    { label: 'Quit Paws', click: () => app.quit() },
  ]);
}

let aboutOpen = false;

function showAbout() {
  if (aboutOpen) return;
  aboutOpen = true;
  const dog = profile().dog;
  dialog.showMessageBox({
    type: 'none',
    icon: nativeImage.createFromPath(ICON),
    title: 'About Paws',
    message: `Paws ${app.getVersion()}`,
    detail: `Made with love by Priyu.\n\nA break buddy for your eyes, your back and your brain, with ${dog} keeping an eye on you.`,
    buttons: ['Woof'],
    noLink: true,
  }).finally(() => {
    aboutOpen = false;
  });
}

function openSettings() {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.show();
    settingsWin.focus();
    return;
  }
  settingsWin = new BrowserWindow({
    width: 1120,
    height: 780,
    minWidth: 820,
    minHeight: 600,
    title: 'Paws',
    icon: ICON,
    backgroundColor: '#f1f4f2',
    show: false,
    webPreferences: webPrefs(),
  });
  settingsWin.setMenu(null);
  settingsWin.loadFile(path.join(SRC, 'settings.html'));
  settingsWin.once('ready-to-show', () => settingsWin.show());
  settingsWin.on('closed', () => {
    settingsWin = null;
  });
}

// The installer's options page leaves its choices here for the first launch.
function applyInstallChoices() {
  const file = path.join(app.getPath('userData'), 'install-choices.json');
  if (!fs.existsSync(file)) return;
  try {
    const choices = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (typeof choices.launchAtLogin === 'boolean') store.saveSettings({ ...store.getSettings(), launchAtLogin: choices.launchAtLogin });
  } catch (err) {
    console.error(`Paws could not read install choices: ${err.message}`);
  }
  try {
    fs.unlinkSync(file);
  } catch {}
}

function applyLoginItem() {
  if (!app.isPackaged) return;
  app.setLoginItemSettings({
    openAtLogin: store.getSettings().launchAtLogin,
    path: process.execPath,
    args: ['--hidden'],
    name: 'Paws',
  });
}
