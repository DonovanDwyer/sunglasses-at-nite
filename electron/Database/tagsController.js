const Sqlite3Database = require('./databaseController.js');

const saveTag = (tagName) => {
    const db = new Sqlite3Database().connectDB();
    const command = `INSERT INTO tags(name) VALUES('${tagName}')`;
    db.run(command, error => {
        if (error) console.error(error);
        console.log(command);
        console.log('Tag saved successfully.');
    });
    db.close(error => {
        if (error) console.error(error);
    });
    return '200 - Success';
}

const createTagVideoAssociation = (videoId, tagId) => {
    const db = new Sqlite3Database().connectDB();
    const command = `INSERT INTO videotags(video_id, tag_id) VALUES(${videoId}, ${tagId})`;
    db.run(command, error => {
        if (error) console.error(error);
        console.log(command);
        console.log('Tag associated created successfully.');
    });
    db.close(error => {
        if (error) console.error(error);
    });
    return '200 - Success';
}

const queryTag = async (row=null, value=null) => {
    const db = new Sqlite3Database().connectDB();
    let query;
    if (!row && !value) {
        query = `SELECT * FROM tags`;
    } else {
        query = `SELECT * FROM tags WHERE ${row} = '${value}'`;
    }

    function asyncQuery(){
        return new Promise ((resolve, reject) => {
            db.all(query, (error, rows) => {
                if (error) {
                    reject(console.error(error));
                } else {
                    console.log(query, '...Successful!');
                    resolve(rows);
                }
            });
        })
    }

    try {
        const result = await asyncQuery();
        db.close(error => {
            if (error) console.error(error);
        });
        return result;
    } catch (error) {
        db.close(error => {
            if (error) console.error(error);
        });
        throw error;
    }
}

const deleteTag = async (row, value) => {
    const db = new Sqlite3Database().connectDB();
    let query = `DELETE FROM tags WHERE ${row} = ${value}`;

    function asyncQuery(){
        return new Promise ((resolve, reject) => {
            db.all(query, (error, rows) => {
                if (error) {
                    reject(console.error(error));
                } else {
                    console.log(query, '...Successful!');
                    resolve(rows);
                }
            });
        })
    }

    try {
        const result = await asyncQuery();
        db.close(error => {
            if (error) console.error(error);
        });
        return result;
    } catch (error) {
        db.close(error => {
            if (error) console.error(error);
        });
        throw error;
    }
}

const queryTagAssociation = async (videoId = null, tagId = null) => {
    const db = new Sqlite3Database().connectDB();
    let query;
    if (videoId && tagId) {
        query = `SELECT * FROM videotags WHERE video_id = ${videoId} AND tag_id = ${tagId}`;
    } else if (videoId) {
       query = `SELECT * FROM videotags WHERE video_id = ${videoId}`;
    } else if (tagId) {
       query = `SELECT * FROM videotags WHERE tag_id = ${tagId}`;
    }
    

    function asyncQuery(){
        return new Promise ((resolve, reject) => {
            db.all(query, (error, rows) => {
                if (error) {
                    reject(console.error(error));
                } else {
                    console.log(query, '...Successful!');
                    resolve(rows);
                }
            });
        })
    }

    try {
        const result = await asyncQuery();
        db.close(error => {
            if (error) console.error(error);
        });
        return result;
    } catch (error) {
        db.close(error => {
            if (error) console.error(error);
        });
        throw error;
    }
}

const deleteTagAssociation = async (videoId, tagId) => {
    const db = new Sqlite3Database().connectDB();
    let query = `DELETE FROM videotags WHERE video_id = ${videoId} AND tag_id = ${tagId}`;

    function asyncQuery(){
        return new Promise ((resolve, reject) => {
            db.all(query, (error, rows) => {
                if (error) {
                    reject(console.error(error));
                } else {
                    console.log(query, '...Successful!');
                    resolve(rows);
                }
            });
        })
    }

    try {
        const result = await asyncQuery();
        db.close(error => {
            if (error) console.error(error);
        });
        return result;
    } catch (error) {
        db.close(error => {
            if (error) console.error(error);
        });
        throw error;
    }
}

module.exports = {
    saveTag: saveTag,
    queryTag: queryTag,
    createTagVideoAssociation: createTagVideoAssociation,
    queryTagAssociation: queryTagAssociation,
    deleteTag: deleteTag,
    deleteTagAssociation: deleteTagAssociation
}