const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const os = require('os');

const TEMP_DIR = path.join(os.tmpdir(), 'ptexteditor-autosave');

contextBridge.exposeInMainWorld('api', {
  onMenu: (channel, callback) => ipcRenderer.on(channel, (_, args) => callback(args)),
  onFileOpened: (callback) => ipcRenderer.on('file-opened', (_, data) => callback(data)),
  //saveFile: (data) => ipcRenderer.invoke('save-file', data),
  saveAsFile: (content) => ipcRenderer.invoke('save-as-file', content),
  //readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  saveFile: (path, content) => ipcRenderer.invoke('save-file', path, content),
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  // expose TEMP_DIR path to renderer
  getTempDir: () => TEMP_DIR,
});
