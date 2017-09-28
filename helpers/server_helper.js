const fs = require('fs');

function findQuestion(question, qa){
    for(let i = 0; i < qa.length; i++){
        if(qa[i].q === question){
            return true;
        }
    }
    return false;
}

function getAnswer(question, qa){
    for(let i = 0; i < qa.length; i++){
        if(qa[i].q === question){
            return qa[i].a;
        }
    }
    return 0;
}

function checkFileDirectory(path){
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}

function createNewFile(client, data, defaultPath){
    const context = JSON.parse(data);
    const filePath = defaultPath + context.filename;
    const message = Buffer.from(context.content);
    
    fs.appendFileSync(filePath, message);
    client.write('NEXT');
}

module.exports.findQuestion = findQuestion;
module.exports.getAnswer = getAnswer;
module.exports.checkFileDirectory = checkFileDirectory;
module.exports.createNewFile = createNewFile;
