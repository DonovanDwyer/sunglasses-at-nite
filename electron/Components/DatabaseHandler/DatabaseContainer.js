const { sunglassesDB } = require("./DatabaseHandler");
const path = require('path');

const CREATE_FILE_TABLE = (
    `CREATE TABLE IF NOT EXISTS files (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY,
        file_path TEXT NOT NULL UNIQUE
    )`
);

const CREATE_METADATA_TABLE = (
    `CREATE TABLE IF NOT EXISTS metadata (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY,
        field_name TEXT NOT NULL,
        field_value TEXT NOT NULL
    )`
);

const CREATE_TAG_TABLE = (
    `CREATE TABLE IF NOT EXISTS tags (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY,
        tag_name TEXT NOT NULL UNIQUE
    )`
);

const CREATE_CATEGORY_TABLE = (
    `CREATE TABLE IF NOT EXISTS category (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        parent_id INTEGER,
        FOREIGN KEY(parent_id) REFERENCES category(id)
    )`
);

const CREATE_FILEMETADATA_TABLE = (
    `CREATE TABLE IF NOT EXISTS filemetadata (
        file_id INTEGER,
        metadata_id INTEGER,
        FOREIGN KEY(file_id) REFERENCES file(id) ON DELETE CASCADE,
        FOREIGN KEY(metadata_id) REFERENCES metadata(id) ON DELETE CASCADE
    )`
);

const CREATE_FILETAG_TABLE = (
    `CREATE TABLE IF NOT EXISTS filetags (
        file_id INTEGER,
        tag_id INTEGER,
        FOREIGN KEY(file_id) REFERENCES file(id) ON DELETE CASCADE,
        FOREIGN KEY(tag_id) REFERENCES tag(id) ON DELETE CASCADE
    )`
);

const CREATE_CATEGORYCATEGORIES_TABLE = (
    `CREATE TABLE IF NOT EXISTS categorycategories (
        parent_category_id INTEGER,
        child_category_id INTEGER,
        FOREIGN KEY(parent_category_id) REFERENCES category(id) ON DELETE CASCADE,
        FOREIGN KEY(child_category_id) REFERENCES category(id) ON DELETE CASCADE
    )`
);

const CREATE_CATEGORYFILES_TABLE = (
    `CREATE TABLE IF NOT EXISTS categoryfiles (
        category_id INTEGER,
        file_id INTEGER,
        FOREIGN KEY(category_id) REFERENCES category(id) ON DELETE CASCADE,
        FOREIGN KEY(file_id) REFERENCES file(id) ON DELETE CASCADE
    )`
);

const dbPath = path.join(__dirname, '..', '..', '..', 'src', 'db');

function initializeDatabase(){
    let sunglassesDb = sunglassesDB();
    sunglassesDb.serialize(() => {
        sunglassesDb.run(CREATE_FILE_TABLE)
        .run(CREATE_METADATA_TABLE)
        .run(CREATE_TAG_TABLE)
        .run(CREATE_FILEMETADATA_TABLE)
        .run(CREATE_FILETAG_TABLE)
        .run(CREATE_CATEGORY_TABLE)
        .run(CREATE_CATEGORYCATEGORIES_TABLE)
        .run(CREATE_CATEGORYFILES_TABLE)
    })
    sunglassesDb.close();
}

module.exports = initializeDatabase