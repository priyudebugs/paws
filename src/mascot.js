(function () {
  const PAW =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16.2" rx="5.6" ry="4.6"/><ellipse cx="5.2" cy="10.6" rx="2.3" ry="2.9" transform="rotate(-20 5.2 10.6)"/><ellipse cx="9.4" cy="6.4" rx="2.3" ry="3" transform="rotate(-6 9.4 6.4)"/><ellipse cx="14.6" cy="6.4" rx="2.3" ry="3" transform="rotate(6 14.6 6.4)"/><ellipse cx="18.8" cy="10.6" rx="2.3" ry="2.9" transform="rotate(20 18.8 10.6)"/></svg>';

  function eye(cx) {
    return `<g class="m-eye">
      <ellipse class="m-eye-white" cx="${cx}" cy="86" rx="12" ry="13" />
      <g class="m-pupil"><circle cx="${cx}" cy="88" r="6.5" /><circle class="m-glint" cx="${cx + 2.6}" cy="85" r="2" /></g>
      <path class="m-lid" d="M${cx - 13} 86 A13 14 0 0 1 ${cx + 13} 86 Z" />
    </g>`;
  }

  function leg(side, d) {
    return `<path class="leg-o" d="${d}" /><path class="leg-i" d="${d}" />`;
  }

  function svg() {
    return `
<svg class="mascot" viewBox="-20 -30 240 250" aria-hidden="true">
  <ellipse class="m-shadow" cx="100" cy="196" rx="56" ry="8" />
  <g class="m-zzz"><text x="150" y="20">z</text><text x="168" y="0">Z</text><text x="188" y="-20">Z</text></g>
  <g class="m-sparkle">
    <path d="M100 -18 l5 13 13 5 -13 5 -5 13 -5 -13 -13 -5 13 -5z" />
    <path d="M152 6 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
    <path d="M46 8 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
  </g>
  <g class="m-walker">
    <g class="m-gear m-gear-cape">
      <path d="M68 140 Q50 168 34 192 Q58 184 74 196 Q100 186 126 196 Q142 184 166 192 Q150 168 132 140 Z" />
      <path class="cape-clasp" d="M70 142 Q100 152 130 142" />
    </g>
    <g class="m-gear m-gear-skateboard">
      <rect x="42" y="190" width="116" height="10" rx="5" />
      <path class="deck-stripe" d="M60 195 H76 M124 195 H140" />
      <circle cx="64" cy="206" r="6.5" /><circle cx="136" cy="206" r="6.5" />
    </g>
    <g class="m-feet">
      <g class="m-foot l"><ellipse cx="78" cy="186" rx="15" ry="8.5" /><path d="M72 183v5M78 182v6M84 183v5" /></g>
      <g class="m-foot r"><ellipse cx="122" cy="186" rx="15" ry="8.5" /><path d="M116 183v5M122 182v6M128 183v5" /></g>
    </g>
    <g class="m-body">
      <g class="m-tail"><path class="tail-o" d="M134 170 C152 170 162 158 164 140" /><path class="tail-i" d="M134 170 C152 170 162 158 164 140" /></g>
      <path class="m-torso" d="M60 188 C54 158 70 132 100 132 C130 132 146 158 140 188 Z" />
      <ellipse class="m-chest" cx="100" cy="170" rx="17" ry="13" />
      <g class="m-arm l">${leg('l', 'M76 150 Q74 166 78 180')}</g>
      <g class="m-arm r">${leg('r', 'M124 150 Q126 166 122 180')}</g>
      <g class="m-head">
        <path class="m-blob" d="M100 30 C142 30 164 58 162 94 C160 128 134 146 100 146 C66 146 40 128 38 94 C36 58 58 30 100 30 Z" />
        <ellipse class="m-patch" cx="122" cy="84" rx="21" ry="19" />
        <path class="m-ear l" d="M54 44 C30 46 18 90 28 116 C34 132 54 126 58 108 C62 90 66 58 54 44 Z" />
        <path class="m-ear r" d="M146 44 C170 46 182 90 172 116 C166 132 146 126 142 108 C138 90 134 58 146 44 Z" />
        <ellipse class="m-muzzle" cx="100" cy="117" rx="28" ry="20" />
        <ellipse class="m-cheek" cx="64" cy="114" rx="9" ry="5.5" />
        <ellipse class="m-cheek" cx="136" cy="114" rx="9" ry="5.5" />
        <g class="m-eyes">${eye(80)}${eye(120)}</g>
        <g class="m-happy-eyes"><path d="M68 90 Q80 78 92 90" /><path d="M108 90 Q120 78 132 90" /></g>
        <path class="m-nose" d="M90 104 Q100 98 110 104 Q108 113 100 115 Q92 113 90 104 Z" />
        <path class="m-mouth m-smile" d="M100 115 V121 M89 122 Q94.5 128 100 121 Q105.5 128 111 122" />
        <g class="m-mouth m-grin"><path class="m-grin-mouth" d="M86 121 Q100 142 114 121 Z" /><path class="m-tongue" d="M94 128 Q100 147 106 128 Z" /></g>
        <ellipse class="m-mouth m-o" cx="100" cy="127" rx="5" ry="6" />
        <path class="m-mouth m-wavy" d="M84 127 q4 -6 8 0 t8 0 t8 0 t8 0" />
        <path class="m-lap" d="M93.5 121 Q100 143 106.5 121 Z" />
        <path class="m-sweat" d="M158 34 q10 14 0 21 q-10 -7 0 -21z" />
        <g class="m-gear m-gear-shades">
          <path class="shade-arm" d="M66 82 L46 74 M134 82 L154 74" />
          <rect x="62" y="75" width="35" height="21" rx="9" />
          <rect x="103" y="75" width="35" height="21" rx="9" />
          <path class="shade-arm" d="M97 82 Q100 78 103 82" />
          <path class="shine" d="M69 86 l7 -6 M74 89 l5 -4 M110 86 l7 -6 M115 89 l5 -4" />
        </g>
        <g class="m-gear m-gear-crown">
          <path d="M74 42 L78 12 L91 28 L100 4 L109 28 L122 12 L126 42 Z" />
          <circle class="jewel" cx="100" cy="32" r="4" /><circle class="gem" cx="85" cy="35" r="2.8" /><circle class="gem" cx="115" cy="35" r="2.8" />
        </g>
        <g class="m-gear m-gear-hat" transform="rotate(-14 100 40)">
          <path class="hat" d="M82 42 L100 -6 L118 42 Z" />
          <path class="hat-stripe" d="M88 26 L112 26 M93 12 L107 12" />
          <circle class="pom" cx="100" cy="-9" r="8" />
        </g>
      </g>
      <path class="m-collar" d="M68 141 Q100 160 132 141" />
      <circle class="m-tag" cx="100" cy="157" r="6" />
      <g class="m-gear m-gear-bandana">
        <path class="scarf" d="M66 141 Q100 160 134 141 L104 182 Q100 186 96 182 Z" />
        <circle cx="90" cy="158" r="2.6" /><circle cx="110" cy="158" r="2.6" /><circle cx="100" cy="171" r="2.6" />
      </g>
      <g class="m-gear m-gear-medal">
        <path class="ribbon-o" d="M84 146 L100 172 L116 146" /><path class="ribbon" d="M84 146 L100 172 L116 146" />
        <circle cx="100" cy="178" r="11" />
        <path class="star" d="M100 171.5l2 4.2 4.6.6-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.6z" />
      </g>
    </g>
    <g class="m-bowl">
      <path class="bowl" d="M60 184 H140 L132 203 Q131 206 127 206 H73 Q69 206 68 203 Z" />
      <ellipse class="bowl-water" cx="100" cy="184" rx="40" ry="5.5" />
      <path class="bowl-bone" d="M91 195a2.6 2.6 0 1 1 3.4-2.2h11.2a2.6 2.6 0 1 1 3.4 2.2 2.6 2.6 0 1 1-3.4 2.2h-11.2a2.6 2.6 0 1 1-3.4-2.2z" />
    </g>
  </g>
</svg>`;
  }

  function setGear(root, gear = []) {
    for (const id of ['bandana', 'shades', 'hat', 'cape', 'skateboard', 'medal', 'crown']) root.classList.toggle(`gear-${id}`, gear.includes(id));
  }

  function mount(el, { follow = true, gear = [] } = {}) {
    el.innerHTML = svg();
    const root = el.querySelector('.mascot');
    setGear(root, gear);
    if (follow) {
      window.addEventListener('mousemove', (e) => {
        const r = root.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.38);
        const len = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, len / 300);
        root.style.setProperty('--px', `${((dx / len) * 4.5 * k).toFixed(2)}px`);
        root.style.setProperty('--py', `${((dy / len) * 4.5 * k).toFixed(2)}px`);
      });
    }
    return root;
  }

  window.Mascot = { mount, setGear, PAW };
})();
