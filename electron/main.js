const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = !app.isPackaged; // opcional, para facilitar dev vs prod

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // se estiver usando preload
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000'); // se estiver rodando `npm start` no React
  } else {
    win.loadFile(path.join(__dirname, 'frontend/build/index.html')); // ✅ AQUI
  }
}

app.whenReady().then(createWindow);
