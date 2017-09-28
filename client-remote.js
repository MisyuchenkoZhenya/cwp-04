const net = require('net');
const fs = require('fs');
const path = require('path');

const key = 'sU0kq3aL10c';
const currentDir = __dirname;
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
    //client.write(`COPY ${currentDir + '\\temp\\file1.txt'} ${currentDir + '\\file1COPY.txt'}`);
    //client.write(`ENCODE ${currentDir + '\\temp\\file1.txt'} ${currentDir + '\\file1ENCODE.txt'} ${key}`);
    //client.write(`DECODE ${currentDir + '\\file1ENCODE.txt'} ${currentDir + '\\file1DECODE.txt'} ${key}`);    
    client.write('DEC');
}
