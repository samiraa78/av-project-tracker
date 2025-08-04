const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ProjectDatabase = require('./database');

const db = new ProjectDatabase();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for database operations
ipcMain.handle('get-all-projects', () => {
  return db.getAllProjects();
});

ipcMain.handle('add-project', (event, project) => {
  return db.addProject(project);
});

ipcMain.handle('update-project', (event, id, updates) => {
  return db.updateProject(id, updates);
});

ipcMain.handle('delete-project', (event, id) => {
  return db.deleteProject(id);
});

ipcMain.handle('get-projects-by-status', (event, status) => {
  return db.getProjectsByStatus(status);
});