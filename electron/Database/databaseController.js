const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class SunglassesDB {
    static dbName = 'Sunglass DB';
    static #filename = 'sunglass.db';
    static #dbDirectory = path.join(__dirname, '..', '..', 'public', 'db', this.#filename);

    static setFilename(filename){
        this.#filename = filename;
        this.#dbDirectory = path.join(__dirname, '..', '..', 'public', 'db', this.#filename);
    }
    static getFilename(){
        return this.#filename;
    }
    static getDirectory(){
        return this.#dbDirectory;
    }
    static connectDB(dbDirectory){
        const db = new sqlite3.Database((dbDirectory), error => {
            if (error) console.error(error);
            console.info(`Connection opened with ${this.dbName}`);
        });
        return db;
    }
    static disconnectDB(db){
        db.close(error => {
            if (error) console.error(error);
            console.info(`Connection with ${this.dbName} closed`);
        });
    }
    static async beginTransaction(transactionFunc, table){
        const db = this.connectDB(this.#dbDirectory);
        try {
            return await transactionFunc(db, table);
        } catch (err) {
            throw err;
        } finally {
            this.disconnectDB(db);
        }
    }

    static async query(db, table){
        const query = `SELECT * FROM ${table}`;
        return new Promise ((resolve, reject) => {
            db.all(query, (err, rows) => {
                if (err){
                    reject(console.error(err));
                } else {
                    console.info(query, '...Successful!');
                    resolve(rows);
                }
            });
        });
    }

    static async runCommand(db, command){
        return new Promise ((resolve, reject) => {
            db.run(command, err => {
                if (err) {
                    reject(console.error(err));
                } else {
                    console.info(command, '...Successful!');
                    resolve();
                }
            });
        });
    }
}

class Sqlite3Database {
    #databaseDirectory;
    constructor(){
        this.name = 'sunglass';
        this.#databaseDirectory = path.join(__dirname, '..', '..', 'public', 'db');
        this.dbPath = path.join(this.#databaseDirectory, this.name + '.db');
        this.db = null;
    }

    connectDB(){
        this.db = new sqlite3.Database((this.dbPath), error => {
            if (error) console.error(error);
        });
        return this.db;
    }

    disconnectDB(){
        this.db.close((error) => {
            if (error) console.error(error);
        });
        this.db = null;
    }

    execute(command){
        return this.db.run(command, function (error){
            if (error) console.error(error);
            console.log('Command executed successfully: ', this.lastID, this.changes);
        });
    }

    queryAll(query){
        this.db.all(query, (error,rows) => {
            if (error) console.error(error);
            console.log('Query successful: ');
            rows.forEach(row => {
                console.log(row);
            });
        });
    }

    queryEach(query, cb){
        this.db.each(query, (error, cb));
    }

    beginTransaction(runCommand){
        this.connectDB(this.name);
        runCommand(this.db);
        this.disconnectDB();
    }
}

const CREATE_VIDEO_TABLE = (
    `CREATE TABLE IF NOT EXISTS videos (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY,
        title TEXT NOT NULL,
        aspect_ratio TEXT,
        bitrate INTEGER,
        codec_name TEXT,
        duration INTEGER,
        file_path TEXT NOT NULL UNIQUE,
        file_size REAL,
        format TEXT,
        framerate TEXT,
        height INTEGER,
        width INTEGER,
        thumbnail_path TEXT
    )`
);

const CREATE_TAG_TABLE = (
    `CREATE TABLE IF NOT EXISTS tags (
        id INTEGER UNIQUE NOT NULL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
    )`
);

const CREATE_VIDEOTAG_TABLE = (
    `CREATE TABLE IF NOT EXISTS videotags (
        video_id INTEGER,
        tag_id INTEGER,
        FOREIGN KEY(video_id) REFERENCES video(id) ON DELETE CASCADE,
        FOREIGN KEY(tag_id) REFERENCES tag(id) ON DELETE CASCADE
    )`
)


function insertVideoRow(valuesList){
    return (
        `INSERT INTO videos(
            title,
            aspect_ratio,
            bitrate,
            codec_name,
            duration,
            file_path,
            file_size,
            format,
            framerate,
            height,
            width,
            thumbnail_path
        ) VALUES (${valuesList})`
    );
}

function insertTagRow(name){
    return `INSERT INTO tags(name) VALUES (${name})`
}

function createVideoTag(videoId, tagId){
    return (
        `INSERT INTO videotags(
            video_id,
            tag_id
        ) VALUES (${videoId}, ${tagId})`
    );
}

function queryVideo(){
    return `SELECT id VideoId,
        title Title,
        aspect_ratio AspectRatio,
        bitrate Bitrate,
        codec_name Codec,
        duration Duration,
        file_path Filepath,
        file_size Filesize,
        format Format,
        framerate Framerate,
        height Height,
        width Width,
        thumbnail_path Thumbnail
        FROM videos`;
}

function queryTag(){
    return `SELECT id TagId,
        name Name
        FROM tags`;
}

function queryVideoTag(){
    return `SELECT video_id VideoId,
        tag_id TagId
        FROM videotags`;
}

const dummyValueData1 = `"DASH_1080",
    "76:135",
    196075,
    "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
    56,
    "/Users/donovandwyer/Downloads/adinfinitum/DASH_1080.mp4",
    21.253765,
    "QuickTime / MOV",
    "30/1",
    1080,
    608,
    "/Images/DASH_1080.jpg"`;

const dummyValueData2 = `"DASH_720 (1)",
    "9:16",
    1025602,
    "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
    9,
    "/Users/donovandwyer/Downloads/adinfinitum/DASH_720 (1).mp4",
    2.386298,
    "QuickTime / MOV",
    "30/1",
    720,
    406,
    "/Images/DASH_720 (1).jpg"`;

const dummyValueData3 = `"DASH_720",
    "9:16",
    1158528,
    "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
    12,
    "/Users/donovandwyer/Downloads/adinfinitum/DASH_720.mp4",
    3.743973,
    "QuickTime / MOV",
    "30/1",
    720,
    406,
    "/Images/DASH_720.jpg"`;

const buildDummyDb = () => {
    let sunglassDb = new Sqlite3Database('sunglass', databaseDirectory);
    sunglassDb = sunglassDb.connectDB();
    sunglassDb.serialize(() => {
        sunglassDb.run(CREATE_VIDEO_TABLE)
        .run(CREATE_TAG_TABLE)
        .run(CREATE_VIDEOTAG_TABLE)
        .parallelize(() => {
            sunglassDb.run(insertVideoRow(dummyValueData3));
            sunglassDb.run(insertVideoRow(dummyValueData2));
            sunglassDb.run(insertVideoRow(dummyValueData1));
            sunglassDb.run(insertTagRow('"meme"'));
            sunglassDb.run(insertTagRow('"category2"'));
            sunglassDb.run(insertTagRow('"test"'));
        })
        .run(createVideoTag(1,1))
        .run(createVideoTag(2,1))
        .run(createVideoTag(3,1))
        .run(createVideoTag(3,2))
        .run(createVideoTag(1,3))
        .run(createVideoTag(3,3))
        .all(queryVideo(), (error, rows) => {
            if (error) console.error(error);
            console.log(rows);
        })
        .all(queryTag(), (error, rows) => {
            if (error) console.error(error);
            console.log(rows);
        })
        .all(queryVideoTag(), (error, rows) => {
            if (error) console.error(error);
            console.log(rows);
        })
    })
    sunglassDb.close();
}

const rebuildDatabase = () => {
    let sunglassDb = new Sqlite3Database();
    sunglassDb = sunglassDb.connectDB();
    sunglassDb.serialize(() => {
        sunglassDb.run(CREATE_VIDEO_TABLE)
        .run(CREATE_TAG_TABLE)
        .run(CREATE_VIDEOTAG_TABLE)
    })
    sunglassDb.close();
}

const buildTestDb = async () => {
    SunglassesDB.setFilename('test.db');
    let x = await SunglassesDB.beginTransaction(SunglassesDB.runCommand, CREATE_TAG_TABLE);
    console.log(x);
}


// buildDummyDb();
// rebuildDatabase();
// buildTestDb();

module.exports = Sqlite3Database;