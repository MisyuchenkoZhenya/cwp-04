const fs = require('fs');
const crypto = require('crypto');

const handlers = {
    'COPY': (argv_list) => { fileCopy(argv_list) },
    'ENCODE': (argv_list) => { fileEncode(argv_list) },
    'DECODE': (argv_list) => { fileDecode(argv_list) },
}

function eventDistributor(client, data){
    if(isCorrectData(data)){
        checkIncomingArgs(data);
    }
    else{
        console.log('The entered data is incorrect');
    }
}

function fileCopy(argv_list){
    fs.createReadStream(argv_list[1]).pipe(fs.createWriteStream(argv_list[2]));
}

function fileEncode(argv_list){
    createCryptoFile(argv_list, crypto.createCipher('aes-256-cbc', argv_list[3]));
}

function fileDecode(argv_list){
    createCryptoFile(argv_list, crypto.createDecipher('aes-256-cbc', argv_list[3]));
}

function createCryptoFile(argv_list, cipher){
    const read_stream = fs.createReadStream(argv_list[1]);
    const write_stream = fs.createWriteStream(argv_list[2]);
    read_stream.pipe(cipher).pipe(write_stream);
}

function isCorrectData(data){
    try{
        let list = data.split(' ');
        if(list.length > 2 && 
           list[0] in handlers &&
           fs.statSync(list[1]).isFile()){ return true; }
    }
    catch(err){
        console.log(`Error: ${err}`);
    }
    return false;
}

function checkIncomingArgs(data){
    let list = data.split(' ');
    handlers[list[0]](list);
}

module.exports.eventDistributor = eventDistributor;
