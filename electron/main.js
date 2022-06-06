const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const initializeDatabase = require('./Components/DatabaseHandler/DatabaseContainer.js');
const FileSystemHandler = require('./Components/FileSystemHandler/FileSystemHandler.js');
const { 
  runCommand, 
  get, 
  saveFileIfNotExists, 
  saveMetadataIfNotExists, 
  saveTagIfNotExists,
  saveFileTagIfNotExists,
  getAllSavedMetadataForFile, 
  saveChildCategoryIfNotExists,
  saveCategoryFilesIfNotExists,
  getCategoriesByID,
  getCategoriesByParent,
  getCategoryChildren,
  getCategoryFiles,
  getFileData, 
  saveCategoryIfNotExists
} = require('./Components/DatabaseHandler/DatabaseHandler.js');

const createWindow = () => {
    const win = new BrowserWindow({
      show: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
    win.maximize();
    win.show();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

app.whenReady().then(() => {
  initializeDatabase();
  ipcMain.handle('database:files:save', async (event, field, value) => {
    const res = await saveFileIfNotExists(field, value);
    return res;
  })
  ipcMain.handle('database:files:get', async (event, dir, metadata) => {
    const res = await getFileData(dir, metadata);
    return res;
  })
  ipcMain.handle('database:metadata:save', async (event, field, value, fileId=null) => {
    const res = await saveMetadataIfNotExists(field, value, fileId);
    return res;
  })
  ipcMain.handle('database:metadata:get', async (event, id) => {
    const res = await getAllSavedMetadataForFile(id);
    return res;
  })
  ipcMain.handle(`database:tags:save`, async (event, name) => {
    const res = await saveTagIfNotExists(name);
    return res;
  })
  ipcMain.handle(`database:filetags:save`, async (event, fileId, tagId) => {
    const res = await saveFileTagIfNotExists(fileId, tagId);
    return res;
  })
  ipcMain.handle('database:categories:save', async (event, name, parentId) => {
    const res = await saveCategoryIfNotExists(name, parentId);
    return res;
  })
  ipcMain.handle('database:category:get:id', async (event, id) => {
    const res = await getCategoriesByID(id);
    return res;
  })
  ipcMain.handle('database:category:get:parent', async (event, parentId) => {
    const res = await getCategoriesByParent(parentId);
    return res;
  })
  ipcMain.handle('database:category:get:children', async (event, parentId) => {
    const res = await getCategoryChildren(parentId);
    return res;
  })
  ipcMain.handle('database:category:get:files', async (event, categoryId) => {
    const res = await getCategoryFiles(categoryId);
    return res;
  })
  ipcMain.handle('database:categorycategories:save', async (event, parentId, childId) => {
    const res = await saveChildCategoryIfNotExists(parentId, childId);
    return res;
  })
  ipcMain.handle('database:categoryfiles:save', async (event, categoryId, fileId) => {
    const res = await saveCategoryFilesIfNotExists(categoryId, fileId);
    return res;
  })

  let fileSystemHandler = new FileSystemHandler();
  ipcMain.handle('files:watch', (event, dir) => {
      const res = fileSystemHandler.watch(dir);
      console.log(res);
  })
  ipcMain.handle('files:open', (event, dir) => {
      fileSystemHandler.open(dir);
  })
  ipcMain.handle('files:types', (event, types) => {
      const res = fileSystemHandler.setTypes(types);
      console.log(res);
  })
  ipcMain.handle('files:search', async (event, dir) => {
      const res = await fileSystemHandler.search(dir);
      return res;
  })
  ipcMain.handle('files:sync', async (event) => {
    const res = await fileSystemHandler.sync();
    return res;
  })
  ipcMain.handle('files:get', (event) => {
      const res = fileSystemHandler.get();
      return res;
  })
  ipcMain.handle('files:metadata', (event, dir) => {
      const res = fileSystemHandler.metadata(dir);
      return res;
  })
  ipcMain.handle('files:metadata:video', (event, dir) => {
    const res = fileSystemHandler.videoMetadata(dir);
    return res;
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})