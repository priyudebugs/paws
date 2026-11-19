(function () {
  let ctx;

  function note(freq, start, length, gain = 0.12, type = 'sine') {
    ctx = ctx || new AudioContext();
    const t = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(gain, t + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + length + 0.05);
  }

  window.Sound = {
    chime() {
      note(659, 0, 0.9);
      note(880, 0.16, 1.2);
    },
    ding() {
      note(988, 0, 0.5, 0.06, 'triangle');
    },
    tada() {
      [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.09, 0.7, 0.1, 'triangle'));
    },
    soft(freq) {
      note(freq, 0, 1.6, 0.05);
    },
  };
})();
