const net = require('net');
const fs = require('fs');
const sh = require('./helpers/shuffle_alg');
const port = 8124;
const IP = '127.0.0.1';

let qa = readJson();
const client = new net.Socket();
client.setEncoding('utf8');

const Incoming = {
    'ACK': () => {
        console.log('Connected');
        sender(client);
    },

    'DEC': () => {
        client.destroy();
    },
};

client.connect({host: IP, port: port}, () => {
    client.write('QA');
});

client.on('data', (data) => {
    if(data in Incoming){
        Incoming[data]();
    }
    else{
        checkAnswer(data, client);
    }
});

client.on('close', () => {
    console.log('Connection closed');
});

function sender(client) {
    if(qa.length > 0){
        client.write(qa[qa.length-1].q);
    }
    else{
        client.write('DEC');
    }
}

function readJson(){
    let data = JSON.parse(fs.readFileSync('qa.json'));
    data['QA'] = sh.shuffle(data['QA']);
    return data['QA'];
}

function checkAnswer(answer, client){
    console.log('q: ' + qa[qa.length-1].q + '\n' +
                'a: ' + answer);
    if(qa[qa.length-1].a === answer){
        console.log('result: true');
    }
    else{
        console.log('result: false');
    }
    qa.pop();
    
    sender(client);
}