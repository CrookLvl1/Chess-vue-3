import { WebSocketServer } from 'ws';
import { webSocketPort, securityCode } from './base.js';

const wss = new WebSocketServer({
    port: webSocketPort,
})

let nextId = 1;
let nextRoomId = 1;
const games = [];
const publicRooms = {
    '60': [],
    '120': [],
    '180': [],
    '300': [],
    '600': [],
    '1200': [],
    '3600': [],
    '7200': [],
    '10800': [],
};

const personalRooms = {

}

const fillInfo = (obj, color, id, client, time) => {
    obj.game[`${color}Id`] = id;
    obj.serverInfo[color] = client;
    obj.game.time = time;
}

const newGame = () => {
    return {
        game: {
            whiteId: 0,
            blackId: 0,
            time: 0,
        },
        serverInfo: {
            white: null,
            black: null
        },
        id: nextRoomId++
    }
}

const getPropFromUrl = (url, property) => {
    let startIndex = url.indexOf(property);
    if (startIndex === -1) return false;

    startIndex += property.length;

    const endIndex = url.indexOf('?&', startIndex);
    if (endIndex === -1) return url.slice(startIndex);
    else return url.slice(startIndex, endIndex);
}

const sendInfo = (client, data) => {
    client.send(data);
}

const createGame = (time, roomId) => {
    const currentGame = newGame();
    let whiteWs, blackWs;
    //PRIVATE GAME
    if (roomId) {
        blackWs = personalRooms[roomId].pop();
        whiteWs = personalRooms[roomId].pop();
        delete personalRooms[roomId];

    }
    //PUBLIC GAME WITH RANDOM OPPONENT
    else {
        blackWs = publicRooms[time].pop();
        whiteWs = publicRooms[time].pop();
    }

    fillInfo(currentGame, 'white', whiteWs.id, whiteWs, time);
    fillInfo(currentGame, 'black', blackWs.id, blackWs, time);

    const currentTime = new Date().getTime();
    games.push(currentGame);

    //send start game info
    whiteWs.send(JSON.stringify({
        info: {
            ...currentGame.game,
            yourColor: 'white',
        },
        type: 'playersInfo',
        pingTime: currentTime
    }));
    blackWs.send(JSON.stringify({
        info: {
            ...currentGame.game,
            yourColor: 'black',
        },
        type: 'playersInfo',
        pingTime: currentTime
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

//Server
wss.on("connection", (ws, req) => {
    if (getPropFromUrl(req.url, 'authKey=') !== securityCode) {
        console.log('Unsecure connection');
        ws.close();
        return;
    }
    const id = nextId++;
    ws.id = id;
    console.log(`${id} connected!`);

    if (getPropFromUrl(req.url, 'personalRoom=')) {
        //PRIVATE GAME (USING ROOMID)
        if (getPropFromUrl(req.url, 'host=')) {
            const generatedRoomId = new Date().getTime() + id;
            ws.time = getPropFromUrl(req.url, 'time=');

            personalRooms[generatedRoomId] = [ws];
            ws.send(JSON.stringify({ type: 'personalroom', info: generatedRoomId }));

            ws.on('close', () => {
                delete personalRooms[generatedRoomId];
                console.log(`${id} disconnected!`);
            })
        } else {
            const roomId = getPropFromUrl(req.url, 'roomId=');

            ws.on('close', () => {
                console.log(`${id} disconnected!`)
            });
            
            if (!roomId || !personalRooms[roomId]) {
                ws.send(JSON.stringify({ type: 'roomnotfound' }));
                ws.close();
            }

            else {
                personalRooms[roomId].push(ws);
                //room[0] - HOST WS
                createGame(personalRooms[roomId][0].time, roomId);
            }
        }


    }
    //PUBLIC GAME
    else {
        const time = getPropFromUrl(req.url, 'time=');
        publicRooms[time].push(ws);

        if (publicRooms[time].length > 1) {
            createGame(time);
        }

        ws.on('close', () => {
            const userIndex = publicRooms[time].findIndex(playerWs => playerWs === ws);
            if (userIndex !== -1) publicRooms[time].splice(userIndex, 1);
            console.log(`${id} disconnected!`);
        })
    }
})
