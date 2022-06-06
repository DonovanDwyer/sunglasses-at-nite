// Takes a path and a list of extension names as input and
// returns a list of files within that path that match

// Needs to be made cross-platform compatible with Windows machines

const fs = require('fs');
const path = require('path');

function runFileSearch(pathname, filterList, fileList=[]){
    fs.readdirSync(pathname).forEach(file => {
        const fullPath = path.resolve(pathname + "/" + file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()){
            runFileSearch(fullPath, filterList, fileList);
        } else if (stat.isFile()){
            if (filterList.includes(path.extname(file))) {
                fileList.push(fullPath);
            }
        }
    });
    return fileList;
}

module.exports = runFileSearch