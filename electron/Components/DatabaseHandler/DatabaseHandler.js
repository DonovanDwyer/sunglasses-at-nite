const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const FileSystemHandler = require('../FileSystemHandler/FileSystemHandler');
const { parseFilename } = require('../UtilityFunctions/UtilityFunctions');

const sunglassesDB = () => {
    const db = new sqlite3.Database(path
        .join(__dirname, '..', '..', '..', 'src', 'db', 'SunglassesDB' + '.db'),
        error => {if (error) console.error(error)});
    return db;
}

const runCommand = (command) => {
    const db = sunglassesDB();
    return new Promise ((resolve, reject) => {
        db.run(command, function (error){
            if (error) reject(error);
            if (this.lastID && this.changes){
                console.log(`##### SUCCESS: '${command}'; TARGET ROW: ${this.lastID}; NUMBER OF CHANGES: ${this.changes} #####`);
                console.log('')
                resolve(this.lastID);
            } else {
                console.log(`##### FAILED: '${command}' #####`);
                console.log('')
                resolve(undefined);
            }
        });
        db.close();
    });
}

const get = (query) => {
    const db = sunglassesDB();
    const asyncQuery = (q) => {
        return new Promise ((resolve, reject) => {
            db.get(q, [], function (error, row){
                if (error) reject(console.error(error));
                if (row) {
                    console.log(`##### SUCCESS: '${q}'; RESPONSE: ${JSON.stringify(row)} #####`);
                    console.log('')
                    resolve(row);
                } else {
                    console.log(`##### FAILED: '${q}' #####`);
                    console.log('')
                    resolve(undefined);
                }
                
            });
        });
    }
        try {
            const result = asyncQuery(query);
            db.close();
            return result;
        } catch (error) {
            db.close();
            throw error;
        }
}

const all = (query) => {
    const db = sunglassesDB();
    const asyncQuery = (q) => {
        return new Promise ((resolve, reject) => {
            db.all(q, [], function (error, rows){
                if (error) reject(console.error(error));
                if (rows) {
                    console.log(`##### SUCCESS: '${q}'; RESPONSE: ${JSON.stringify(rows)} #####`);
                    console.log('')
                    resolve(rows);
                } else {
                    console.log(`##### FAILED: '${q}' #####`);
                    console.log('')
                    resolve(undefined);
                }
                
            });
        });
    }
        try {
            const result = asyncQuery(query);
            db.close();
            return result;
        } catch (error) {
            db.close();
            throw error;
        }
}

const saveFileIfNotExists = async (field, value) => {
    if (field === undefined || value === undefined) return undefined;
    const column = JSON.stringify(field);
    const row = JSON.stringify(value);
    const query =  `SELECT * FROM files WHERE ${column} = ${row}`;
    const result = await get(query);
    if (result){
        return result.id;
    } else {
        let id = await runCommand(`INSERT INTO files(${column}) VALUES (${row})`);
        return id;
    }
}

const saveMetadataIfNotExists = async (field, value, fileId=null) => {
    const row1 = JSON.stringify(field);
    const row2 = JSON.stringify(value);
    const query =  `SELECT * FROM metadata WHERE field_name = ${row1} AND field_value = ${row2}`;
    const result = await get(query);
    if (result){
        if (fileId) {
            await saveFileMetadataIfNotExists(fileId, result.id);
        }
        return result.id;
    } else {
        let id = await runCommand(`INSERT INTO metadata(field_name, field_value) VALUES (${row1},${row2})`);
        if (fileId) {
            await runCommand(`INSERT INTO filemetadata(file_id, metadata_id) VALUES (${fileId},${id})`);
        }
        return id;
    }
}

const saveTagIfNotExists = async (name) => {
    const row = JSON.stringify(name);
    const query = `SELECT * FROM tags WHERE tag_name = ${row}`;
    const result = await get(query);
    if (result){
        return result.id;
    } else {
        let id = await runCommand(`INSERT INTO tags(tag_name) VALUES(${row})`);
        return id;
    }
}

const saveCategoryIfNotExists = async (name, parentId) => {
    const row1 = JSON.stringify(name);
    const row2 = parentId;
    const query = `SELECT * FROM category WHERE name = ${row1} AND parent_id = ${row2}`;
    const result = await get(query);
    if (result){
        return result.id;
    } else {
        let id = await runCommand(`INSERT INTO category(name, parent_id) VALUES(${row1},${row2})`);
        return id;
    }
}

const saveFileMetadataIfNotExists = async (fileId, metadataId) => {
    const query = `SELECT * FROM filemetadata WHERE file_id = ${fileId} AND metadata_id = ${metadataId}`;
    const result = await get(query);
    if (result && result.length > 0){
        return;
    } else {
        await runCommand(`INSERT INTO filemetadata(file_id, metadata_id) VALUES (${fileId},${metadataId})`);
    }
}

const saveFileTagIfNotExists = async (fileId, tagId) => {
    const query =  `SELECT * FROM filetags WHERE file_id = ${fileId} AND tag_id = ${tagId}`;
    const result = await get(query);
    if (result && result.length > 0){
        return;
    } else {
        await runCommand(`INSERT INTO filetags(file_id, tag_id) VALUES(${fileId},${tagId})`);
    }
}

const saveChildCategoryIfNotExists = async (parentId, childId) => {
    const query = `SELECT * FROM categorycategories WHERE parent_category_id = ${parentId} AND child_category_id = ${childId}`;
    const result = await get(query);
    if (result){
        return;
    } else {
        await runCommand(`INSERT INTO categorycategories(parent_category_id, child_category_id) VALUES(${parentId},${childId})`);
    }
}

const saveCategoryFilesIfNotExists = async (categoryId, fileId) => {
    const query = `SELECT * FROM categoryfiles WHERE category_id = ${categoryId} AND file_id = ${fileId}`
    const result = await get(query);
    if (result){
        return;
    } else {
        await runCommand(`INSERT INTO categoryfiles(category_id, file_id) VALUES(${categoryId},${fileId})`);
    }
}

const getAllSavedMetadataForFile = async (id) => {
    const query = `SELECT * FROM filemetadata WHERE file_id = ${id}`;
    const result = await all(query);
    return result;
}

const getAllSavedTagsForFile = async (id) => {
    const query = `SELECT * FROM filetags WHERE file_id = ${id}`;
    const result = await all(query);
    return result;
}

const getFileData = async (dir, metadata, type='VIDEO') => {
    const fileData = {
        'id': '',
        'path': dir,
        'metadata': [],
        'tags': []
    };
    const query = `SELECT * FROM files WHERE file_path = ${JSON.stringify(fileData.path)}`;
    const result = await get(query);
    if (result) {
        fileData.id = result.id;
        let metadata = await getAllSavedMetadataForFile(fileData.id);
        for (const data of metadata){
            let obj = await getMetadata(data.metadata_id);
            fileData.metadata.push(obj);
        }
        let tags = await getAllSavedTagsForFile(fileData.id);
        for (const tag of tags){
            let res = await getTag(tag.tag_id);
            fileData.tags.push(res);
        }
    } else {
        fileData.id = await saveFileIfNotExists('file_path', fileData.path);
        const fileMetadata = [
            {field_name: 'file_path', field_value: fileData.path},
            {field_name: 'last_modified', field_value: metadata.mtime.toString()},
            {field_name: 'created', field_value: metadata.birthtime.toString()},
            {field_name: 'file_name', field_value:  parseFilename(dir)},
            {field_name: 'file_size', field_value: metadata.size > 1000000000 ?
                        `${(metadata.size / 1000000000).toFixed(2)} GB` : `${(metadata.size / 1000000).toFixed(2)} MB`},
            {field_name: 'last_accessed', field_value: metadata.atime.toString()}
        ]
        if (type === 'VIDEO') {
            try {
                let fileSystemHandler = new FileSystemHandler();
                let videoMetadata = await fileSystemHandler.videoMetadata(dir);
                videoMetadata = JSON.parse(videoMetadata.stdout);
                const formatMetadata = videoMetadata.format;
                const streamMetadata = videoMetadata.streams[0];
                fileMetadata.push({field_name: 'duration', field_value: formatMetadata.duration});
                fileMetadata.push({field_name: 'format', field_value: formatMetadata.format_long_name});
                fileMetadata.push({field_name: 'framerate', field_value: streamMetadata.r_frame_rate});
                fileMetadata.push({field_name: 'bitrate', field_value: streamMetadata.bit_rate});
                fileMetadata.push({field_name: 'height', field_value: streamMetadata.height});
                fileMetadata.push({field_name: 'width', field_value: streamMetadata.width});
                fileMetadata.push({field_name: 'aspect_ratio', field_value: streamMetadata.display_aspect_ratio});
                fileMetadata.push({field_name: 'codec', field_value: streamMetadata.codec_long_name});
            } catch (error) {
                console.error(error);
            }
        }
        const newArr = [];
        for (const fm of fileMetadata){
            let id = saveMetadataIfNotExists(fm.field_name, fm.field_value, fileData.id);
            let newObj = {
                'id': id,
                ...fm
            }
            newArr.push(fm);
        }
        fileData.metadata = newArr;
    }
    return fileData;
}

const getMetadata = async (id) => {
    const query = `SELECT * FROM metadata WHERE id = ${id}`;
    let result = await get(query);
    return result;
}

const getTag = async (id) => {
    const query = `SELECT * FROM tags WHERE id = ${id}`;
    let result = await get(query);
    return result;
}

const getCategoriesByParent = async (parentId) => {
    const query = `SELECT * FROM category WHERE parent_id ${ parentId ? `= ${parentId}` : 'IS NULL' }`;
    let result = await all(query);
    return result;
}

const getCategoriesByID = async (id) => {
    const query = `SELECT * FROM category WHERE id = ${id}`;
    let result = await get(query);
    return result;
}

const getCategoryChildren = async (parentId) => {
    const query = `SELECT * FROM categorycategories WHERE parent_category_id = ${parentId}`;
    let result = await all(query);
    let arr = [];
    for (const data of result){
        let child = await getCategoriesByID(data.child_category_id);
        arr.push(child);
    }
    return arr;
}

const getFile = async (fileId) => {
    const query = `SELECT * FROM files WHERE id = ${fileId}`;
    let result = await get(query);
    return result;
}

const getCategoryFiles = async (categoryId) => {
    const query = `SELECT * FROM categoryfiles WHERE category_id = ${categoryId}`;
    let result = await all(query);
    let arr = [];
    for (const data of result){
        let file = await getFile(data.file_id);
        file = await getFileData(file.file_path, null);
        arr.push(file);
    }
    return arr;
}

module.exports = {
    sunglassesDB: sunglassesDB,
    saveFileIfNotExists: saveFileIfNotExists,
    saveMetadataIfNotExists: saveMetadataIfNotExists,
    saveTagIfNotExists: saveTagIfNotExists,
    saveCategoryIfNotExists: saveCategoryIfNotExists,
    saveCategoryFilesIfNotExists: saveCategoryFilesIfNotExists,
    saveChildCategoryIfNotExists: saveChildCategoryIfNotExists,
    saveFileTagIfNotExists: saveFileTagIfNotExists,
    getAllSavedMetadataForFile: getAllSavedMetadataForFile,
    getFileData: getFileData,
    getCategoriesByID: getCategoriesByID,
    getCategoriesByParent: getCategoriesByParent,
    getCategoryChildren: getCategoryChildren,
    getCategoryFiles: getCategoryFiles
}