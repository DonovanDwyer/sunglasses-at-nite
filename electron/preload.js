const runFileSearch = require('./Components/searchFiles.js');
const { openFile } = require('./Components/openFile.js');
const { getVideoMetadata, captureThumbnail } = require('./Components/screenshots');
const EXT_TYPES = require('./Components/extTypes.js');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('videoApi', {
    runFileSearch: () => runFileSearch('../../Downloads', EXT_TYPES),
    playVideo: (path) => ipcRenderer.send('video:play', path),
    getVideoMetadata: (path, cb) => getVideoMetadata(path, cb),
    getMetadata2: () => ipcRenderer.invoke('video:metadata'),
    captureThumbnail: (path, timecode) => captureThumbnail(path, timecode),
    saveVideo: (video) => ipcRenderer.invoke('database:videos:save', video),
    queryVideo: (row, value) => ipcRenderer.invoke('database:videos:query', row, value),
    saveTag: (tag) => ipcRenderer.invoke('database:tags:save', tag),
    queryTag: (row, value) => ipcRenderer.invoke('database:tags:query', row, value),
    deleteTag: (row, value) => ipcRenderer.invoke('database:tags:delete', row, value),
    createTagVideoAssociation: (videoId, tagId) => ipcRenderer.invoke('database:videotags:save', videoId, tagId),
    queryTagAssociation: (videoId, tagId) => ipcRenderer.invoke('database:videotags:query', videoId, tagId),
    deleteTagAssociation: (videoId, tagId) => ipcRenderer.invoke('database:videotags:delete', videoId, tagId)
});

contextBridge.exposeInMainWorld('Database', {
    saveFileIfNotExists: (field, value) => ipcRenderer.invoke('database:files:save', field, value),
    saveMetadataIfNotExists: (field, value, fileId=null) => ipcRenderer.invoke('database:metadata:save', field, value, fileId),
    saveTagIfNotExists: (name) => ipcRenderer.invoke('database:tags:save', name),
    saveFileTagIfNotExists: (fileId, tagId) => ipcRenderer.invoke('database:filetags:save', fileId, tagId),
    saveCategoryIfNotExists: (name, parentId) => ipcRenderer.invoke('database:categories:save', name, parentId),
    getCategoryByID: (id) => ipcRenderer.invoke('database:category:get:id', id),
    getCategoryByParent: (parentId) => ipcRenderer.invoke('database:category:get:parent', parentId),
    getCategoryChildren: (parentId) => ipcRenderer.invoke('database:category:get:children', parentId),
    getCategoryFiles: (categoryId) => ipcRenderer.invoke('database:category:get:files', categoryId),
    saveChildCategoryIfNotExists: (parentId, childId) => ipcRenderer.invoke('database:categorycategories:save', parentId, childId),
    saveCategoryFilesIfNotExists: (categoryId, fileId) => ipcRenderer.invoke('database:categoryfiles:save', categoryId, fileId),
    getAllSavedMetadataForFile: (id) => ipcRenderer.invoke('database:metadata:get', id),
    getFileData: (dir, metadata) => ipcRenderer.invoke('database:files:get', dir, metadata)
})

contextBridge.exposeInMainWorld('FileSystem', {
    watch: (dir) => ipcRenderer.invoke('files:watch', dir),
    open: (dir) => ipcRenderer.invoke('files:open', dir),
    setTypes: (types) => ipcRenderer.invoke('files:types', types),
    search: (dir) => ipcRenderer.invoke('files:search', dir),
    sync: () => ipcRenderer.invoke('files:sync'),
    get: () => ipcRenderer.invoke('files:get'),
    getMetadata: (dir) => ipcRenderer.invoke('files:metadata', dir),
    getVideoMetadata: (dir) => ipcRenderer.invoke('files:metadata:video', dir)
})