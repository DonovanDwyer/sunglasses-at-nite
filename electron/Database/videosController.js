const Sqlite3Database = require('./databaseController.js');

const saveVideo = (video) => {
    const db = new Sqlite3Database().connectDB();
    const command = (
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
            ) VALUES (${Object.values(video).map(value => JSON.stringify(value))})`
        );
    db.run(command, error => {
        if (error) console.error(error);
        console.log(command);
        console.log('Video saved successfully.');
    });
    db.close(error => {
        if (error) console.error(error);
        console.log('Operations completed. Database closed successfully.');
    });
    return '200 - Success';
}

const queryVideo = async (row=null, value=null) => {
    const db = new Sqlite3Database().connectDB();
    let query;
    if (!row && !value) {
        query = `SELECT * FROM videos`;
    } else {
        query = `SELECT * FROM videos WHERE ${row} = '${value}'`;
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

module.exports = {
    saveVideo: saveVideo,
    queryVideo: queryVideo
}