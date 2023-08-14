<script lang="ts" setup>
import type { ChessColor, ChessFigure, GameState, Turn, TurnInfo } from '@/class/chessTypes&Interfaces';
import { ChessField, Figure } from '@/class/chess';
import { Cell } from '@/class/chess';
import CellComponentVue from '@/components/cellComponent.vue';
import PawnTransform from '@/components/pawnTransform.vue';
import PlayerComponent from '@/components/playerComponent.vue';
import { computed, reactive, ref, type PropType, watch } from 'vue';
import { useAudioPaths } from '@/stores/paths';
import { Player } from '@/class/player';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import GameEndComponent from '@/components/gameEndComponent.vue';
import { useAppSettings } from '@/stores/appSettings';

const appStore = useAppSettings();

const textStrings = computed(() => appStore.getStrings);

const multiplayerStore = useMultiplayerStore();

let soundVolume = computed(() => appStore.getVolume);
const audioHrefs = useAudioPaths().paths;


const genRandomSound = (hrefs: Array<string>): () => void => {
    const random = (min: number, max: number): number => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const audio = new Audio();
    return function (): void {
        audio.src = hrefs[random(0, hrefs.length - 1)];
        audio.volume = soundVolume.value;
        audio.play();
        audio.currentTime = 0;
    }
}
const playChessSound = genRandomSound(audioHrefs);

const props = defineProps({
    soloPlay: {
        type: Boolean,
        required: true
    },
    player: {
        type: Object as PropType<Player>,
        required: true,
    },
    enemyPlayer: {
        type: Object as PropType<Player>,
        required: true
    }
})

const player = computed<Player>(() => multiplayerStore.getPlayer);
const enemyPlayer = computed<Player>(() => multiplayerStore.getEnemyPlayer);

let playerColor = computed<ChessColor>(() => player.value.getColor());
let enemyColor = computed<ChessColor>(() => playerColor.value === 'white' ? 'black' : 'white');

//INIT CLASS OBJECT
const field = reactive(new ChessField(props.soloPlay, playerColor.value));


let result = ref<GameState>('default');
let winner = ref<ChessColor>('white');
let reason = ref<string>();

let clicked = false;
let fromRow: number,
    fromColumn: number,
    toRow = ref<number>(0),
    toColumn = ref<number>(0);


let cellsToHint: Array<Cell> = [];

let rotate = ref<boolean>(false);

let turn = computed<ChessColor>(() => field.getTurn()),
    soloPlay = computed<boolean>(() => field.getSoloplay()),
    lastTurn = computed<Turn | null>(() => field.getLastTurn());

//cell coords that filling if the pawn is on the edge of the board
let cellCoords = ref<[Number, Number] | []>([]);


let handleEvents = computed(() => {
    return !(cellCoords.value.length > 0)
});

//checking game results (draw | default | checkmate)
const checkGameResult = (): GameState => {
    if (field.checkKingMenaces(turn.value) && field.isCheckMate(turn.value) === 'checkmate') {
        return 'checkmate';
    }

    //default || draw
    return field.isDraw(turn.value)
}

//function that works after player moved his figure. switches various variables in field obj
const switchGameStates = (): void => {
    field.switchTurn();
    field.calcKingSecure(turn.value)

    //timers
    if (turn.value === playerColor.value) {
        player.value.start();
        enemyPlayer.value.stop();
    } else {
        enemyPlayer.value.start();
        player.value.stop()
    };

    switch (checkGameResult()) {
        case 'checkmate': {
            setWinnerInfo('checkmate', textStrings.value.checkmate, turn.value === 'black' ? 'white' : 'black')
            break;
        }
        case 'draw': {
            result.value = 'draw';
            break;
        }
    }
}

//switch rotate field variable
const switchRotate = () => {
    rotate.value = !rotate.value;
}

//set info about winner for the game over
const setWinnerInfo = (gameResult: GameState, winReason: string, winnerColor: ChessColor) => {
    winner.value = winnerColor;
    reason.value = winReason;
    result.value = gameResult;
}

//Changing figure type
const changeFigure = (type: ChessFigure) => {
    field.transformFigure(toRow.value, toColumn.value, turn.value, type);

    cellCoords.value = [];

    switchGameStates();
    multiplayerStore.sendTurnInfo({ fromRow, fromColumn, toRow: toRow.value, toColumn: toColumn.value, figureType: type });
}

//User click handler - delegation
const userClickHandler = (ev: MouseEvent) => {
    if (!handleEvents.value) return;
    if (rotate.value && playerColor.value === 'white' || !rotate.value && playerColor.value === 'black') switchRotate();
    let target = ev.target as HTMLElement;


    while (target && !target.classList.contains('cell-wrapper') && target.tagName !== 'LI' && target.tagName !== 'UL') {
        target = target.parentElement as HTMLElement;
    }

    if (!target || !target.classList.contains('cell-wrapper') || target.tagName === 'UL') return;

    //not allow to touch enemy figures if playing not solo...

    const cell = field.getCell(
        +(target.dataset.row as string),
        +(target.dataset.column as string)
    );

    if (!(!cell.isFree() &&
        turn.value === cell.getFigure()?.getColor() &&
        (soloPlay.value || turn.value === playerColor.value) ||
        cell.getHint()))
        return;


    if (!clicked) {
        fromRow = +(target.dataset.row as string);
        fromColumn = +(target.dataset.column as string);
        const cellFromCheck = field.getCell(fromRow, fromColumn);
        if (cellFromCheck.isFree()) return;

        // switch hints
        cellsToHint = field.getHints(fromRow, fromColumn);
        if (cellsToHint.length === 0) return;

        cellsToHint.forEach((cell: Cell) => {
            cell.switchHint();
        })

        cellFromCheck.switchSelected();

        clicked = true;

    }
    else {
        toRow.value = +(target.dataset.row as string);
        toColumn.value = +(target.dataset.column as string);

        //Same color or no hint
        const cellFromCheck = field.getCell(fromRow, fromColumn),
            cellToCheck = field.getCell(toRow.value, toColumn.value);
        if (cellFromCheck.getFigure()?.getColor() === cellToCheck.getFigure()?.getColor() || !cellToCheck.getHint()) {

            cellsToHint.forEach((cell: Cell) => cell.switchHint());
            clicked = false;
            cellFromCheck.switchSelected()
            return;
        };

        if (field.getCell(toRow.value, toColumn.value).getHint()) {
            cellsToHint.forEach((cell: Cell) => {
                cell.switchHint();
            })
            field.getCell(fromRow, fromColumn).switchSelected()

            playChessSound();
            if (!field.moveFigure(fromRow, fromColumn, toRow.value, toColumn.value,)) {
                switchGameStates();

                multiplayerStore.sendTurnInfo({ fromRow, fromColumn, toRow: toRow.value, toColumn: toColumn.value, figureType: null });
            }


            else {
                cellCoords.value = [toRow.value, toColumn.value]
                //else look in change figure
            }


        }


        clicked = false;
        cellsToHint = [];
        return;
    }


}

//emit for the parent component that game is over
const playerEmitGameOver = (reasonStr: string, color: ChessColor, surrender: boolean = false) => {
    if (surrender) multiplayerStore.sendSurrender();
    setWinnerInfo('checkmate', reasonStr, color === 'white' ? 'black' : 'white')
}

if (playerColor.value === 'black') switchRotate();





let isSurrendered = computed(() => multiplayerStore.surrenderLose),
    isLeft = computed(() => multiplayerStore.leaveLose)



//enemy moved figure
watch((multiplayerStore.turn), (turnInfo) => {
    console.log('turnInfo');
    console.log(turnInfo);
    playChessSound();
    field.moveFigure(turnInfo.fromRow, turnInfo.fromColumn, turnInfo.toRow, turnInfo.toColumn);


    if (turnInfo.figureType) {
        field.getCell(turnInfo.toRow, turnInfo.toColumn)
            .setFigure(new Figure(turn.value, turnInfo.figureType));

    }

    switchGameStates();

})

//enemy surrendered
watch((isSurrendered), (current) => {
    if (current)
        setWinnerInfo('checkmate', textStrings.value[`${enemyColor.value}Surrendered`], playerColor.value)

})

//enemy left
watch((isLeft), (current) => {
    if (current)
        setWinnerInfo('checkmate', textStrings.value.enemyLeft, playerColor.value);

})
</script>

<template>
    <div class="chess-container" @dragstart.prevent>
        <GameEndComponent v-if="result !== 'default'" :winner="winner" :reason="reason"
            @game-over="multiplayerStore.disconnectServer" :player="player"
            :color="multiplayerStore.leaveLose ? enemyColor : turn" :result="result" />
        <div class="player-wrapper-absolute">
            <PawnTransform v-show="!handleEvents" @change-figure="changeFigure" :color="turn" :row="toRow"
                :column="toColumn" />
            <PlayerComponent :user="{'name': '', imgSrc: ''}" :solo="soloPlay" :you="false" @rotate="switchRotate" @game-over="playerEmitGameOver"
                :player-obj="(enemyPlayer as Player)" />
        </div>
        <ul id="chessField" class="chess-outer-list" @click.left="userClickHandler"
            :style="{ transform: rotate ? 'rotate(180deg)' : '' }">
            <template v-for="rowArr, rowIndex in field.getCells()" :key="rowArr">
                <ul class="row">
                    <template v-for="cell, columnIndex in rowArr" :key="cell">

                        <CellComponentVue :rotate="rotate" :last-turn="lastTurn" :color-down="playerColor"
                            :solo-play="soloPlay" :turn="turn" :cell="cell" :data-row="rowIndex"
                            :data-column="columnIndex" />

                    </template>
                </ul>

            </template>
        </ul>
        <PlayerComponent @game-over="playerEmitGameOver" :solo="soloPlay" :you="true" :user="appStore.getUser" :player-obj="(player as Player)" />



    </div>
</template>

<style lang="scss">
.player-wrapper-absolute {
    position: relative;
}

.chess-container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: fit-content;
    margin: 0 auto;
    gap: 1rem;



    .chess-outer-list {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        width: fit-content;
        margin: 0 auto;
        user-select: none;
        box-shadow: 0 0 10px 2px;
        transition: all 300ms cubic-bezier(.89, .01, .12, 1.04);


        .row {
            display: flex;

            $size: calc(35px + (80 - 30) * ((100vw - 320px) / (1024 - 320)));
            // $size: 60px;
            height: $size;
            width: calc($size * 8);

            max-width: calc(80px * 8);
            max-height: 80px;
            min-width: calc(35px * 8);
            min-height: 35px;
        }

    }
}

.turn-view {
    display: flex;
    border: 5px solid rgb(138, 115, 115);
    padding: 10px;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    box-sizing: border-box;
    flex-wrap: wrap;
    position: relative;
    height: 100px;

    .text {
        font-size: 2.5rem;
        color: rgb(232, 214, 214);
    }

    .color-show {
        width: calc(120px + (200 - 120) * ((100vw - 320px) / (1024 - 320)));
        max-width: 200px;
        height: 50px;
    }

}
</style>