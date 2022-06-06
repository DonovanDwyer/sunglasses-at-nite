const util = require('util');
const asyncExec = util.promisify(require('child_process').exec);
const exec = require('child_process').exec;

function sanitizeInput(input){
    return input.split(" ").join("\\ ").split("(").join("\\(").split(")").join("\\)");
}

function parseFilename(input){
    let parsedInput = input.split("/");
    return parsedInput[parsedInput.length-1].split(".")[0];
}

const captureThumbnail = (path, timecode) => {
    exec("ffmpeg -i " + sanitizeInput(path) + 
    " -ss " + timecode + " -r 1 -an -vframes 1 -s 200x200 -f mjpeg /Users/donovandwyer/Development/sunglasses-at-nite/public/Images/" + 
    sanitizeInput(parseFilename(path)) + ".jpg");
}
const getVideoMetadata = async (path) => {
    return asyncExec('ffprobe -show_format -show_streams -print_format json "' + path + '"');
}

module.exports = {
    getVideoMetadata: getVideoMetadata,
    captureThumbnail: captureThumbnail
}