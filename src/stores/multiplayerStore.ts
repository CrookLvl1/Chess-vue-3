import type { ChessColor, Info, PlayersInfo, TurnInfo } from "@/class/chessTypes&Interfaces";
import { webSocketPort, localIp, securityCode } from '@/web-socket-server/base';
import { Player } from "@/class/player";
import { defineStore } from "pinia";
import { reactive, computed, ref } from 'vue'



console.log(`ws://${localIp}:${webSocketPort}`)
export const useMultiplayerStore = defineStore('multiplayer', () => {

    //init obj
    let turn = reactive<TurnInfo>({
        fromRow: 0,
        toRow: 0,
        fromColumn: 0,
        toColumn: 0,
        figureType: null
    });


    let player = reactive(new Player(0, -1, 'black')),
        enemyPlayer = reactive(new Player(0, -1, 'black'));

    let ws: WebSocket;


    const setSoloPlayers = () => {
        player.setTime(5999);
        player.setColor('white');
        enemyPlayer.setTime(5999);
        enemyPlayer.setColor('black');
        if (ws) ws.close();
    }

    const getMainInfo = (playersData: PlayersInfo, time: number) => {
        const playerColor: ChessColor = playersData.yourColor;
        const enemyColor: ChessColor = playerColor === 'white' ? 'black' : 'white';

        player.setColor(playerColor);
        player.setId(playersData[`${playerColor}Id`])
        player.setTime(time);
        console.log(player.getTime());

        enemyPlayer.setColor(enemyColor);
        enemyPlayer.setId(playersData[`${enemyColor}Id`]);
        enemyPlayer.setTime(time);


    };

    const getTurnInfo = (turnInfo: TurnInfo) => {
        turn.fromColumn = turnInfo.fromColumn;
        turn.fromRow = turnInfo.fromRow;
        turn.toRow = turnInfo.toRow;
        turn.toColumn = turnInfo.toColumn;
        turn.figureType = turnInfo.figureType || null;


        console.log(turnInfo);
    };

    const initServer = (time: number) => {

        ws = new WebSocket(`ws://${localIp}:${webSocketPort}?authKey=${securityCode}&?time=${time}`);


        ws.addEventListener('open', ev => {
            ws.addEventListener('message', (msgEv: MessageEvent) => {
                console.log(msgEv.data, JSON.parse(msgEv.data))
                const data: Info = JSON.parse(msgEv.data);
                switch (data.type) {
                    case 'playersInfo': {
                        getMainInfo(data.info as PlayersInfo, time);
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
                }
            })
        });
    }

    const disconnectServer = () => {
        if (!ws) return;
        ws.close();
    }



    const getPlayer = computed<Player>(() => player as Player);
    const getEnemyPlayer = computed<Player>(() => enemyPlayer as Player);


    const sendTurnInfo = (info: TurnInfo) => {
        if (!ws) return;
        ws.send(JSON.stringify({
            info: info,
            type: 'turn',
        }));
    }



    const resetInfo = (): void => {
        turn.fromRow = turn.toRow = turn.fromColumn = turn.toColumn = 0;
        turn.figureType = null;

        player.setTime(-1);
        player.setId(0);
        enemyPlayer.setTime(-1);
        enemyPlayer.setId(0);
        
        leaveLose.value = false;
    }

    let leaveLose = ref<Boolean>(false);

    return { turn, getPlayer, getEnemyPlayer, sendTurnInfo, initServer, disconnectServer, leaveLose, resetInfo, setSoloPlayers }
})