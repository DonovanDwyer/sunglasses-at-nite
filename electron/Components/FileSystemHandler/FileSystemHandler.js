const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const util = require('util');
const asyncExec = util.promisify(require('child_process').exec);

const video_extensions = [
    ".mp4", ".avi", ".webm", ".mkv", ".flv",
    ".vob", ".mov", ".qt", ".wmv", ".rm",
    ".asf", ".m4p", ".m4v", ".mpg", ".mp2", 
    ".mpeg", ".mpe", ".mpv", ".m2v", ".3gp"
];

const image_extensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp'
]

const document_extensions = [
    '.txt', '.doc', '.pdf', '.epub', '.mobi',
    '.azw3', '.azw'
]

class FileSystemHandler{
    constructor(){
        this.watching = [];
        this.fileTypes = [];
        this.fileCache = [];
    }

    setTypes(types){
        let supported_extensions = [];
        if (types.includes('videos')){
            supported_extensions = supported_extensions.concat(video_extensions);
        }
        if (types.includes('images')){
            supported_extensions = supported_extensions.concat(image_extensions);
        }
        if (types.includes('documents')){
            supported_extensions = supported_extensions.concat(document_extensions);
        }
        if (types.includes('all')){
            supported_extensions = supported_extensions.concat(video_extensions, image_extensions, document_extensions);
        }
        this.fileTypes = supported_extensions;
        return `Now including these file types: ${types.map(type => type)}`
    }

    watch(dir){
        this.watching.push(dir);
        return `Now watching directory ${dir}`;
    }

    search(dir, fileList=[]){
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.resolve(dir + "/" + file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()){
                this.search(fullPath, fileList);
            } else if (stat.isFile()){
                if (this.fileTypes.includes(path.extname(file))) {
                    const newFile = {
                        'path': fullPath,
                        'metadata': stat
                    }
                    fileList.push(newFile);
                }
            }
        });
        return fileList;
    }

    sync(){
        let files = [];
        for (const directory of this.watching){
            files = files.concat(this.search(directory));
        }
        if (JSON.stringify(this.fileCache) !== JSON.stringify(files)){
            this.fileCache = files;
        }
        return this.get();
    }

    get(){
        return this.fileCache;
    }

    metadata(dir){
        return fs.statSync(dir);
    }

    videoMetadata(dir){
        return asyncExec('ffprobe -show_format -show_streams -print_format json "' + dir + '"')
    }

    open(dir){
        exec('open ' + dir);
    }
}

module.exports = FileSystemHandler;