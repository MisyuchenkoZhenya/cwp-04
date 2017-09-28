const fs = require('fs');
const path = require('path');

function getDirsFromArgv(dirs){
    if(dirs.length === 0){
        console.log('No path in argv');
    }
    else if(!checkDirsCorrect(dirs)){
        console.log('Wrong path in argv');
        dirs = [];
    }
    return dirs;
}

function checkDirsCorrect(dirs){
    try {
        dirs.forEach((elem) => {
            fs.lstatSync(elem).isDirectory();
        });
        return true;
    } 
    catch (error) {
        return false;
    }
}

function readFilePaths(dirs){
    let files = [];
    if(dirs.length !== 0){
        dirs.forEach((directory) => {
            getDirectoryPaths(directory, files);
        });
    }
    return files;
}

function getDirectoryPaths(directory, files){
    fs.readdirSync(directory).forEach((object) => {
        let filePath = path.normalize(directory + '\\' + object);
        if (fs.statSync(filePath).isFile()) {
            files.push(filePath);
        }
        else {
            getDirectoryPaths(filePath, files);
        }
    });
}

function createMessage(path){
    const content = fs.readFileSync(path);
    const temp_list = path.split('\\');
    const filename = temp_list[temp_list.length - 1];
    return {'filename' : filename, 'content': content};
}

module.exports.getDirsFromArgv = getDirsFromArgv;
module.exports.checkDirsCorrect = checkDirsCorrect;
module.exports.readFilePaths = readFilePaths;
module.exports.createMessage = createMessage;
