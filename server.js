const net = require('net');
const fs = require('fs');
const path = require('path');
const uid = require('uid');
const logOut = require('./helpers/path_creater');
const sh = require('./helpers/server_helper');
const srh = require('./helpers/server-remote_helper');
const port = 8124;
const defaultPath = process.env.DEFAULT_PATH = fs.realpathSync('') + '\\clientFiles\\';
const maxCountOfClients = process.env.MAX_COUNT_OF_CLIENTS = 2;
const IP = '127.0.0.1';

let qa = readJson();
let currentClientsCount = 0;
let clientsQueue = [];

const Incoming = {
    'NONE': (client) => {
        client.current_state = modes['NONE'];
    },

    'QA': (client) => {
        fs.writeFileSync(client.pathToLog, '');
        LogQA(client.pathToLog, `Client with id ${client.id} connected`);
        client.current_state = modes['QA'];
        client.write('ACK');
    },

    'FILES': (client) => {
        if(currentClientsCount <= maxCountOfClients){
            currentClientsCount++;
            sh.checkFileDirectory(defaultPath);
            sh.checkFileDirectory(defaultPath + `\\${client.id}\\`);
            client.current_state = modes['FILES'];
            client.write('ACK');
        }
        else{
            clientsQueue.push(client);
        }
    },

    'REMOTE': (client) => {
        client.current_state = modes['REMOTE'];
        client.write('ACK');
    },

    'DEC': (client) => {
        if(client.current_state === modes['FILES']) currentClientsCount--;
        client.write('DEC');
    },
};

const modes = {
    'NONE': 0,
    'QA': 1,
    'FILES': 2,
    'REMOTE': 3,
}

const server = net.createServer((client) => {
    client.id = uid();
    client.current_state = modes['NONE'];
    client.setEncoding('utf8');
    client.pathToLog = logOut.getLogPath(client, fs.realpathSync(''));

    client.on('data', (data) => {
        if(data in Incoming){
            client.current_state = modes['NONE'];
            Incoming[data](client);
        }
        else if(client.current_state === modes['QA']){
            sendAnswer(client.pathToLog, client, data, qa);
        }
        else if(client.current_state === modes['FILES']){
            sh.createNewFile(client, data, defaultPath + `\\${client.id}\\`);
        }
        else if(client.current_state === modes['REMOTE']){
            srh.eventDistributor(client, data);
        }
        else{
            console.log('Unknown command');
            client.write('DEC');
        }
    });

    client.on('end', () => {
        if(clientsQueue.length > 0) Incoming['FILES'](clientsQueue.pop());
        LogQA(client.pathToLog, `Client disconnected`)
    });
});

server.listen({host: IP, port: port, exclusive: true},  () => {
    console.log(`Server listening on localhost: ${port}`);
});

function LogQA(pathToLog, message) {
    date = new Date();
    if (fs.existsSync(pathToLog)){
        fs.appendFile(pathToLog, 
                      date.getHours() + ':' + date.getMinutes() + ':' + 
                      date.getSeconds() + ' - ' + message + '\n', 
                      (err) => {
            if(err){
                console.err(err.toString());
            }
        });
    }
}

function readJson(){
    let data = JSON.parse(fs.readFileSync('qa.json'));
    return data['QA'];
}

function sendAnswer(pathToLog, client, question, qa){
    let answer = '';

    const rand = Math.floor(Math.random() * (qa.length));
    answer = rand % 2 === 0 ? sh.getAnswer(question, qa) : qa[rand].a;
    
    LogQA(pathToLog, `Qestion: ${question}` + '\n\t\t' + `Answer: ${answer}`);
    client.write(answer);
}
