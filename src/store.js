const fs = require('fs');
const path = require('path');
const { BREAKS } = require('./breaks');

function defaults() {
  const breaks = {};
  for (const [id, b] of Object.entries(BREAKS)) {
    breaks[id] = { enabled: id !== 'breathe', every: b.every, duration: b.duration };
  }
  return {
    breaks,
    marathon: { enabled: true, hours: 3 },
    winddown: { enabled: true, time: '18:00', weekdaysOnly: true },
    away: { title: 'Out for a short walk', subtitle: "Back in a few minutes. I'll be right back.", color: '#f1f4f2', shortcut: true, lock: true },
    profile: { name: '', dog: '', outfit: true },
    report: true,
    introSeen: false,
    strict: false,
    sound: true,
    pauseOnCalls: true,
    warnSeconds: 10,
    launchAtLogin: true,
    idleResetMinutes: 5,
  };
}

function merge(base, over) {
  if (typeof base !== 'object' || base === null || Array.isArray(base)) {
    return over === undefined || typeof over !== typeof base ? base : over;
  }
  const out = {};
  for (const key of Object.keys(base)) out[key] = merge(base[key], over ? over[key] : undefined);
  return out;
}

class JsonFile {
  constructor(file, fallback) {
    this.file = file;
    this.fallback = fallback;
  }

  read() {
    try {
      return JSON.parse(fs.readFileSync(this.file, 'utf8'));
    } catch {
      return this.fallback();
    }
  }

  write(data) {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const tmp = `${this.file}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
      fs.renameSync(tmp, this.file);
    } catch (err) {
      console.error(`Paws could not save ${this.file}: ${err.message}`);
    }
  }
}

function clamp(v, lo, hi, fallback) {
  return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback;
}

function sanitize(s) {
  const d = defaults();
  for (const [id, b] of Object.entries(s.breaks)) {
    b.every = clamp(b.every, 5, 480, d.breaks[id].every);
    b.duration = clamp(b.duration, 5, 1800, d.breaks[id].duration);
  }
  s.marathon.hours = clamp(s.marathon.hours, 0.5, 12, d.marathon.hours);
  s.warnSeconds = clamp(s.warnSeconds, 0, 60, d.warnSeconds);
  s.idleResetMinutes = clamp(s.idleResetMinutes, 1, 60, d.idleResetMinutes);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s.winddown.time)) s.winddown.time = d.winddown.time;
  s.profile.name = s.profile.name.slice(0, 24);
  s.profile.dog = s.profile.dog.slice(0, 24);
  s.away.title = s.away.title.slice(0, 60);
  s.away.subtitle = s.away.subtitle.slice(0, 110);
  return s;
}

function today(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function createStore(dir) {
  const settingsFile = new JsonFile(path.join(dir, 'settings.json'), () => null);
  const statsFile = new JsonFile(path.join(dir, 'stats.json'), () => ({ days: {} }));
  const firstRun = settingsFile.read() === null;
  let settings = sanitize(merge(defaults(), settingsFile.read() || {}));
  if (firstRun) settingsFile.write(settings);
  let stats = statsFile.read();
  if (!stats || typeof stats !== 'object' || !stats.days || typeof stats.days !== 'object') stats = { days: {} };

  function day(key = today()) {
    if (!stats.days[key]) stats.days[key] = { taken: 0, skipped: 0, moods: [], byType: {} };
    return stats.days[key];
  }

  // Calendar days covered by the current run, ending on its last day with breaks.
  // Today (not over yet) and empty weekend days are allowed gaps; an empty weekday ends the run.
  function streak() {
    const d = new Date();
    for (let i = 0; !(stats.days[today(d)]?.taken > 0); i++) {
      const weekend = d.getDay() === 0 || d.getDay() === 6;
      if (i > 7 || (i > 0 && !weekend)) return 0;
      d.setDate(d.getDate() - 1);
    }
    let walked = 0;
    let length = 0;
    for (let i = 0; i < 4000; i++) {
      const weekend = d.getDay() === 0 || d.getDay() === 6;
      if (stats.days[today(d)]?.taken > 0) length = walked + 1;
      else if (!weekend) break;
      walked++;
      d.setDate(d.getDate() - 1);
    }
    return length;
  }

  return {
    firstRun,
    getSettings: () => settings,
    saveSettings(next) {
      settings = sanitize(merge(defaults(), next));
      settingsFile.write(settings);
      return settings;
    },
    record(id, result, mood) {
      const d = day();
      if (result === 'done') {
        d.taken++;
        d.byType[id] = (d.byType[id] || 0) + 1;
      } else if (result === 'skipped') {
        d.skipped++;
      }
      if (mood) d.moods.push(mood);
      stats.best = Math.max(stats.best || 0, streak());
      statsFile.write(stats);
    },
    summary() {
      const d = day();
      const week = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = today(date);
        week.push({ date: key, taken: stats.days[key]?.taken || 0 });
      }
      return { today: d, streak: streak(), best: Math.max(stats.best || 0, streak()), week };
    },
    weekReport() {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      const out = { taken: 0, skipped: 0, byType: {}, best: null, days: 0 };
      for (const d = start; d <= now; d.setDate(d.getDate() + 1)) {
        const rec = stats.days[today(d)];
        if (!rec) continue;
        out.taken += rec.taken;
        out.skipped += rec.skipped;
        if (rec.taken) out.days++;
        for (const [k, v] of Object.entries(rec.byType || {})) out.byType[k] = (out.byType[k] || 0) + v;
        if (!out.best || rec.taken > out.best.taken) out.best = { date: today(d), taken: rec.taken };
      }
      return out;
    },
    lastWinddown: () => stats.lastWinddown || null,
    markWinddown(key) {
      stats.lastWinddown = key;
      statsFile.write(stats);
    },
    lastReport: () => stats.lastReport || null,
    markReport(key) {
      stats.lastReport = key;
      statsFile.write(stats);
    },
  };
}

module.exports = { createStore, defaults, today };
