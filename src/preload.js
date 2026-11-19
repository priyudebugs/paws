const { contextBridge, ipcRenderer } = require('electron');

const on = (channel) => (cb) => ipcRenderer.on(channel, (_e, data) => cb(data));

contextBridge.exposeInMainWorld('paws', {
  breakPayload: () => ipcRenderer.invoke('break:payload'),
  breakAction: (type, data) => ipcRenderer.send('break:action', type, data),
  onComplete: on('break:complete'),
  onMood: on('break:mood'),

  awayPayload: () => ipcRenderer.invoke('away:payload'),
  awayEnd: () => ipcRenderer.send('away:end'),
  showAway: () => ipcRenderer.send('away:show'),

  warnPayload: () => ipcRenderer.invoke('warn:payload'),
  warnAction: (action) => ipcRenderer.send('warn:action', action),

  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  saveSettingsNow: (settings) => ipcRenderer.send('settings:save-now', settings),
  getStats: () => ipcRenderer.invoke('stats:get'),
  onStatsChanged: on('stats:changed'),
  preview: (id) => ipcRenderer.send('break:preview', id),
  pause: (minutes) => ipcRenderer.send('app:pause', minutes),
  quit: () => ipcRenderer.send('app:quit'),
});
