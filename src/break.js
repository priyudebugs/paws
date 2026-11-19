(async function () {
  const p = await window.paws.breakPayload();
  if (!p) return;

  const $ = (id) => document.getElementById(id);
  const names = p.names || { name: '', dog: 'Paws' };
  const fill = (t) => t.replace(/\{name\}/g, () => names.name).replace(/\{dog\}/g, () => names.dog);
  const shownAt = Date.now();
  const NAMED_CHEERS = ['{dog} approves. Tail wags all round.', ...(names.name ? ['Good human, {name}.', '{dog} is proud of you, {name}.', 'High paw, {name}.'] : [])];
  const body = document.body;
  const EYEBROWS = {
    eyes: 'The 20-20-20 rule',
    posture: 'Quick reset',
    water: 'Hydration',
    stretch: 'Guided stretch',
    breathe: 'Box breathing',
    walk: 'Movement break',
    marathon: 'Burnout check',
    winddown: 'End of day',
    report: 'Friday report card',
  };
  const PHASES = [
    { key: 'in', label: 'Breathe in, slowly', tone: 392 },
    { key: 'hold-in', label: 'Hold it there', tone: 440 },
    { key: 'out', label: 'And let it go', tone: 330 },
    { key: 'hold-out', label: 'Hold, empty', tone: 294 },
  ];
  const CHEERS = ['Good human.', "Who's a good human? You are.", 'Your body says thanks.', 'Treat earned. Back to it.', 'Tail wags all round.', 'Paws approves.', 'Gold star. Well, gold paw.', 'Ten out of ten. Would break again.', 'Look at you, taking care of yourself.', 'Break taken. Main character energy.'];
  const sound = p.sound && p.primary;

  document.documentElement.style.setProperty('--field', p.field);
  const mascot = window.Mascot.mount($('mascot'), { follow: p.act !== 'eyes', gear: p.gear || [] });
  $('eyebrow').textContent = EYEBROWS[p.id] || 'Break';
  $('title').textContent = p.title;
  $('quip').textContent = p.quip;
  $('sig').textContent = `— ${names.dog}`;
  if (sound) window.Sound.chime();

  const ordinal = p.takenToday + 1;
  const metaBase = `Break no. ${ordinal} today`;
  $('meta').textContent = metaBase;

  let act = p.act;
  let phase = '';
  let done = false;
  function paintClasses() {
    body.className = [`act-${act}`, phase && `phase-${phase}`, p.breathing && 'breathing', p.light && 'light', done && 'done']
      .filter(Boolean)
      .join(' ');
  }

  const segments = p.steps.map(() => {
    const seg = $('rule').appendChild(document.createElement('span'));
    return seg.appendChild(document.createElement('i'));
  });

  function showLater(el, delay) {
    setTimeout(() => {
      if (!done) el.hidden = false;
    }, delay);
  }
  if (p.canSnooze) {
    $('snooze').textContent = p.snoozeLabel;
    $('snooze').onclick = () => window.paws.breakAction('snooze');
    showLater($('snooze'), 2500);
  }
  if (p.canSkip) {
    $('skip').onclick = () => window.paws.breakAction('skip');
    showLater($('skip'), 2500);
    window.addEventListener('keydown', (e) => e.key === 'Escape' && window.paws.breakAction('skip'));
    // A click anywhere skips too, after a short grace so a click already in flight doesn't dismiss it.
    window.addEventListener('mousedown', (e) => {
      if (done || Date.now() - shownAt < 1500 || e.target.closest('button')) return;
      window.paws.breakAction('skip');
    });
  }
  window.addEventListener('keydown', (e) => e.key !== 'Escape' && e.preventDefault(), true);
  $('doneEarly').onclick = () => window.paws.breakAction('done');
  if (p.canAway) {
    $('away').onclick = () => window.paws.breakAction('away');
    showLater($('away'), 1200);
  }

  if (p.moods) {
    const box = $('moods');
    box.hidden = false;
    for (const m of p.moods) {
      const btn = document.createElement('button');
      btn.textContent = m.label;
      btn.dataset.label = m.label;
      btn.onclick = () => window.paws.breakAction('mood', m.label);
      box.appendChild(btn);
    }
  }

  function say(text) {
    const bubble = $('bubble');
    $('quip').textContent = text;
    bubble.classList.remove('bump');
    void bubble.offsetWidth;
    bubble.classList.add('bump');
  }

  window.paws.onMood((m) => {
    $('moods').classList.add('answered');
    for (const b of $('moods').children) b.classList.toggle('chosen', b.dataset.label === m.label);
    say(m.reply);
    if (m.label === 'Great' || m.label === 'Fine') mascot.classList.add('happy');
    if (sound) window.Sound.ding();
  });

  let step = -1;
  let breathPhase = -1;
  function setInstruction(text) {
    const el = $('instruction');
    el.textContent = text;
    el.classList.remove('swap');
    void el.offsetWidth;
    el.classList.add('swap');
  }

  function fmt(secs) {
    const s = Math.ceil(secs);
    return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : String(s);
  }

  function update() {
    const elapsed = (Date.now() - p.startedAt) / 1000;
    const left = Math.max(0, p.duration - elapsed);
    $('count').textContent = fmt(left);
    $('countLabel').textContent = left >= 60 ? 'minutes left' : Math.ceil(left) === 1 ? 'second left' : 'seconds left';

    let acc = 0;
    let idx = -1;
    for (let i = 0; i < p.steps.length; i++) {
      segments[i].style.width = `${Math.min(100, Math.max(0, ((elapsed - acc) / p.steps[i].secs) * 100))}%`;
      acc += p.steps[i].secs;
      if (idx < 0 && elapsed < acc) idx = i;
    }
    if (idx < 0) idx = p.steps.length - 1;
    if (idx !== step) {
      step = idx;
      if (!p.breathing) setInstruction(p.steps[idx].text);
      act = p.steps[idx].act || p.act;
      if (p.steps.length > 1) $('meta').textContent = `${metaBase}  ·  Step ${idx + 1} of ${p.steps.length}`;
      if (sound && idx > 0) window.Sound.ding();
    }

    if (p.breathing) {
      const n = Math.floor(elapsed / 4);
      if (n !== breathPhase) {
        breathPhase = n;
        const ph = PHASES[n % 4];
        phase = ph.key;
        setInstruction(ph.label);
        const rounds = Math.ceil(p.duration / 16);
        $('meta').textContent = `${metaBase}  ·  Round ${Math.min(Math.floor(n / 4) + 1, rounds)} of ${rounds}`;
        if (sound) window.Sound.soft(ph.tone);
      }
    }

    if (p.duration >= 30 && elapsed >= p.duration / 2 && $('doneEarly').hidden && !done) {
      $('doneEarly').hidden = false;
    }
    paintClasses();
  }

  update();
  const loop = setInterval(update, 200);

  window.paws.onComplete(({ taken, streak, unlocked, gear }) => {
    clearInterval(loop);
    done = true;
    phase = '';
    paintClasses();
    segments.forEach((s) => (s.style.width = '100%'));
    $('title').textContent = 'Nice.';
    $('count').textContent = 'Done';
    const streakText = streak > 1 ? `, ${streak}-day streak` : '';
    $('countLabel').textContent = `${taken} break${taken === 1 ? '' : 's'} today${streakText}`;
    mascot.classList.add('happy', 'celebrate');
    window.Mascot.setGear(mascot, gear || []);
    if (unlocked) {
      $('title').textContent = `New: ${unlocked.toLowerCase()}!`;
      say(`I earned the ${unlocked.toLowerCase()}! ${streak} days in a row. Thanks, ${names.name || 'human'}.`);
    } else {
      const useNamed = Math.random() < 0.45;
      const cheers = useNamed ? NAMED_CHEERS : CHEERS;
      say(fill(cheers[Math.floor(Math.random() * cheers.length)]));
    }
    if (sound) window.Sound.tada();
    confetti($('confetti'), p.light);
  });

  // Paper scraps in the house palette, drifting down rather than exploding.
  function confetti(canvas, light) {
    const g = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    g.scale(dpr, dpr);
    const colors = light ? ['#f3eee3', '#d9572b', '#fffdf8'] : ['#17302a', '#d9572b', '#fffdf8', '#17302a'];
    const parts = Array.from({ length: 90 }, () => ({
      x: Math.random() * innerWidth,
      y: -20 - Math.random() * innerHeight * 0.5,
      vy: 2.2 + Math.random() * 2.4,
      sway: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      w: 7 + Math.random() * 9,
      h: 4 + Math.random() * 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const start = performance.now();
    (function frame(now) {
      const t = (now - start) / 1000;
      g.clearRect(0, 0, innerWidth, innerHeight);
      const fade = Math.max(0, Math.min(1, (2.8 - t) / 0.6));
      for (const c of parts) {
        c.y += c.vy;
        c.r += c.vr;
        const x = c.x + Math.sin(t * 2.4 + c.phase) * 18 * c.sway;
        g.save();
        g.globalAlpha = fade;
        g.translate(x, c.y);
        g.rotate(c.r);
        g.scale(1, Math.cos(t * 4 + c.phase));
        g.fillStyle = c.color;
        g.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        g.restore();
      }
      if (fade > 0) requestAnimationFrame(frame);
    })(start);
  }
})();
