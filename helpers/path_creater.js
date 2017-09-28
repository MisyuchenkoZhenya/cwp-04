const fs = require('fs');

function getLogPath(client, path){
    if (!fs.existsSync(path + `\\log_dir\\`)){
        fs.mkdirSync(path + `\\log_dir\\`);
    }
    
    return path + `\\log_dir\\client_${client.id}.log`;
}

module.exports.getLogPath = getLogPath;
