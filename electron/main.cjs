const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "PaperCreeper AI - Desktop",
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // O Electron vai carregar o servidor local
  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startBackend() {
  // Inicia o servidor Node.js (server.ts rodando via tsx ou node)
  // No Windows local, usaremos 'npm run dev' ou o servidor compilado
  serverProcess = spawn('npm', ['run', 'dev'], {
    shell: true,
    stdio: 'inherit'
  });

  // Espera o servidor ficar pronto na porta 3000 antes de abrir a janela
  waitOn({ resources: ['http://localhost:3000'] }).then(() => {
    createWindow();
  });
}

app.on('ready', startBackend);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
