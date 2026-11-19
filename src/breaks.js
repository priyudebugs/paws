// field = full-screen background; light = use paper-coloured text on it.
const BREAKS = {
  eyes: {
    title: 'Look away',
    every: 20,
    duration: 20,
    field: '#B9CEDC',
    act: 'eyes',
    steps: [{ secs: 20, text: 'Find something at least 20 feet (6 m) away and stare at it.' }],
    quips: [
      'Stare at the farthest thing you can see like it owes you money.',
      'Your screen will still be here. Probably.',
      'Blink a few times. Your eyeballs have been holding their breath.',
      "Pretend you're a lighthouse keeper scanning the horizon.",
      'The 20-20-20 rule: science, not a lottery draw.',
      'Look away like a dog that just heard its name.',
      'Your eyes are in a staring contest with a spreadsheet. The spreadsheet is winning.',
      'Focus on something far away. Like your weekend.',
      'Pixels: 0. Horizon: 1.',
      'Squint into the distance like a pirate who just spotted land.',
      "Gaze out the window like you're in a music video.",
      'Zoom out. Not the app. Your eyeballs.',
      'Find a tree. Say hi to it. With your eyes.',
      "Pretend there's a squirrel across the street. Track it.",
    ],
  },
  posture: {
    title: 'Posture check',
    every: 30,
    duration: 15,
    field: '#E8C25A',
    act: 'posture',
    steps: [
      { secs: 5, text: 'Feet flat. Back against the chair.' },
      { secs: 5, text: 'Shoulders down and back. Away from your ears.' },
      { secs: 5, text: 'Chin in. Screen at eye level. Tall like a giraffe.' },
    ],
    quips: [
      "You've been slowly turning into a shrimp. Let's fix that.",
      'Your spine called. It would like a word.',
      'Sit like you just got promoted.',
      'Imagine a string pulling the top of your head to the ceiling.',
      'Shrimp mode: off. Giraffe mode: on.',
      "You're leaning so close to the screen it's getting awkward. For both of you.",
      'Unhunch. Uncurl. Unshrimp.',
      "Sit like there's a cookie balanced on your head.",
      'Your chair has back support. It misses you.',
      'Shoulders are not earrings. Lower them.',
      'Your mom just walked in. Sit up straight.',
      'Good posture is free. Physiotherapy is not.',
      'Ears over shoulders, shoulders over hips. Be a very calm Jenga tower.',
    ],
  },
  water: {
    title: 'Drink some water',
    every: 45,
    duration: 20,
    field: '#93C4BC',
    act: 'water',
    steps: [{ secs: 20, text: 'A few real sips. Not coffee. Water.' }],
    quips: [
      "You're basically a houseplant with feelings. Water yourself.",
      'Your brain is about 75% water. Top it up.',
      "Coffee is a bean soup. It doesn't count.",
      'Sip sip hooray.',
      "If you're thirsty, you're already behind.",
      'Every good dog knows: water bowl first.',
      'Camels can go days without water. You are not a camel. Probably.',
      "Drink now so future you doesn't get the 4 PM headache.",
      'Phone: charger. Plant: water. You: also water.',
      'Chai is a hug, not hydration. Water first, chai later.',
      'Your water bottle has been sitting there judging you all day.',
      "Hydrate like you're about to present to the CEO.",
      'Water: the original energy drink.',
      "Glug glug. That's the sound of productivity.",
    ],
  },
  stretch: {
    title: 'Stretch it out',
    every: 60,
    duration: 60,
    field: '#F1A985',
    act: 'stretch',
    steps: [
      { secs: 12, text: 'Reach both arms up to the ceiling. Get tall.', act: 'stretch' },
      { secs: 12, text: 'Slowly roll your shoulders backwards, five times.', act: 'shoulders' },
      { secs: 12, text: 'Tilt your ear to your right shoulder. Hold.', act: 'tilt-right' },
      { secs: 12, text: 'Now the left side. Breathe.', act: 'tilt-left' },
      { secs: 12, text: 'Lace your fingers and push your palms forward.', act: 'stretch' },
    ],
    quips: [
      "You've been sitting like a question mark. Become an exclamation mark.",
      'Stretch like a cat that just woke up from a 14-hour nap.',
      'Your muscles filed a complaint with HR.',
      'Wiggle a little. Nobody is watching. (They might be.)',
      'Loosen up. Spreadsheets fear the flexible.',
      'Do the downward dog. I invented it.',
      "Stretch like nobody's on your Teams call. (Check first.)",
      "Unfold yourself. You're not origami.",
      'Reach for the ceiling like it has the last samosa.',
      'Shake it out like you just sent a risky email.',
      'Roll your shoulders like you are shrugging off Monday.',
      'Become a starfish for a moment. A professional starfish.',
      'Your wrists typed a novel today. Give them a little roll.',
      'Your spine is a slinky. Give it some bounce.',
    ],
  },
  breathe: {
    title: 'Breathe',
    every: 90,
    duration: 64,
    field: '#C7BEDA',
    act: 'breathe',
    breathing: true,
    steps: [{ secs: 64, text: 'Box breathing: in 4, hold 4, out 4, hold 4.' }],
    quips: [
      "Inbox can wait. Lungs can't.",
      'Breathe like you just closed every ticket.',
      'In through the nose, out through the mouth. Not through the emails.',
      'Four rounds. You can do anything for one minute.',
      'Breathe in calm. Breathe out that one email.',
      'Inhale confidence. Exhale "per my last email".',
      'Slow breath in, slower breath out. Fastest way to reboot a brain.',
      'Breathe like a sleeping dog: deep, slow, zero worries.',
      'Your lungs have 100% uptime. Show them some appreciation.',
      'Four in, four out. No meeting invite required.',
    ],
  },
  walk: {
    title: 'Go for a walk',
    every: 120,
    duration: 300,
    field: '#A6C389',
    act: 'walk',
    steps: [{ secs: 300, text: 'Get up and walk around for five minutes. Find some daylight if you can.' }],
    quips: [
      'Your chair needs a break from you too.',
      'Go touch grass. Or carpet. Any surface, really.',
      'Walkies! You know you want to.',
      'Walk to the window and judge the weather.',
      'Legs: those things under the desk. Use them.',
      'Refill the water bottle on the way. Two birds, one walk.',
      'Walk to a coworker instead of messaging them. Startle them a little.',
      'Your step count is looking suspicious. Fix that.',
      'The kettle misses you. Go say hello.',
      'Take the scenic route to the printer.',
      "Walk like you're late for something fun.",
      "Even I need walkies, and I'm a drawing.",
      'Great ideas show up on walks. Go and collect one.',
      'Your legs have been on mute all morning. Unmute them.',
    ],
  },
};

const SPECIAL = {
  marathon: {
    title: 'How are you holding up?',
    short: 'Burnout check',
    duration: 45,
    field: '#E07A5C',
    act: 'burnout',
    mood: true,
    steps: [{ secs: 45, text: "You've been at it for hours. Be honest." }],
    quips: [
      "You're doing a lot. That's exactly why you need this.",
      "Running on fumes isn't a personality trait.",
      'Even Wi-Fi routers need a restart.',
      "You've been in the zone so long, the zone is charging rent.",
      'Your brain has 37 tabs open. Close a few.',
      'Hero mode looks great in movies. In real life it causes back pain.',
      "Burnout doesn't send a calendar invite. Consider this the invite.",
      'Even the office plant takes breaks. It calls it photosynthesis.',
    ],
  },
  winddown: {
    title: 'Time to wind down',
    duration: 20,
    field: '#27304A',
    light: true,
    act: 'sleepy',
    steps: [{ secs: 20, text: "Write down tomorrow's first task, then log off." }],
    quips: [
      'The emails will survive until tomorrow. Probably.',
      'Rest is part of the work, not a reward for finishing it.',
      'Future you will be grateful.',
      "Log off like nobody's watching your green dot.",
      'Your laptop needs sleep. So do you. Coincidence? No.',
      'Your to-do list has had enough of you for today. Go home.',
      'Tomorrow-you has this covered. Trust them.',
      'Shut down, not burn down.',
      'Close the tabs. Close the laptop. Open the evening.',
    ],
  },
};

// Weekly report card; its title, text and joke are built from the week's stats when it starts.
SPECIAL.report = {
  title: 'Report card',
  short: 'Friday report card',
  duration: 25,
  field: '#E8C25A',
  act: 'posture',
  steps: [{ secs: 25, text: '' }],
  quips: ['Solid week.'],
};

// Accessories the dog earns from the best streak so far (days in a row with at least one break).
const GEAR = [
  { id: 'bandana', name: 'Bandana', days: 3, label: '3-day streak' },
  { id: 'shades', name: 'Sunglasses', days: 7, label: '7-day streak' },
  { id: 'hat', name: 'Party hat', days: 30, label: '30-day streak' },
  { id: 'cape', name: 'Superhero cape', days: 45, label: '45-day streak' },
  { id: 'skateboard', name: 'Skateboard', days: 90, label: '3-month streak' },
  { id: 'medal', name: 'Gold medal', days: 180, label: '6-month streak' },
  { id: 'crown', name: 'Royal crown', days: 365, label: '1-year streak' },
];

const MOODS = [
  { label: 'Fried', reply: 'Okay. Step away for ten minutes, for real. Tell someone if it keeps happening.' },
  { label: 'Meh', reply: 'Fair. Grab some water and a snack. Small wins count.' },
  { label: 'Fine', reply: "Good. Keep it that way: take your breaks, they're free." },
  { label: 'Great', reply: 'Love that. Bottle this feeling and stretch anyway.' },
];

// Personal lines; {name} and {dog} are filled from the user's profile. Lines with {name} only show once a name is set.
const NAMED = {
  eyes: [
    '{name}, look at something far away. {dog} is checking.',
    '{dog} spotted a squirrel out the window. Go and look, {name}.',
    '{dog} says your eyes need a holiday. A short one.',
  ],
  posture: [
    '{name}, {dog} sits up straighter than you. Think about that.',
    'Sit up, {name}. {dog} is taking notes.',
    '{dog} has perfect posture and zero back problems. Be like {dog}.',
  ],
  water: [
    '{dog} just finished a whole water bowl. Your turn, {name}.',
    "Hydrate, {name}. {dog}'s orders.",
    '{dog} would never skip water. Just saying.',
  ],
  stretch: [
    '{dog} stretches after every nap. Copy {dog}, {name}.',
    "Big stretch, {name}. {dog} is doing one too.",
    '{dog} invented this move. Respect the classics.',
  ],
  breathe: [
    'Breathe with {dog}, {name}. In, and out.',
    '{dog} is breathing slowly right now. Join in.',
  ],
  walk: [
    "{dog} heard the word 'walk'. No going back now, {name}.",
    '{name}, {dog} has brought you the leash. Again.',
    '{dog} is at the door doing the little dance. Go, {name}.',
  ],
  marathon: [
    "{name}, {dog} is worried about you. And {dog} doesn't worry easily.",
    '{dog} thinks you need a snack and a sniff of fresh air.',
  ],
  winddown: [
    "{name}, {dog} says it's time to go home.",
    '{dog} has already logged off. Follow the expert.',
  ],
};

// A completed break also resets the timers of the breaks it covers.
const COVERS = {
  walk: ['eyes', 'posture', 'stretch', 'breathe'],
  stretch: ['eyes', 'posture'],
  breathe: ['eyes'],
};

// Background choices for the away screen; light = needs paper-coloured text.
const AWAY_COLORS = [
  { name: 'Mist', value: '#f1f4f2' },
  { name: 'Haze', value: '#b9cedc' },
  { name: 'Marigold', value: '#e8c25a' },
  { name: 'Lagoon', value: '#93c4bc' },
  { name: 'Apricot', value: '#f1a985' },
  { name: 'Lilac', value: '#c7beda' },
  { name: 'Fern', value: '#a6c389' },
  { name: 'Clay', value: '#e07a5c' },
  { name: 'Night', value: '#27304a', light: true },
];

const PRIORITY = ['winddown', 'report', 'marathon', 'walk', 'stretch', 'breathe', 'water', 'posture', 'eyes'];

function getBreak(id) {
  return BREAKS[id] || SPECIAL[id];
}

module.exports = { BREAKS, SPECIAL, NAMED, GEAR, MOODS, COVERS, PRIORITY, AWAY_COLORS, getBreak };
