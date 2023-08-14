import type { ChessColor, Info, PlayersInfo, TurnInfo, User } from "@/class/chessTypes&Interfaces";
import { Player } from "@/class/player";
import { localIp, securityCode, webSocketPort } from "@/web-socket-server/base";
import { defineStore } from "pinia";
import { reactive, computed, ref, shallowRef } from 'vue'


console.log(`ws://${localIp}:${webSocketPort}`)
export const useMultiplayerStore = defineStore('multiplayer', () => {

    //init obj
    let turn = reactive<TurnInfo>({
        fromRow: 0,
        toRow: 0,
        fromColumn: 0,
        toColumn: 0,
        figureType: null,
    });


    let player = reactive(new Player(0, -1, 'black')),
        enemyPlayer = reactive(new Player(0, -1, 'black'));

    let ws: WebSocket;




    const getMainInfo = (playersData: PlayersInfo, time: number, currentPlayer: User) => {
        const playerColor: ChessColor = playersData.yourColor;
        const enemyColor: ChessColor = playerColor === 'white' ? 'black' : 'white';
        console.log(playersData);

        player.setColor(playerColor);
        player.setId(playersData[`${playerColor}Id`])

        player.setName(currentPlayer.name);
        player.setImgSrc(currentPlayer.imgSrc);
        player.setImgBorder(currentPlayer.borderColor)
        
        
        player.setTime(time);
        player.initTimeSync();


        enemyPlayer.setColor(enemyColor);
        enemyPlayer.setId(playersData[`${enemyColor}Id`]);
        enemyPlayer.setTime(time);
        enemyPlayer.initTimeSync();

        console.log('main info')
        if (playerColor === 'white') player.start();
        else enemyPlayer.start();
    };

    const getUserProfileInfo = (userProfileData: User) => {
        enemyPlayer.setName(userProfileData.name);
        enemyPlayer.setImgSrc(userProfileData.imgSrc);
        enemyPlayer.setImgBorder(userProfileData.borderColor);

    }


    const getTurnInfo = (turnInfo: TurnInfo) => {
        turn.fromColumn = turnInfo.fromColumn;
        turn.fromRow = turnInfo.fromRow;
        turn.toRow = turnInfo.toRow;
        turn.toColumn = turnInfo.toColumn;
        turn.figureType = turnInfo.figureType || null;



        console.log(turnInfo);
    };

    const initMultiplayerGame = (time: number, user: User) => {
        ws = new WebSocket(`ws://${localIp}:${webSocketPort}?authKey=${securityCode}?&time=${time}`);
        ws.addEventListener('message', (msgEv: MessageEvent) => {
            console.log(msgEv.data);

            const data: Info = JSON.parse(msgEv.data);
            switch (data.type) {
                default: {
                    console.log(data.type)
                }
                case 'playersInfo': {
                    getMainInfo(data.info as PlayersInfo, time, user);
                    ws.send(JSON.stringify({
                        type: 'userprofileinfo',
                        info: user
                    }));
                    break;
                }
                case 'userprofileinfo': {
                    getUserProfileInfo(data.info as User);
                    break;
                }

                case 'turn': {
                    getTurnInfo(data.info as TurnInfo);
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
        player.setTime(5999);
        player.setColor('white');
        player.initTimeSync();

        enemyPlayer.setTime(5999);
        enemyPlayer.setColor('black');
        enemyPlayer.initTimeSync();
        player.start();
        if (ws) ws.close();
    }

    const disconnectServer = () => {
        if (!ws) return;
        ws.close();
    }



    let getPlayer = computed<Player>(() => player as Player);
    let getEnemyPlayer = computed<Player>(() => enemyPlayer as Player);



    const sendTurnInfo = (info: TurnInfo) => {
        if (!ws) return;
        ws.send(JSON.stringify({
            info: info,
            type: 'turn',
        }));
    }
    const sendSurrender = () => {
        if (!ws) return;
        ws.send(JSON.stringify({
            type: 'surrender'
        }))
    }



    const resetInfo = (): void => {
        turn.fromRow = turn.toRow = turn.fromColumn = turn.toColumn = 0;
        turn.figureType = null;

        player.setTime(-1);
        player.setId(0);
        player.initTimeSync();
        player.setName('Player');
        player.setImgSrc('');
        player.setImgBorder('');

        enemyPlayer.setTime(-1);
        enemyPlayer.setId(0);
        enemyPlayer.initTimeSync();
        enemyPlayer.setName('Player');
        enemyPlayer.setImgSrc('');
        enemyPlayer.setImgBorder('');

        leaveLose.value = false;
        surrenderLose.value = false;
    }

    let leaveLose = ref<Boolean>(false);
    let surrenderLose = ref<Boolean>(false);

    return { turn, getPlayer, getEnemyPlayer, sendTurnInfo, initSinglePlayer, initMultiplayerGame, disconnectServer, leaveLose, surrenderLose, resetInfo, sendSurrender }
})