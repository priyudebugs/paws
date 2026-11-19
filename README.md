# Paws

A friendly break buddy for Windows, with a dog who cares about your back. Paws lives in the system tray and takes over the screen when it's time to rest your eyes, drink water, fix your posture, stretch, breathe, or go for a walk. Paws also checks in when you've been working for hours without a real break, and tells you to log off at the end of the day.

## What it does

- Full-screen break on every monitor, with an animated mascot, steps, a countdown and confetti when you finish
- A heads-up pill 10 seconds before each break, with Start now, Snooze and Skip
- Six reminders you can turn on or off and tune: look away (20-20-20), posture, water, stretch, box breathing, walk
- Away screen: press Ctrl+Alt+B (or use the tray menu) to show "Out for a short walk" on every monitor, in a colour you pick. The moment anyone touches the mouse or keyboard, Windows locks and asks for your password (can be turned off in settings)
- Burnout guard: a mood check-in after long stretches of work, plus an end-of-day nudge
- Smart timing: does not count time while you are idle or locked, and holds breaks while your microphone is in use (calls)
- Strict mode removes the Skip and Snooze buttons
- Stats: breaks today, skipped, day streak, mood, and a 7-day chart
- Your name and your dog's name: the dog signs its speech bubbles, greets you, and has personal lines for every reminder
- Wardrobe: the dog earns a bandana (3-day streak), sunglasses (7 days), a party hat (30), a superhero cape (45), a skateboard (3 months), a gold medal (6 months) and a royal crown (1 year), and wears them everywhere. Weekends without breaks do not break a streak
- Friday report card: a weekly grade with your stats and one cheeky comment
- Pet the dog: click it in settings for hearts (and a surprise after five pets)
- Starts with Windows, and installs per user (no admin rights needed)

## Run it

```bash
npm install
node node_modules/electron/install.js   # only if npm skipped Electron's download
npm start          # normal timings
npm run demo       # 1 minute = 2 seconds and the full wardrobe unlocked, good for showing it off
```

## Build the installer

```bash
npm run dist
```

The installer is written to `dist/Paws-Setup-<version>.exe`.

## Rolling it out at work

- Double-click the setup file. It installs for the current user and starts right away.
- Silent install for IT tools (Intune, SCCM, a login script): `Paws-Setup-1.0.0.exe /S`
- Uninstall from Windows Settings > Apps. This also removes the start-with-Windows entry.
- The setup file is not code-signed, so Windows SmartScreen will show "Windows protected your PC" the first time. Click More info, then Run anyway. To remove that warning, sign the build with the company's code-signing certificate (set `CSC_LINK` and `CSC_KEY_PASSWORD` before `npm run dist`).

Settings and stats are stored in `%APPDATA%\Paws`.

## Project layout

- `main.js`: tray, scheduler, idle and call detection, break windows
- `src/breaks.js`: every break, its steps and its jokes
- `src/store.js`: settings and stats files
- `src/break.*`: the full-screen break
- `src/warn.*`: the heads-up pill
- `src/settings.*`: settings and stats window
- `src/mascot.*`: the animated mascot (SVG + CSS)
- `scripts/make-icons.js`: renders the app and tray icons

## License

MIT, see `LICENSE`. The bundled fonts (Source Serif 4 and Schibsted Grotesk, in `src/fonts`) are licensed separately under the SIL Open Font License 1.1.

---

Made with love by Priyu.
