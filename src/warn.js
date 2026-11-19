(async function () {
  const w = await window.paws.warnPayload();
  if (!w) return;
  const $ = (id) => document.getElementById(id);
  document.documentElement.style.setProperty('--field', w.field);
  window.Mascot.mount($('face'), { follow: false, gear: w.gear || [] });
  $('title').textContent = w.title;
  const SUBS = [
    "Finish your sentence. I'll wait. Briefly.",
    "Hit save. Trust me on this one.",
    "Wrap up that thought. I'm already wagging.",
    "Incoming break. Look busy while you can.",
    "Save the doc. Then save your spine.",
    "Final answer? Lock it in.",
  ];
  $('sub').textContent = `${w.dog || 'Paws'}: ${SUBS[Math.floor(Math.random() * SUBS.length)]}`;
  $('now').onclick = () => window.paws.warnAction('now');
  $('snooze').hidden = !w.canSnooze;
  $('snooze').textContent = w.snoozeLabel || 'Snooze 5 min';
  $('snooze').onclick = () => window.paws.warnAction('snooze');
  $('skip').hidden = !w.canSkip;
  $('skip').onclick = () => window.paws.warnAction('skip');

  const total = w.endsAt - Date.now();
  (function frame() {
    const left = Math.max(0, w.endsAt - Date.now());
    $('secs').textContent = Math.ceil(left / 1000);
    $('bar').style.width = `${(left / total) * 100}%`;
    if (left > 0) requestAnimationFrame(frame);
  })();
})();
