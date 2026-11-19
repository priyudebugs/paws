(async function () {
  const a = await window.paws.awayPayload();
  if (!a) return;
  const $ = (id) => document.getElementById(id);
  document.documentElement.style.setProperty('--field', a.field);
  document.body.classList.toggle('light', a.light);
  if (a.locks) document.getElementById('hint').textContent = 'Locked · Windows password needed to come back';

  const title = /[.!?…]$/.test(a.title) ? a.title : `${a.title}.`;
  $('title').textContent = title;
  $('subtitle').textContent = a.subtitle;
  if (a.name) $('eyebrow').textContent = `${a.name} is away from the desk`;
  $('guard').textContent = `${a.dog || 'Paws'} is guarding the desk.`;
  window.Mascot.mount($('mascot'), { follow: false, gear: a.gear || [] });

  const at = new Date(a.since).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  function paintSince() {
    const mins = Math.floor((Date.now() - a.since) / 60000);
    const ago = mins < 1 ? 'just now' : mins < 60 ? `${mins} minute${mins === 1 ? '' : 's'} ago` : `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
    $('since').textContent = `Stepped away at ${at}, ${ago}`;
  }
  paintSince();
  setInterval(paintSince, 15000);

  window.addEventListener('keydown', () => window.paws.awayEnd());
  window.addEventListener('mousedown', () => window.paws.awayEnd());
})();
