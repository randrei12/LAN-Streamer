const { contextBridge, ipcRenderer  } = require('electron');

ipcRenderer.invoke('ip').then(ip => {
    contextBridge.exposeInMainWorld('electron', {
        getSources: async () => await ipcRenderer.invoke('getSources'),
        ip,
    });
})
