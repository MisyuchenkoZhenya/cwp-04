const net = require('net');
const fs = require('fs');
const path = require('path');
const cf_h = require('./helpers/client-files_helper');
const port = 8124;
const IP = '127.0.0.1';

const client = new net.Socket();
let dirs, files = [];
client.setEncoding('utf8');

const Incoming = {
    'ACK': () => {
        console.log('Connected');
        dirs = cf_h.getDirsFromArgv(process.argv.slice(2));
        createDialog(client, dirs);
    },

    'NEXT': () => {
        sendFileToServer(client);
    },

    'DEC': () => {
        client.destroy();
    },
};

client.connect({host: IP, port: port}, () => {
    client.write('FILES');
});

client.on('data', (data) => {
    if(data in Incoming){
        Incoming[data]();
    }
    else{
        console.log('Unknown command');
        client.write('DEC');
    }
});

client.on('close', () => {
    console.log('Connection closed');
});

function createDialog(client, dirs) {
    files = cf_h.readFilePaths(dirs);
    sendFileToServer(client);
}

function sendFileToServer(client){
    if(files.length > 0){
        const message = cf_h.createMessage(files.pop());
        client.write(JSON.stringify(message));
    }
    else{
        //client.destroy();
        client.write('DEC');
    }
}
