const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let serverProcess;

function startServer() {
    // Start your Node.js server
    serverProcess = exec('node server.js', (err, stdout, stderr) => {
        if (err) {
            console.error('Server error:', err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load the web app served by local Node.js
    win.loadURL('http://localhost:3000');

    win.on('closed', () => {
        if (serverProcess) serverProcess.kill(); // stop server when app closes
    });
}

app.whenReady().then(() => {
    startServer();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (serverProcess) serverProcess.kill();
        app.quit();
    }
});
