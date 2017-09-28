const net = require('net');
const fs = require('fs');
const path = require('path');

const currentDir = fs.realpathSync('');
const port = 8124;
const IP = '127.0.0.1';

const client = new net.Socket();
client.setEncoding('utf8');

const Incoming = {
    'ACK': () => {
        console.log('Connected');
        createDialog(client);
    },

    'DEC': () => {
        client.destroy();
    },
};

client.connect({host: IP, port: port}, () => {
    client.write('REMOTE');
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

function createDialog(client) {
    client.write(`COPY ${currentDir + '\\temp\\file1.txt'} ${currentDir + '\\file1COPY.txt'}`);
    
    client.write('DEC');
}
