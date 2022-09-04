const { app, BrowserWindow, desktopCapturer, ipcMain } = require('electron');
const path = require('path')
const { Worker } = require('worker_threads');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    // win.loadFile('index.html')
    win.loadURL('http://localhost:5500/src');
    win.openDevTools();
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    });

    require('dns').lookup(require('os').hostname(), (err, add, fam) => {
        let worker = new Worker(`${__dirname}/server.js`, { workerData: { ip: add } });
        ipcMain.handle('ip', () => add);
        ipcMain.handle('getSources', async () => {
            return await desktopCapturer.getSources({ types: ['window', 'screen', 'audio'] });
        });
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})