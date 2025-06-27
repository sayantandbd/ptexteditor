import { app, BrowserWindow, Menu, dialog, ipcMain, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
//import electronReload from 'electron-reload';

let mainWindow;

export const TEMP_DIR = path.join(os.tmpdir(), 'ptexteditor-autosave');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// electronReload(__dirname, {
//   electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
// });

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    // frame: false,
    // titleBarStyle: 'hidden', // for macOS
    icon: path.join(__dirname, 'assets/icons', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false, // optional
      webSecurity: true, // <-- Add this for drag-drop to access file.path
      sandbox: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
  } else {
    mainWindow.loadFile('dist/index.html');
  }

  mainWindow.webContents.on('will-navigate', (e) => e.preventDefault());
  mainWindow.webContents.on('new-window', (e) => e.preventDefault());

  mainWindow.webContents.openDevTools();

  setupMenu();
}

function setupMenu() {
  const template = [
    {
      label: 'PTextEditor',
      submenu: [
        {
          label: 'About pTextEditor',
          click: async () => {
            shell.openExternal('https://github.com/sayantandbd/ptexteditor');
          },
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu-new'),
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFile(),
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu-save'),
        },
        {
          label: 'Save As',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('menu-save-as'),
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [{ role: 'reload' }, { role: 'toggledevtools' }],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            shell.openExternal('https://electronjs.org');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function openFile() {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Text Files', extensions: ['txt'] }],
    })
    .then((result) => {
      if (!result.canceled) {
        const filePath = result.filePaths[0];
        const content = fs.readFileSync(filePath, 'utf-8');
        mainWindow.webContents.send('file-opened', { filePath, content });
      }
    });
}

ipcMain.handle('save-as-file', async (_, content) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  });

  if (filePath) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
  }
  return null;
});

ipcMain.on('close-tab', (_, id) => {
  mainWindow.webContents.send('tab-close-requested', id);
});

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.commandLine.appendSwitch('disable-gpu');

ipcMain.handle('save-file', async (event, filePath, content) => {
  return fs.promises.writeFile(filePath, content);
});

ipcMain.handle('read-file', async (event, filePath) => {
  return fs.promises.readFile(filePath, 'utf-8');
});

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}
