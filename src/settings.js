(async function () {
  const $ = (id) => document.getElementById(id);
  const RANGES = {
    eyes: { every: [10, 60, 5], duration: [10, 60, 5] },
    posture: { every: [10, 90, 5], duration: [10, 30, 5] },
    water: { every: [15, 120, 5], duration: [10, 60, 5] },
    stretch: { every: [20, 180, 10], duration: [30, 180, 10] },
    breathe: { every: [30, 240, 10], duration: [32, 128, 16] },
    walk: { every: [45, 240, 15], duration: [120, 900, 60] },
  };
  const INK = '#17302a';
  const CREAM = '#f6e7d0';
  const TAN = '#cf9561';
  const ic = (inner) => `<svg class="ic" viewBox="0 0 32 32" aria-hidden="true"><g stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
  const band = (d, over, w = 2) => `<path d="${d}" fill="none" stroke-width="${w + 2.2}"/><path d="${d}" fill="none" stroke="${over}" stroke-width="${w}"/>`;
  const PAW_MINI = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})" fill="${INK}" stroke="none"><ellipse cx="12" cy="16.2" rx="5.6" ry="4.6"/><ellipse cx="5.2" cy="10.6" rx="2.3" ry="2.9"/><ellipse cx="9.4" cy="6.4" rx="2.3" ry="3"/><ellipse cx="14.6" cy="6.4" rx="2.3" ry="3"/><ellipse cx="18.8" cy="10.6" rx="2.3" ry="2.9"/></g>`;
  const ICONS = {
    eyes: ic(`
      <path d="M5.6 11.5C2.8 12 2.2 16.6 3.6 19.2 5.2 19.3 6.3 16.4 6.3 13.4Z" fill="${TAN}"/>
      <path d="M26.4 11.5C29.2 12 29.8 16.6 28.4 19.2 26.8 19.3 25.7 16.4 25.7 13.4Z" fill="${TAN}"/>
      <path d="M7.5 9.5V7a1.6 1.6 0 0 1 1.6-1.6h2a1.6 1.6 0 0 1 1.6 1.6v2.5M19.3 9.5V7a1.6 1.6 0 0 1 1.6-1.6h2a1.6 1.6 0 0 1 1.6 1.6v2.5" fill="${CREAM}"/>
      <rect x="5" y="9" width="10.2" height="15.5" rx="4.6" fill="${CREAM}"/>
      <rect x="16.8" y="9" width="10.2" height="15.5" rx="4.6" fill="${CREAM}"/>
      <rect x="13.6" y="12.5" width="4.8" height="4.6" rx="1.4" fill="${TAN}"/>
      <circle cx="10.1" cy="20.6" r="3.5" fill="#cfe5ef"/><circle cx="21.9" cy="20.6" r="3.5" fill="#cfe5ef"/>
      <path d="M8.6 19.4a1.9 1.9 0 0 1 1.7-1M20.4 19.4a1.9 1.9 0 0 1 1.7-1" fill="none" stroke="#fffdf8" stroke-width="1.2"/>`),
    posture: ic(`
      <path d="M5.5 28.5H27.5" fill="none"/>
      ${band('M11.5 25.5C8.5 25.5 6.6 23 7.3 20.3', TAN, 1.8)}
      <path d="M11 28C10 23 10.5 18 13.5 15C15 13.5 16 12 16.2 10C16.2 6.5 18.3 4.5 21 4.5C23.3 4.5 24.6 6 25 7.5L27.6 8.6C28.6 9 28.6 10.7 27.6 11L24 11.6C23 13.5 22.8 15.5 23.3 17.5C24.3 21 24.6 24.5 24.5 28Z" fill="${CREAM}"/>
      <path d="M14.5 28C14 25 15.5 23 17.5 23M21 18.5V28" fill="none"/>
      <path d="M18.3 6C16.6 6.6 16.3 9.6 17.4 11.8C18.8 11.5 19.6 9 19.4 6.6Z" fill="${TAN}"/>
      <path d="M16.8 12.2Q19.8 13.8 23.3 12.4" fill="none" stroke="#2e6a4f" stroke-width="2"/>
      <circle cx="20" cy="14.6" r="1.2" fill="#d9572b" stroke-width="1"/>
      <circle cx="22.2" cy="7.6" r="0.95" fill="${INK}" stroke="none"/><circle cx="27.7" cy="9.7" r="1" fill="${INK}" stroke="none"/>`),
    water: ic(`
      <path d="M16 3.5C18.6 7 20 9.2 20 11.2a4 4 0 0 1-8 0C12 9.2 13.4 7 16 3.5Z" fill="#7fb9d1"/>
      <path d="M14.3 11.5a1.9 1.9 0 0 0 1.7 1.9" fill="none" stroke="#fffdf8" stroke-width="1.1"/>
      <path d="M4.5 18.5H27.5L25 26a2 2 0 0 1-1.9 1.4H8.9A2 2 0 0 1 7 26Z" fill="#d9572b"/>
      <ellipse cx="16" cy="18.5" rx="11.5" ry="2.4" fill="#cfe5ef"/>
      <path d="M12.5 23.2a1.2 1.2 0 1 1 1.6-1h3.8a1.2 1.2 0 1 1 1.6 1 1.2 1.2 0 1 1-1.6 1h-3.8a1.2 1.2 0 1 1-1.6-1z" fill="#fffdf8" stroke="none"/>`),
    stretch: ic(`
      <path d="M4 27.5H30" fill="none"/>
      ${band('M7.6 13.4C5.8 11 5.8 8 7.6 6', TAN, 1.8)}
      <path d="M6 15C6 12.5 8 11.5 10 12C14 13 18 15.5 20.5 18C21 15.5 22.5 14 24.8 14C27 14 28.6 15.6 28.4 17.6L29.8 18.6C30.4 19.3 30 20.5 29 20.4L26.5 20.6C25.8 21.6 25 22 24 22.3L29 25.4C29.8 25.9 29.6 27 28.6 27H19.5C18.5 25 16 23 13 22L11.5 27H8.6L9 21C7.2 19.5 6 17.5 6 15Z" fill="${CREAM}"/>
      <path d="M23.6 15C22 15.8 21.8 18.6 23 20.4C24.3 19.8 24.8 17.4 24.6 15.2Z" fill="${TAN}"/>
      <path d="M21.3 17.6Q22.4 19.8 24.3 21.6" fill="none" stroke="#2e6a4f" stroke-width="1.8"/>
      <path d="M12.5 8.6l2-1.6M16.6 9.8l2-1.6" fill="none" stroke-width="1.3"/>
      <circle cx="26.6" cy="16.9" r="0.9" fill="${INK}" stroke="none"/><circle cx="29.5" cy="19.4" r="0.9" fill="${INK}" stroke="none"/>`),
    breathe: ic(`
      <path d="M4.5 22.5C4.5 15.5 10 11 17 11C23.8 11 28 15.5 28 21C28 24.3 25.6 26.5 22.4 26.5H8.6C6.2 26.5 4.5 25 4.5 22.5Z" fill="${CREAM}"/>
      ${band('M27.2 21.5C25.5 25.6 19.5 26.4 16.8 24.6', TAN, 1.8)}
      <path d="M5 22.8C5 19.6 7.6 17.6 10.6 17.6C13.6 17.6 15.6 19.4 15.6 22C15.6 24.6 13.6 26.4 10.6 26.4C7.6 26.4 5 25.6 5 22.8Z" fill="${CREAM}"/>
      <path d="M9.2 18C7.2 18.8 6.6 21.6 7.6 23.6C9 23.2 9.8 21 9.8 18.8Z" fill="${TAN}"/>
      <path d="M11.3 21.8q1.2 1 2.4 0" fill="none"/>
      <circle cx="15.1" cy="22.8" r="0.9" fill="${INK}" stroke="none"/>
      <path d="M20 5.2h3.4l-3.4 3.6h3.4M25.4 2.6h2.4l-2.4 2.4h2.4" fill="none" stroke-width="1.3"/>`),
    walk: ic(`
      ${band('M11 11.4C15 16 12.8 21.2 19.6 21.8', '#2e6a4f', 1.8)}
      ${band('M9.5 4.6C6 4.6 4 7 4.5 9.5C5 12 8 13 10.5 11.5C12.6 10.2 12.8 6.4 9.5 4.6Z', '#d9572b', 2.2)}
      ${band('M23.5 18.3a4.2 4.2 0 1 1 0 8.4a4.2 4.2 0 1 1 0-8.4Z', '#2e6a4f', 2.2)}
      <circle cx="23.5" cy="28.4" r="1.9" fill="#e8c25a" stroke-width="1.2"/>
      ${PAW_MINI(18.5, 3.2, 0.3)}${PAW_MINI(24.6, 6.4, 0.3)}`),
  };
  const CHIPS = {
    today: ic(`<g transform="translate(4 4)"><g fill="#fffdf8" stroke-width="1.3"><ellipse cx="12" cy="16.2" rx="5.6" ry="4.6"/><ellipse cx="5.2" cy="10.6" rx="2.3" ry="2.9" transform="rotate(-20 5.2 10.6)"/><ellipse cx="9.4" cy="6.4" rx="2.3" ry="3" transform="rotate(-6 9.4 6.4)"/><ellipse cx="14.6" cy="6.4" rx="2.3" ry="3" transform="rotate(6 14.6 6.4)"/><ellipse cx="18.8" cy="10.6" rx="2.3" ry="2.9" transform="rotate(20 18.8 10.6)"/></g></g>`),
    reminders: ic(`
      <path d="M9.6 8.2C5.8 8.4 4.2 13.4 5.3 17C7.2 17.2 9 14.4 10 11Z" fill="${TAN}"/>
      <path d="M22.4 8.2C26.2 8.4 27.8 13.4 26.7 17C24.8 17.2 23 14.4 22 11Z" fill="${TAN}"/>
      <path d="M10.6 26.2L8.8 28.6M21.4 26.2L23.2 28.6" fill="none"/>
      <circle cx="16" cy="17.2" r="9.6" fill="${CREAM}"/>
      <path d="M16 17.2V11.6M16 17.2L19.8 19.6" fill="none" stroke-width="1.8"/>
      <circle cx="16" cy="17.2" r="1.2" fill="#d9572b" stroke="none"/>`),
    away: ic(`
      <rect x="7" y="13.5" width="18" height="14" fill="${CREAM}"/>
      <path d="M4 15.5L16 5L28 15.5Z" fill="${TAN}"/>
      <path d="M12.3 27.5V21.5a3.7 3.7 0 0 1 7.4 0V27.5Z" fill="${INK}"/>
      <rect x="13.4" y="16.2" width="5.2" height="2.2" rx="0.6" fill="#d9572b" stroke-width="1"/>`),
    burnout: ic(`
      <rect x="14.5" y="3.4" width="3" height="2.8" rx="0.7" fill="#b84a26"/>
      <path d="M10.6 10a5.4 5.4 0 0 1 10.8 0Z" fill="#d9572b"/>
      <rect x="6.4" y="13.4" width="4.4" height="4.2" rx="1" fill="#b84a26"/>
      <rect x="21.2" y="13.4" width="4.4" height="4.2" rx="1" fill="#b84a26"/>
      <rect x="10" y="10" width="12" height="15" rx="1.2" fill="#d9572b"/>
      <rect x="9.4" y="10" width="13.2" height="2.2" rx="0.6" fill="${CREAM}"/>
      <circle cx="16" cy="17.6" r="2.1" fill="${CREAM}"/>
      <rect x="8" y="25" width="16" height="3.4" rx="1" fill="#b84a26"/>`),
    prefs: ic(`<g transform="rotate(-30 16 16)">
      <g fill="${INK}" stroke-width="3"><circle cx="8.4" cy="12.6" r="3.4"/><circle cx="8.4" cy="19.4" r="3.4"/><circle cx="23.6" cy="12.6" r="3.4"/><circle cx="23.6" cy="19.4" r="3.4"/><rect x="8.4" y="12.8" width="15.2" height="6.4"/></g>
      <g fill="#fffdf8" stroke="none"><circle cx="8.4" cy="12.6" r="3.4"/><circle cx="8.4" cy="19.4" r="3.4"/><circle cx="23.6" cy="12.6" r="3.4"/><circle cx="23.6" cy="19.4" r="3.4"/><rect x="8.4" y="12.8" width="15.2" height="6.4"/></g></g>`),
  };
  CHIPS.you = ic(`
      <path d="M9.4 8.6C6 8.8 4.4 14 5.6 17.6C7.6 17.8 9.4 15 10.2 11.4Z" fill="${TAN}"/>
      <path d="M22.6 8.6C26 8.8 27.6 14 26.4 17.6C24.4 17.8 22.6 15 21.8 11.4Z" fill="${TAN}"/>
      <path d="M16 7C21.6 7 24.6 10.8 24.4 15.6C24.2 20.4 20.8 23.6 16 23.6C11.2 23.6 7.8 20.4 7.6 15.6C7.4 10.8 10.4 7 16 7Z" fill="${CREAM}"/>
      <ellipse cx="16" cy="19" rx="4.6" ry="3.3" fill="#fff8ec" stroke="none"/>
      <circle cx="13" cy="14.4" r="1.2" fill="${INK}" stroke="none"/><circle cx="19" cy="14.4" r="1.2" fill="${INK}" stroke="none"/>
      <path d="M14.6 17.4Q16 16.6 17.4 17.4Q17.1 18.7 16 19Q14.9 18.7 14.6 17.4Z" fill="${INK}"/>
      <path d="M11.4 24.4Q16 27 20.6 24.4" fill="none" stroke="#2e6a4f" stroke-width="2"/>
      <circle cx="16" cy="26.9" r="1.4" fill="#d9572b" stroke-width="1"/>`);
  for (const el of document.querySelectorAll('.chip[data-icon]')) el.innerHTML = CHIPS[el.dataset.icon];

  const { settings, catalog, awayColors, firstRun, version, demo } = await window.paws.getSettings();
  const mascot = window.Mascot.mount($('mascot'));
  $('brand').innerHTML = `${window.Mascot.PAW}Paws`;
  $('apMark').className = 'ap-mark wordmark';
  $('apMark').innerHTML = `${window.Mascot.PAW}Paws`;
  $('welcome').hidden = !firstRun;
  $('version').textContent = `Paws ${version}${demo ? '  ·  demo mode: one minute is two seconds, wardrobe fully unlocked' : ''}`;
  const love = document.createElement('span');
  love.className = 'love';
  love.textContent = '♥';
  love.setAttribute('role', 'img');
  love.setAttribute('aria-label', 'love');
  const credit = document.createElement('span');
  credit.className = 'credit';
  credit.append('Made with ', love, ' by Priyu');
  $('version').append(credit);
  $('dateLine').textContent = new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });

  let saveTimer;
  let savePending = false;
  // A debounced save could be lost if the window closes inside the 250 ms window.
  window.addEventListener('beforeunload', () => {
    if (savePending) window.paws.saveSettingsNow(settings);
  });
  function save() {
    clearTimeout(saveTimer);
    savePending = true;
    saveTimer = setTimeout(async () => {
      savePending = false;
      await window.paws.saveSettings(settings);
      $('saved').classList.add('show');
      setTimeout(() => $('saved').classList.remove('show'), 1200);
      mascot.classList.add('happy');
      setTimeout(() => mascot.classList.remove('happy'), 1100);
    }, 250);
  }

  const human = (secs) => (secs >= 60 && secs % 60 === 0 ? `${secs / 60} min` : `${secs} sec`);

  // ---------- reminders ----------
  for (const [id, cfg] of Object.entries(settings.breaks)) {
    const meta = catalog[id];
    const r = RANGES[id];
    const row = document.createElement('div');
    row.className = 'rem';
    row.innerHTML = `
      <div class="swatch" style="--sw:${meta.field}">${ICONS[id]}</div>
      <div class="rem-name"><h3>${meta.title}</h3><p class="next" data-next="${id}"></p></div>
      <label class="field f-every"><span><span class="flabel">Every</span><b class="every-val"></b></span>
        <input type="range" class="every" min="${r.every[0]}" max="${r.every[1]}" step="${r.every[2]}" aria-label="${meta.title} every" /></label>
      <label class="field f-lasts"><span><span class="flabel">Lasts</span><b class="dur-val"></b></span>
        <input type="range" class="dur" min="${r.duration[0]}" max="${r.duration[1]}" step="${r.duration[2]}" aria-label="${meta.title} lasts" /></label>
      <button class="link try">Try it</button>
      <label class="switch"><input type="checkbox" aria-label="${meta.title}" /><span></span></label>`;
    const toggle = row.querySelector('.switch input');
    const every = row.querySelector('.every');
    const dur = row.querySelector('.dur');
    const paint = () => {
      row.classList.toggle('off', !cfg.enabled);
      row.querySelector('.every-val').textContent = `${cfg.every} min`;
      row.querySelector('.dur-val').textContent = human(cfg.duration);
    };
    toggle.checked = cfg.enabled;
    every.value = cfg.every;
    dur.value = cfg.duration;
    toggle.onchange = () => ((cfg.enabled = toggle.checked), paint(), save());
    every.oninput = () => ((cfg.every = Number(every.value)), paint(), save());
    dur.oninput = () => ((cfg.duration = Number(dur.value)), paint(), save());
    row.querySelector('.try').onclick = () => window.paws.preview(id);
    paint();
    $('remList').appendChild(row);
  }

  // ---------- switches and sliders ----------
  function bindSwitch(id, get, set) {
    const el = $(id);
    el.checked = get();
    el.onchange = () => (set(el.checked), save());
  }
  bindSwitch('marathonOn', () => settings.marathon.enabled, (v) => (settings.marathon.enabled = v));
  bindSwitch('winddownOn', () => settings.winddown.enabled, (v) => (settings.winddown.enabled = v));
  bindSwitch('weekdaysOnly', () => settings.winddown.weekdaysOnly, (v) => ((settings.winddown.weekdaysOnly = v), paintLabels()));
  bindSwitch('strict', () => settings.strict, (v) => (settings.strict = v));
  bindSwitch('pauseOnCalls', () => settings.pauseOnCalls, (v) => (settings.pauseOnCalls = v));
  bindSwitch('sound', () => settings.sound, (v) => (settings.sound = v));
  bindSwitch('launchAtLogin', () => settings.launchAtLogin, (v) => (settings.launchAtLogin = v));
  bindSwitch('report', () => settings.report, (v) => (settings.report = v));
  bindSwitch('outfit', () => settings.profile.outfit, (v) => (settings.profile.outfit = v));
  $('reportNow').onclick = () => window.paws.preview('report');
  $('quitBtn').onclick = () => window.paws.quit();
  bindSwitch('awayShortcut', () => settings.away.shortcut, (v) => (settings.away.shortcut = v));
  bindSwitch('awayLock', () => settings.away.lock, (v) => ((settings.away.lock = v), paintAway()));

  function paintLabels() {
    const h = settings.marathon.hours;
    $('marathonVal').textContent = `${h} hour${h === 1 ? '' : 's'}`;
    $('warnVal').textContent = settings.warnSeconds ? `${settings.warnSeconds} seconds` : 'no time at all';
    $('weekdayNote').textContent = settings.winddown.weekdaysOnly ? ' on weekdays' : ' every day';
  }
  $('marathonHours').value = settings.marathon.hours;
  $('marathonHours').oninput = (e) => ((settings.marathon.hours = Number(e.target.value)), paintLabels(), save());
  $('warnSeconds').value = settings.warnSeconds;
  $('warnSeconds').oninput = (e) => ((settings.warnSeconds = Number(e.target.value)), paintLabels(), save());
  $('winddownTime').value = settings.winddown.time;
  $('winddownTime').onchange = (e) => {
    if (/^\d\d:\d\d$/.test(e.target.value)) {
      settings.winddown.time = e.target.value;
      save();
    }
  };
  paintLabels();

  // ---------- away screen ----------
  const PRESETS = [
    ['Short walk', 'Out for a short walk', "Back in a few minutes. I'll be right back."],
    ['Lunch', 'At lunch', 'Back in about an hour.'],
    ['Coffee', 'Grabbing a coffee', 'Back in five. Want one?'],
    ['Meeting', 'In a meeting', "Send me a message, I'll reply after."],
    ['Walking the dog', 'Walking the dog', 'Metaphorically. Back soon.'],
  ];
  function paintAway() {
    const t = settings.away.title.trim() || 'Out for a short walk';
    $('apTitle').textContent = /[.!?…]$/.test(t) ? t : `${t}.`;
    $('apSub').textContent = settings.away.subtitle;
    const color = awayColors.find((c) => c.value === settings.away.color) || awayColors[0];
    $('awayPreview').style.setProperty('--away-bg', color.value);
    $('awayPreview').style.setProperty('--away-fg', color.light ? '#f3eee3' : '#17302a');
    $('colorName').textContent = color.name;
    for (const b of $('swatches').children) b.setAttribute('aria-checked', String(b.dataset.value === color.value));
    $('apLock').hidden = !settings.away.lock;
    $('awayHint').textContent = settings.away.lock ? 'Touching anything locks the PC.' : 'Move the mouse to come back.';
  }
  $('awayTitle').value = settings.away.title;
  $('awaySubtitle').value = settings.away.subtitle;
  $('awayTitle').oninput = (e) => ((settings.away.title = e.target.value), paintAway(), save());
  $('awaySubtitle').oninput = (e) => ((settings.away.subtitle = e.target.value), paintAway(), save());
  for (const [label, title, subtitle] of PRESETS) {
    const chip = document.createElement('button');
    chip.textContent = label;
    chip.onclick = () => {
      settings.away.title = $('awayTitle').value = title;
      settings.away.subtitle = $('awaySubtitle').value = subtitle;
      paintAway();
      save();
    };
    $('presets').appendChild(chip);
  }
  for (const c of awayColors) {
    const sw = document.createElement('button');
    sw.setAttribute('role', 'radio');
    sw.setAttribute('aria-label', c.name);
    sw.title = c.name;
    sw.dataset.value = c.value;
    sw.style.setProperty('--c', c.value);
    sw.onclick = () => {
      settings.away.color = c.value;
      paintAway();
      save();
    };
    $('swatches').appendChild(sw);
  }
  $('awayShow').onclick = () => window.paws.showAway();
  $('mastAway').onclick = () => window.paws.showAway();
  paintAway();

  // ---------- you & your dog ----------
  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };
  function paintNames() {
    const name = settings.profile.name.trim();
    const dog = settings.profile.dog.trim() || 'Paws';
    $('tagline').textContent = name ? `${greeting()}, ${name}. ${dog} is keeping an eye on you.` : `${dog} is keeping an eye on you. Your back will thank you.`;
    $('youBubble').textContent = name ? `${dog} heard the word "walk". No going back now, ${name}.` : `${dog} heard the word "walk". No going back now.`;
    $('youSig').textContent = `— ${dog}`;
    $('outfitLabel').textContent = `Let ${dog} dress up`;
    $('wardrobeTitle').textContent = `${dog}'s wardrobe`;
    $('reportDesc').textContent = `Every Friday afternoon, ${dog} grades your week.`;
  }

  // ---------- pet the dog ----------
  const HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2.1 0 3.5 1.2 4.3 2.4h2.6C14.1 6.2 15.5 5 17.6 5 21 5 23 8.4 21.6 11.7 19.5 16.4 12 21 12 21z"/></svg>';
  let pets = 0;
  let petTimer;
  let taglineTimer;
  function flashTagline(text, ms) {
    clearTimeout(taglineTimer);
    $('tagline').textContent = text;
    taglineTimer = setTimeout(paintNames, ms);
  }
  $('mascot').addEventListener('click', () => {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.innerHTML = HEART;
    heart.style.left = `${30 + Math.random() * 40}%`;
    heart.style.top = '10%';
    $('mascot').appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
    mascot.classList.add('happy');
    clearTimeout(petTimer);
    pets++;
    if (pets === 5) {
      const dog = settings.profile.dog.trim() || 'Paws';
      mascot.classList.add('celebrate');
      setTimeout(() => mascot.classList.remove('celebrate'), 3000);
      flashTagline(`${dog} rolled over. Belly rubs unlocked.`, 3000);
    }
    if (pets === 10) flashTagline('Priyu made me. Be nice to Priyu.', 4000);
    petTimer = setTimeout(() => {
      pets = 0;
      mascot.classList.remove('happy');
    }, 1600);
  });
  $('userName').value = settings.profile.name;
  $('dogName').value = settings.profile.dog;
  $('userName').oninput = (e) => (clearTimeout(taglineTimer), (settings.profile.name = e.target.value), paintNames(), save());
  $('dogName').oninput = (e) => (clearTimeout(taglineTimer), (settings.profile.dog = e.target.value), paintNames(), save());
  paintNames();

  // ---------- sticky section bar ----------
  const targets = [...$('jump').querySelectorAll('a')].map((a) => ({ a, el: $(a.dataset.target) }));
  function markSection() {
    let current = targets[0];
    for (const t of targets) if (t.el.getBoundingClientRect().top <= 100) current = t;
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) current = targets[targets.length - 1];
    targets.forEach((t) => t.a.classList.toggle('active', t === current));
  }
  addEventListener('scroll', markSection, { passive: true });
  addEventListener('resize', markSection);
  markSection();

  // ---------- live stats ----------
  let paused = false;
  $('pauseBtn').onclick = () => window.paws.pause(paused ? 0 : 60);

  function fmt(secs) {
    if (secs <= 0) return 'any second now';
    if (secs < 60) return `in ${secs}s`;
    const m = Math.ceil(secs / 60);
    return m < 60 ? `in ${m} min` : `in ${Math.floor(m / 60)}h ${m % 60}m`;
  }

  const dayName = (d, style = 'short') => new Date(`${d}T12:00`).toLocaleDateString([], { weekday: style });

  function drawWeek(week) {
    const max = Math.max(4, ...week.map((d) => d.taken));
    $('chart').setAttribute('aria-label', `Breaks per day this week: ${week.map((d) => `${dayName(d.date)} ${d.taken}`).join(', ')}`);
    $('chart').innerHTML = week
      .map((d, i) => `<div class="col${i === 6 ? ' today' : ''}" data-date="${d.date}" data-n="${d.taken}"><div class="bar" style="height:${(d.taken / max) * 100}%"></div></div>`)
      .join('');
    $('days').innerHTML = week.map((d, i) => `<span class="${i === 6 ? 'today' : ''}">${i === 6 ? 'Today' : dayName(d.date).slice(0, 2)}</span>`).join('');
    $('weekTable').innerHTML = `<tr><th>Day</th><th>Breaks</th></tr>${week.map((d) => `<tr><td>${d.date}</td><td>${d.taken}</td></tr>`).join('')}`;
  }

  $('chart').addEventListener('mousemove', (e) => {
    const col = e.target.closest('.col');
    const tip = $('tip');
    if (!col) return (tip.hidden = true);
    const n = Number(col.dataset.n);
    const date = new Date(`${col.dataset.date}T12:00`).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    tip.textContent = `${date}: ${n} break${n === 1 ? '' : 's'}`;
    const box = col.getBoundingClientRect();
    const host = col.closest('.fig').getBoundingClientRect();
    tip.style.left = `${box.left + box.width / 2 - host.left}px`;
    tip.style.top = `${box.top - host.top - 4}px`;
    tip.hidden = false;
  });
  $('chart').addEventListener('mouseleave', () => ($('tip').hidden = true));

  const GEAR_ICONS = {
    bandana: ic(`<path d="M5 10Q16 15 27 10L16 27Z" fill="#d9572b"/><path d="M5 10L2.6 7.4M27 10L29.4 7.4" fill="none"/><circle cx="12.5" cy="14.4" r="1.2" fill="#fffdf8" stroke="none"/><circle cx="19.5" cy="14.4" r="1.2" fill="#fffdf8" stroke="none"/><circle cx="16" cy="19.6" r="1.2" fill="#fffdf8" stroke="none"/>`),
    shades: ic(`<path d="M3.6 13.2L2 11M28.4 13.2L30 11" fill="none" stroke-width="2"/><rect x="3.4" y="11.4" width="11.2" height="9" rx="4" fill="${INK}"/><rect x="17.4" y="11.4" width="11.2" height="9" rx="4" fill="${INK}"/><path d="M14.6 14Q16 12.4 17.4 14" fill="none" stroke-width="1.8"/><path d="M6 15.6l3.2-2.6M20 15.6l3.2-2.6" fill="none" stroke="#fffdf8" stroke-width="1.3"/>`),
    hat: ic(`<path d="M8.5 27.5L16 6L23.5 27.5Z" fill="#e8c25a"/><path d="M11.6 21H20.4M13.6 14.6H18.4" fill="none" stroke="#d9572b" stroke-width="2.2"/><circle cx="16" cy="5" r="2.8" fill="#d9572b"/><path d="M7 27.5H25" fill="none"/>`),
    cape: ic(`<path d="M10 5Q7 16 3.5 27Q9 24.5 12.5 28Q16 25 19.5 28Q23 24.5 28.5 27Q25 16 22 5Z" fill="#2f7f78"/><path d="M10 5.6Q16 9 22 5.6" fill="none" stroke="#e8c25a" stroke-width="2.4"/>`),
    skateboard: ic(`<rect x="2.5" y="12.5" width="27" height="6.5" rx="3.2" fill="#e8c25a"/><path d="M7 15.8h4M21 15.8h4" fill="none" stroke="#d9572b" stroke-width="2"/><circle cx="9" cy="23.4" r="3" fill="${INK}"/><circle cx="23" cy="23.4" r="3" fill="${INK}"/>`),
    medal: ic(`<path d="M10 3L16 14.5L22 3" fill="none" stroke-width="5.6"/><path d="M10 3L16 14.5L22 3" fill="none" stroke="#d9572b" stroke-width="3"/><circle cx="16" cy="21" r="7.6" fill="#e8c25a"/><path d="M16 16.6l1.4 2.8 3 .4-2.2 2.1.5 3-2.7-1.4-2.7 1.4.5-3-2.2-2.1 3-.4z" fill="#fffdf8" stroke-width="1"/>`),
    crown: ic(`<path d="M5 25.5L6.4 9.5L12 17L16 6.5L20 17L25.6 9.5L27 25.5Z" fill="#e8c25a"/><circle cx="16" cy="20.4" r="2.1" fill="#d9572b"/><circle cx="10.2" cy="21.4" r="1.5" fill="#93c4bc" stroke-width="1"/><circle cx="21.8" cy="21.4" r="1.5" fill="#93c4bc" stroke-width="1"/>`),
  };
  let wardrobeKey = '';
  function drawWardrobe(s) {
    const key = `${s.best}|${s.gear.join()}|${s.demo}`;
    if (key === wardrobeKey) return;
    wardrobeKey = key;
    const best = s.demo ? Infinity : s.best;
    $('wardrobeNote').textContent = s.demo ? 'Demo mode: everything unlocked' : `Best streak: ${s.best} day${s.best === 1 ? '' : 's'}`;
    $('gearList').innerHTML = '';
    for (const g of s.gearList) {
      const have = best >= g.days;
      const left = g.days - s.best;
      const card = document.createElement('div');
      card.className = `gear${have ? '' : ' locked'}`;
      card.innerHTML = `<span class="tile">${GEAR_ICONS[g.id]}</span><span><b></b><small></small><span class="status"></span></span>`;
      card.querySelector('b').textContent = g.name;
      card.querySelector('small').textContent = g.label;
      card.querySelector('.status').textContent = have ? 'Unlocked' : `${left} more day${left === 1 ? '' : 's'}`;
      if (!have && g !== s.gearList.find((x) => best < x.days)) card.classList.add('far');
      $('gearList').appendChild(card);
    }
  }

  async function refresh() {
    const s = await window.paws.getStats();
    $('taken').textContent = s.today.taken;
    $('skipped').textContent = s.today.skipped;
    $('streak').textContent = s.streak;
    window.Mascot.setGear(mascot, s.gear);
    drawWardrobe(s);
    $('mood').textContent = s.today.moods[s.today.moods.length - 1] || 'None yet';
    drawWeek(s.week);

    paused = !!s.pausedUntil;
    $('pauseBtn').textContent = paused ? 'Resume reminders' : 'Pause for an hour';
    $('pulse').className = `pulse${paused ? ' paused' : s.inCall ? ' call' : ''}`;
    const next = s.upcoming[0];
    if (paused) {
      const t = new Date(s.pausedUntil).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      $('status').textContent = `Paused until ${t}`;
    } else if (s.inCall) {
      $('status').textContent = "You're on a call. Breaks are on hold.";
    } else if (next) {
      $('status').textContent = `Next: ${catalog[next.id].title.toLowerCase()} ${fmt(next.secs)}`;
    } else {
      $('status').textContent = 'All reminders are off.';
    }
    for (const el of document.querySelectorAll('[data-next]')) {
      const u = s.upcoming.find((x) => x.id === el.dataset.next);
      el.textContent = paused ? 'Paused' : u ? `Next ${fmt(u.secs)}` : 'Off';
    }
  }

  // ---------- first-run intro ----------
  const dogName = () => settings.profile.dog.trim() || 'Paws';
  const INTRO = [
    {
      act: '',
      title: () => `Hi, I'm ${dogName()}.`,
      text: "I'm a dog who cares about your back. I'll nudge you to take small breaks, so the work day doesn't wear you down. First, the important stuff:",
      extra: 'names',
    },
    {
      act: 'act-stretch',
      title: () => 'Small breaks, on time',
      text: 'Every so often I cover the screen for a moment: look away, sit up straight, drink water, stretch or go for a walk. Click anywhere or press Esc if you really have to skip.',
      extra: 'icons',
    },
    {
      act: 'act-walk',
      title: () => 'Stepping away?',
      text: 'Put up an away screen with your message. The moment anyone touches the mouse, Windows locks, so your desk stays private.',
      extra: 'keys',
    },
    {
      act: '',
      gear: ['bandana', 'shades', 'hat', 'cape', 'skateboard', 'medal', 'crown'],
      title: () => 'Keep a streak, earn an outfit',
      text: () => `Take breaks day after day and ${dogName()} earns a bandana, sunglasses, a superhero cape and, after a whole year, a crown. This is the full look.`,
    },
    {
      act: '',
      title: () => "I'll be in your tray",
      text: "Close this window any time. I'll keep watching from the ^ next to the clock. Right-click me there to pause or take a break.",
      extra: 'try',
      last: true,
    },
  ];
  const introMascot = window.Mascot.mount($('introDog'));
  let introStep = 0;

  function introExtra(kind) {
    const box = $('introExtra');
    box.innerHTML = '';
    if (kind === 'names') {
      for (const [id, label, key, placeholder] of [
        ['introName', 'What should I call you?', 'name', 'Your first name'],
        ['introDogName', "And what's my name?", 'dog', 'Paws'],
      ]) {
        const field = document.createElement('label');
        field.className = 'text-field';
        field.innerHTML = '<span></span><input type="text" maxlength="24" autocomplete="off" spellcheck="false" />';
        field.querySelector('span').textContent = label;
        const input = field.querySelector('input');
        input.id = id;
        input.placeholder = placeholder;
        input.value = settings.profile[key];
        input.oninput = () => {
          settings.profile[key] = input.value;
          $(key === 'name' ? 'userName' : 'dogName').value = input.value;
          paintNames();
          $('introTitle').textContent = INTRO[introStep].title();
          save();
        };
        box.appendChild(field);
      }
    } else if (kind === 'icons') {
      box.innerHTML = Object.keys(ICONS).map((id) => `<span class="intro-icon" style="--sw:${catalog[id].field}">${ICONS[id]}</span>`).join('');
    } else if (kind === 'keys') {
      box.innerHTML = '<span class="intro-keys"><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd></span>';
    } else if (kind === 'try') {
      const b = document.createElement('button');
      b.className = 'link';
      b.textContent = 'Show me a break';
      b.onclick = () => window.paws.preview('eyes');
      box.appendChild(b);
    }
  }

  function paintIntro() {
    const s = INTRO[introStep];
    $('introDog').className = `intro-dog ${s.act}`;
    window.Mascot.setGear(introMascot, s.gear || []);
    $('introTitle').textContent = s.title();
    $('introText').textContent = typeof s.text === 'function' ? s.text() : s.text;
    introExtra(s.extra);
    $('introDots').innerHTML = INTRO.map((_, i) => `<span class="${i === introStep ? 'on' : ''}"></span>`).join('');
    $('introBack').hidden = introStep === 0;
    $('introNext').textContent = s.last ? "Let's go" : 'Next';
    const card = $('introCard');
    card.classList.remove('swap');
    void card.offsetWidth;
    card.classList.add('swap');
  }

  function openIntro() {
    introStep = 0;
    paintIntro();
    $('intro').hidden = false;
    $('introNext').focus();
  }

  function closeIntro() {
    $('intro').hidden = true;
    if (!settings.introSeen) {
      settings.introSeen = true;
      save();
    }
  }

  $('introNext').onclick = () => {
    if (INTRO[introStep].last) return closeIntro();
    introStep++;
    paintIntro();
  };
  $('introBack').onclick = () => {
    introStep = Math.max(0, introStep - 1);
    paintIntro();
  };
  $('introSkip').onclick = closeIntro;
  $('introReplay').onclick = openIntro;
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('intro').hidden) closeIntro();
  });
  if (!settings.introSeen) openIntro();

  refresh();
  setInterval(refresh, 1000);
  window.paws.onStatsChanged(refresh);
})();
