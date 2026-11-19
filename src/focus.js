// Brings a window to the foreground on Windows, even when another app had keyboard focus.
// Windows refuses SetForegroundWindow from a background app; briefly attaching to the
// foreground thread's input queue is the standard way to be allowed to take over.
let api;

function load() {
  if (api !== undefined) return api;
  api = null;
  if (process.platform !== 'win32') return api;
  try {
    const koffi = require('koffi');
    const user32 = koffi.load('user32.dll');
    const kernel32 = koffi.load('kernel32.dll');
    api = {
      getForeground: user32.func('intptr_t __stdcall GetForegroundWindow()'),
      threadOf: user32.func('uint32_t __stdcall GetWindowThreadProcessId(intptr_t hWnd, intptr_t lpdwProcessId)'),
      attach: user32.func('int __stdcall AttachThreadInput(uint32_t idAttach, uint32_t idAttachTo, int fAttach)'),
      setForeground: user32.func('int __stdcall SetForegroundWindow(intptr_t hWnd)'),
      bringToTop: user32.func('int __stdcall BringWindowToTop(intptr_t hWnd)'),
      currentThread: kernel32.func('uint32_t __stdcall GetCurrentThreadId()'),
    };
  } catch (err) {
    console.error(`Paws could not load the focus helper: ${err.message}`);
  }
  return api;
}

function grabFocus(win) {
  if (!win || win.isDestroyed()) return;
  const a = load();
  if (a) {
    try {
      const hwnd = Number(win.getNativeWindowHandle().readBigUInt64LE());
      const fg = Number(a.getForeground());
      if (fg !== hwnd) {
        const me = a.currentThread();
        const other = fg ? a.threadOf(fg, 0) : 0;
        const attached = other && other !== me ? a.attach(me, other, 1) : 0;
        a.bringToTop(hwnd);
        a.setForeground(hwnd);
        if (attached) a.attach(me, other, 0);
      }
    } catch (err) {
      console.error(`Paws could not take focus: ${err.message}`);
    }
  }
  win.focus();
}

module.exports = { grabFocus };
