import { WebSocketServer } from 'ws';
import { webSocketPort, securityCode } from './base.js';

const wss = new WebSocketServer({
    port: webSocketPort,
})


const fillInfo = (obj, color, id, client) => {
    obj.game[`${color}Id`] = id;
    obj.serverInfo[color] = client;
}

const newGame = () => {
    return {
        game: {
            whiteId: 0,
            blackId: 0
        },
        serverInfo: {
            white: null,
            black: null
        }
    }
}

const getPropFromUrl = (url, property) => {
    const startIndex = url.indexOf(property) + property.length;
    const endIndex = url.indexOf('?&', startIndex);
    if (endIndex === -1) return url.slice(startIndex);
    else return url.slice(startIndex, endIndex);
}

const sendInfo = (client, data) => {
    client.send(data);
}

const createRoom = (time) => {
    const currentGame = newGame();
    const whiteWs = players[time].pop();
    const blackWs = players[time].pop();

    fillInfo(currentGame, 'white', whiteWs.id, whiteWs);
    fillInfo(currentGame, 'black', blackWs.id, blackWs);

    games.push(currentGame);

    //send start game info
    whiteWs.send(JSON.stringify({
        info: {
            ...currentGame.game,
            yourColor: 'white',
        },
        type: 'playersInfo'
    }));
    blackWs.send(JSON.stringify({
        info: {
            ...currentGame.game,
            yourColor: 'black',
        },
        type: 'playersInfo'
    }));



    whiteWs.on('message', (data, isBinary) => {
        data = isBinary ? data : data.toString();
        sendInfo(blackWs, data);

    })
    blackWs.on('message', (data, isBinary) => {
        data = isBinary ? data : data.toString();
        sendInfo(whiteWs, data);
    })



    whiteWs.on('close', () => {
        blackWs.send(JSON.stringify({ type: 'leave' }));
        games.splice(games.findIndex(game => game === currentGame), 1);
    })
    blackWs.on('close', () => {
        whiteWs.send(JSON.stringify({ type: 'leave' }));
        games.splice(games.findIndex(game => game === currentGame), 1);
    })
}


let nextId = 1;
const games = [];


const players = {
    '60': [],
    '120': [],
    '180': [],
    '300': [],
    '600': [],
    '1200': [],
};


//Server
wss.on("connection", (ws, req) => {
    if (getPropFromUrl(req.url, 'authKey=') !== securityCode) {
        console.log('auth problem');
        ws.close();
        return;
    }
    const id = nextId++;
    ws.id = id;
    console.log(`${id} connected!`);



    const time = getPropFromUrl(req.url, 'time=');
    players[time].push(ws);

    if (players[time].length > 1) {
        createRoom(time);
    }

    ws.on('close', () => {
        const userIndex = players[time].findIndex(playerWs => playerWs === ws);
        if (userIndex !== -1) players[time].splice(userIndex, 1);
        console.log(`${id} disconnected!`);
    })
})
