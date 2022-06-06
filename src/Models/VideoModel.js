export default class VideoModel {
    constructor(){
        this.id = null; this.title = null; this.filepath = null; this.filesize = null;
        this.duration = null; this.format = null; this.framerate = null; this.bitrate = null;
        this.height = null; this.width = null; this.aspectRatio = null; this.codecName = null;
        this.thumbnailSrc = null; this.tags = [];
    }

    convertFileToObject = (path, metadata) => {
        const formatMetadata = metadata.format;
        const streamMetadata = metadata.streams[0];
        let parsedInput = path.split("/");
        this.title = parsedInput[parsedInput.length-1].split(".")[0];
        this.filepath = path;
        this.filesize = formatMetadata.size / 1000000;
        this.duration = Math.trunc(formatMetadata.duration);
        this.format = formatMetadata.format_long_name;
        this.framerate = streamMetadata.r_frame_rate;
        this.bitrate = streamMetadata.bit_rate;
        this.height = streamMetadata.height;
        this.width = streamMetadata.width;
        this.aspectRatio = streamMetadata.display_aspect_ratio;
        this.codecName = streamMetadata.codec_long_name;
        this.thumbnailSrc = "/Images/" + this.title + ".jpg";
    }

    convertDBRecordToObject = async (dbObject) => {
        this.id = dbObject.id;
        this.title = dbObject.title;
        this.filepath = dbObject.file_path;
        this.filesize = dbObject.file_size;
        this.duration = dbObject.duration;
        this.format = dbObject.format;
        this.framerate = dbObject.framerate;
        this.bitrate = dbObject.bitrate;
        this.height = dbObject.height;
        this.width = dbObject.width;
        this.aspectRatio = dbObject.aspect_ratio;
        this.codecName = dbObject.codec_name;
        this.thumbnailSrc = dbObject.thumbnail_path;
        this.tags = await this.findTagsByVideoId(this.id);
        this.tags = this.tags.map(obj => obj.tag_id);
    }

    exportJson = () => {
        return {
            title: this.title,
            aspectRatio: this.aspectRatio,
            bitrate: this.bitrate,
            codecName: this.codecName,
            duration: this.duration,
            filepath: this.filepath,
            filesize: this.filesize,
            format: this.format,
            framerate: this.framerate,
            height: this.height,
            width: this.width,
            thumbnailSrc: this.thumbnailSrc
        }
    }

    // Create a video record
    saveVideo = async () => {
        const result = await window.videoApi.saveVideo(this.exportJson());
        this.id = result[0].id;
        // console.log(result);
    }

    // Find one or more video record by query
    findVideoByDetails = async (detailName, detailValue) => {
        const result = await window.videoApi.queryVideo(detailName, detailValue);
        // console.log(result);
        return result
    }

    findTagsByVideoId = async () => {
        const result = await window.videoApi.queryTagAssociation(this.id);
        // console.log(result);
        return result;
    }

    // Find all video records
    getAllVideos = async () => {
        const result = await window.videoApi.queryVideo();
        return result;
    }

    // Update video record
    updateVideo = (updateField, updateValue, videoDetail, videoValue) => {
        // Call to sqlite3 select function
        // Call to sqlite3 update function
    }

    // Delete video record
    deleteVideo = (videoDetail, videoValue) => {
        // Call to sqlite3 select function
        // Call to sqlite3 delete function
    }
}
