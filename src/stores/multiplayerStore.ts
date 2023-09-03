import type { ChessColor, Info, Message, MessageInfo, PlayersInfo, TurnInfo, User } from "@/class/chessTypes&Interfaces";
import { Player } from "@/class/player";
// import { securityCode, webSocketPort } from "@/web-socket-server/base";
import { defineStore } from "pinia";
import { reactive, computed, ref } from 'vue'

let securityCode = import.meta.env.VITE_securityCode || 'qwerty123';
let webSocketPort = import.meta.env.VITE_port || 8000


console.log(securityCode, webSocketPort)



const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws';

export const useMultiplayerStore = defineStore('multiplayer', () => {
    const soloPlayerInfo = { id: 0, time: 5999 };

    const initPlayerInfo = { id: 0, color: 'black' as ChessColor, time: -1 },
        initUserProfileInfo = { name: 'Guest', imgSrc: '', borderColor: '' }

    let currentRoomId = ref<string>('');
    let roomNotFound = ref<boolean>(false);

    let msgId = 0;
    let messages = reactive<Array<Message>>([]);


    let turn = reactive<TurnInfo>({
        fromRow: 0,
        toRow: 0,
        fromColumn: 0,
        toColumn: 0,
        turnType: 'default',
        figureTurnType: 'own',
        figureType: null,
        stolenType: null,
    });

    const resetRoomId = () => currentRoomId.value = '';
    const resetRoomNotFound = () => roomNotFound.value = false;

    const resetInfo = (): void => {
        turn.fromRow = turn.toRow = turn.fromColumn = turn.toColumn = 0;
        turn.figureTurnType = 'own';
        turn.turnType = 'default';
        turn.stolenType = turn.figureType = null;

        resetRoomId();
        resetRoomNotFound();

        player.fillPlayerInfo(initPlayerInfo)
        player.fillUserProfileInfo(initUserProfileInfo);

        enemyPlayer.fillPlayerInfo(initPlayerInfo)
        enemyPlayer.fillUserProfileInfo(initUserProfileInfo);

        leaveLose.value = surrenderLose.value = false;
        messages.splice(0);
    }


    let player = reactive(new Player(0, -1, 'black')),
        enemyPlayer = reactive(new Player(0, -1, 'black'));

    let leaveLose = ref<Boolean>(false);
    let surrenderLose = ref<Boolean>(false);

    let ws: WebSocket;




    const getMainInfo = (playersData: PlayersInfo, currentPlayer: User) => {
        const playerColor: ChessColor = playersData.yourColor;
        const enemyColor: ChessColor = playerColor === 'white' ? 'black' : 'white';
        console.log(playersData);

        player.fillPlayerInfo({ id: playersData[`${playerColor}Id`], color: playerColor, time: +playersData.time });
        player.fillUserProfileInfo(currentPlayer);

        enemyPlayer.fillPlayerInfo({ id: playersData[`${enemyColor}Id`], color: enemyColor, time: +playersData.time });


        console.log(player)

        console.log('main info')
        if (playerColor === 'white') player.start();
        else enemyPlayer.start();
    };

    const getEnemyProfileInfo = (userProfileData: User) => {
        enemyPlayer.fillUserProfileInfo(userProfileData)
    }

    const getTurnInfo = (turnInfo: TurnInfo) => {
        turn.fromColumn = turnInfo.fromColumn;
        turn.fromRow = turnInfo.fromRow;
        turn.toRow = turnInfo.toRow;
        turn.toColumn = turnInfo.toColumn;
        turn.figureType = turnInfo.figureType || null;
        turn.stolenType = turnInfo.stolenType;
        turn.figureTurnType = turnInfo.figureTurnType;
        turn.turnType = turnInfo.turnType;

        console.log(turnInfo);
    };

    const getMessageInfo = (messageInfo: MessageInfo) => {
        messages.push({
            text: messageInfo.text,
            read: false,
            currentUserSender: false,
            id: msgId++,
            date: new Date()
        })
    }

    const getMessagesRead = (ids: Array<number>) => {
        ids.forEach((id: number) => {
            const msg = messages.find((message: Message) => message.id === id);
            if (msg) msg.read = true;
        })
    }

    const initMultiplayerGame = (time: number, user: User, personalRoom: boolean, host?: boolean, roomId?: string) => {
        let url = `${protocol}://${window.location.hostname}:${webSocketPort}?authKey=${securityCode}?&time=${time}`;
        
        console.log(`personal = ${personalRoom}, host = ${host}, roomid = ${roomId}`)
        if (personalRoom) {
            url += `?&personalRoom=${personalRoom}`;
            if (host) url += `?&host=true`;
            else if (roomId && roomId?.length > 0) url += `?&roomId=${roomId}`;
        }

        ws = new WebSocket(url);

        ws.addEventListener('message', (msgEv: MessageEvent) => {
            console.log(msgEv.data);


            const data: Info = JSON.parse(msgEv.data);

            console.log(data);
            console.log(data.type);

            if (data.pingTime) {
                const ping: number = new Date().getTime() - data.pingTime;
                console.log("PING =", ping, ping / 1000);
                console.log(enemyPlayer.getTime())
                enemyPlayer.addTime(ping / 1000);
                console.log(enemyPlayer.getTime());
            }



            switch (data.type) {
                case 'playersInfo': {
                    ws.send(JSON.stringify({
                        type: 'userprofileinfo',
                        info: user,
                        pingTime: new Date().getTime()
                    }));
                    getMainInfo(data.info as PlayersInfo, user);
                    break;
                }
                case 'userprofileinfo': {
                    getEnemyProfileInfo(data.info as User);
                    break;
                }

                case 'turn': {
                    getTurnInfo(data.info as TurnInfo);
                    break;
                }

                case 'personalroom': {
                    currentRoomId.value = (data.info as string);
                    break;
                }

                case 'roomnotfound': {

                    roomNotFound.value = true;
                    break;
                }

                case 'readMessages': {
                    getMessagesRead(data.info as Array<number>);
                    break;
                }

                case 'message': {
                    getMessageInfo(data.info as MessageInfo)
                    break;
                }

                case 'leave': {
                    leaveLose.value = true;
                    break;
                }

                case 'surrender': {
                    surrenderLose.value = true;
                    break;
                }


            }
        })
    }



    const initSinglePlayer = () => {
        player.fillPlayerInfo({
            color: 'white',
            ...soloPlayerInfo
        })

        enemyPlayer.fillPlayerInfo({
            color: 'black',
            ...soloPlayerInfo
        })

        player.start();
        ws?.close();
    }

    const disconnectServer = () => {
        ws?.close();
    }



    let getPlayer = computed<Player>(() => player as Player);
    let getEnemyPlayer = computed<Player>(() => enemyPlayer as Player);
    let getMessages = computed<Array<Message>>(() => messages);
    let getRoomId = computed<string>(() => currentRoomId.value);
    let isRoomNotFound = computed<boolean>(() => roomNotFound.value)


    const sendTurnInfo = (info: TurnInfo) => {
        ws?.send(JSON.stringify({
            info: info,
            type: 'turn',
            pingTime: new Date().getTime()
        }));
    }
    const sendSurrender = () => {
        ws?.send(JSON.stringify({
            type: 'surrender'
        }))
    }
    const sendMessage = (text: string) => {
        ws?.send(JSON.stringify({
            type: 'message',
            info: {
                text
            }
        }))
        messages.push({ text, read: false, currentUserSender: true, id: msgId++, date: new Date() })
    }
    const sendReadMessages = (ids: Array<number>) => {
        ws?.send(JSON.stringify({
            info: ids,
            type: 'readMessages'
        }))
    }

    return {
        turn, getPlayer, getEnemyPlayer,
        sendTurnInfo, initSinglePlayer, initMultiplayerGame, disconnectServer,
        leaveLose, surrenderLose, resetInfo, sendSurrender, sendMessage, getMessages,
        sendReadMessages, getRoomId, isRoomNotFound, resetRoomId, resetRoomNotFound,
    }
})