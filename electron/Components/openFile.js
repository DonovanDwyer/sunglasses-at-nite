const exec = require('child_process').exec;

const playVideo = (path) => {
    let finalPath = path.split(" ").join("\\ ").split("(").join("\\(").split(")").join("\\)");
    exec('open ' + finalPath);
}

module.exports = {
    playVideo: playVideo
}