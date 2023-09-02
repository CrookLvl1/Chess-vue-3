<script lang="ts" setup>
import type { ChessColor, ChessFigure, DrawReason, GameState, PossibleTurns, Turn, TurnInfo, TurnType, GameEndReason, FigureTurnType } from '@/class/chessTypes&Interfaces';
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
import StealTurnsComponent from '@/components/stealTurnsComponent.vue';
import UserTurnClarifyComponent from '@/components/userTurnClarifyComponent.vue';

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
    const audioArr:Array<HTMLAudioElement> = [];
    for (const href of hrefs) {
        const audio = new Audio();
        audio.src = href;
        audioArr.push(audio);
    }


    return function (): void {
        const audio: HTMLAudioElement = audioArr[random(0, hrefs.length - 1)];
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


let gameResult = ref<GameState>('default');
let winner = ref<ChessColor>('white');
let reason = ref<string>();

let clicked = false;
let fromRow: number,
    fromColumn: number,
    toRow = ref<number>(0),
    toColumn = ref<number>(0);


let cellsToHint: PossibleTurns;

let rotate = ref<boolean>(false);

let turn = computed<ChessColor>(() => field.getTurn()),
    soloPlay = computed<boolean>(() => field.getSoloplay()),
    lastTurn = computed<Turn | null>(() => field.getLastTurn());

//cell coords that filling if the pawn is on the edge of the board
let cellCoords = ref<[Number, Number] | []>([]);
let possibleSteal = ref<Array<ChessFigure>>([]);

let userClarifyCell = ref<Cell | null>(null);
let userClarfiyToCell = ref<Cell | null>(null);


let handleEvents = computed(() => {
    return (gameResult.value === 'default' && cellCoords.value.length === 0 && !(possibleSteal.value.length > 0) && !userClarifyCell.value);

});

//checking game results (draw | default | checkmate)
const checkGameResult = (): [GameState, GameEndReason] => {
    if (field.checkKingMenaces(turn.value) && field.isCheckMate(turn.value) === 'checkmate') {
        return ['checkmate', 'checkmate'];
    }

    //default || draw
    return field.isDraw(turn.value) as [GameState, DrawReason]
}

//function that works after player moved his figure. switches various variables in field obj
const switchGameStates = (): void => {
    field.switchTurn();
    field.calcKingSecure(turn.value);
    userClarfiyToCell.value = null;



    //timers
    if (turn.value === playerColor.value) {
        player.value.start();
        enemyPlayer.value.stop();
    } else {
        enemyPlayer.value.start();
        player.value.stop()
    };

    const resultTuple: [GameState, GameEndReason] = checkGameResult();

    switch (resultTuple[0]) {
        case 'checkmate': {
            setGameEndInfo('checkmate', textStrings.value[resultTuple[1]], turn.value === 'black' ? 'white' : 'black')
            break;
        }
        case 'draw': {
            setGameEndInfo('draw', textStrings.value[resultTuple[1]],)
            break;
        }
    }
}

//switch rotate field variable
const switchRotate = () => {
    rotate.value = !rotate.value;
}

//set info about winner for the game over
const setGameEndInfo = (result: GameState, endReason: string, winnerColor?: ChessColor) => {
    reason.value = endReason;
    gameResult.value = result;
    if (winnerColor) winner.value = winnerColor;
}

//Changing figure type


const stealTurns = (type: ChessFigure | null) => {
    possibleSteal.value = [];

    if (type) {
        field.updateStolenType(type);
        (field.getCell(toRow.value, toColumn.value).getFigure() as Figure).setStolenType(type);
    }

    if (handleEvents.value) {
        switchGameStates();
        multiplayerStore.sendTurnInfo({ fromRow, fromColumn, toRow: toRow.value, toColumn: toColumn.value, figureTurnType: (lastTurn.value as Turn).figureTurnType, stolenType: type, figureType: null, turnType: (lastTurn.value as Turn).type });
    }

}

const turnEnding = (cellFrom: Cell, cellToFigure: Figure | null, figureTurnType: FigureTurnType) => {
    const turnType = field.getTurnType(fromRow, fromColumn, toRow.value, toColumn.value, figureTurnType);

    const cellFromFigure = cellFrom.getFigure() as Figure;

    possibleSteal.value = checkStealingTypes(turnType, cellToFigure, cellFromFigure, figureTurnType);

    if (field.moveFigure(fromRow, fromColumn, toRow.value, toColumn.value, turnType, figureTurnType)) cellCoords.value = [toRow.value, toColumn.value];

    //DEFAULT MOVE (NO EN PASSANT && NOT PAWN REACHED THE EDGE OF THE FIELD && NOT FIGURE ATE ANOTHER WHICH TURNS COULD STEAL)
    playChessSound();
    resetClick(cellFrom)
    if (handleEvents.value) {
        switchGameStates()
        multiplayerStore.sendTurnInfo({ fromRow, fromColumn, toRow: toRow.value, toColumn: toColumn.value, figureType: null, figureTurnType, stolenType: null, turnType })
    };


}

const chooseMoveType = (figureTurnType: FigureTurnType) => {
    turnEnding((userClarifyCell.value as Cell), (userClarfiyToCell.value as Cell).getFigure(), figureTurnType);
}

const changeFigure = (type: ChessFigure) => {
    field.transformFigure(toRow.value, toColumn.value, turn.value, type, field.getCell(toRow.value, toColumn.value).getFigure()?.getStolenType());

    cellCoords.value = [];

    switchGameStates();
    multiplayerStore.sendTurnInfo({
        fromRow, fromColumn, toRow: toRow.value, toColumn: toColumn.value,
        figureType: type, figureTurnType: (lastTurn.value as Turn).figureTurnType,
        stolenType: (lastTurn.value as Turn).stolenType,
        turnType: (lastTurn.value as Turn).type
    });
}

const switchHints = (cells: PossibleTurns, value: boolean) => {
    cells.own.forEach((cell: Cell) => cell.setHint(value));
    cells.stolen.forEach((cell: Cell) => cell.setHint(value));
}

const getAvailableSteal = (cellFromFigure: Figure, cellToFigure: Figure, figureTurnType: FigureTurnType): Array<ChessFigure> => {
    const resultArr: Array<ChessFigure> = [];
    const fromType = cellFromFigure.getType() as ChessFigure,
        toType = cellToFigure.getType() as ChessFigure,
        stolenToType: null | ChessFigure = cellToFigure.getStolenType();

    let stolenFromType: null | ChessFigure = cellFromFigure.getStolenType();
    if (stolenFromType && figureTurnType === 'stolen') stolenFromType = null;

    //Checking if there are stealable figure that we have eaten or stolen type that is have
    if (stolenFromType !== toType && field.isStealAvailable(fromType, toType))
        resultArr.push(toType);

    if (stolenToType && stolenToType !== stolenFromType && field.isStealAvailable(fromType, stolenToType))
        resultArr.push(stolenToType);


    return resultArr;
}

const checkStealingTypes = (turnType: TurnType, cellToFigure: Figure | null, cellFromFigure: Figure, figureTurnType: FigureTurnType): Array<ChessFigure> => {
    let resultArr: Array<ChessFigure> = [];

    if (turnType === 'en passant') resultArr = getAvailableSteal(cellFromFigure, field.getCell(fromRow, toColumn.value).getFigure() as Figure, figureTurnType);
    else if (cellToFigure) resultArr = getAvailableSteal(cellFromFigure, cellToFigure, figureTurnType);

    return resultArr;
}

const resetClick = (activeCell: Cell) => {
    clicked = false;
    activeCell.switchSelected();
    userClarifyCell.value = null;
    switchHints(cellsToHint, false);
    cellsToHint = { own: [], stolen: [] };
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
        const cellFromCheck: Cell = field.getCell(fromRow, fromColumn);

        if (cellFromCheck.isFree()) return;

        // switch hints
        cellsToHint = field.getHints(fromRow, fromColumn);
        if (cellsToHint.own.length === 0 && cellsToHint.stolen.length === 0) return;

        switchHints(cellsToHint, true);
        cellFromCheck.switchSelected();
        clicked = true;
    }
    else {
        toRow.value = +(target.dataset.row as string);
        toColumn.value = +(target.dataset.column as string);

        const cellFromCheck: Cell = field.getCell(fromRow, fromColumn);

        //Same color or no hint
        const cellToCheck: Cell = field.getCell(toRow.value, toColumn.value);
        if (!cellToCheck.getHint()) {
            resetClick(cellFromCheck);
            return;
        };




        const cellFromFigure: Figure = cellFromCheck.getFigure() as Figure,
            cellToFigure: Figure | null = cellToCheck.getFigure();

        if (cellFromFigure?.getColor() === cellToFigure?.getColor()) return;

        userClarfiyToCell.value = cellToCheck;





        // ITS OWN IF FIGURES HAVE SAME TURNS !!!!!!! NEED TO FIX IT
        const ownTurn: boolean = cellsToHint.own.includes(cellToCheck);

        const ownTurnType: TurnType = field.getTurnType(fromRow, fromColumn, toRow.value, toColumn.value, 'own'),
            stolenTurnType: TurnType | null = cellFromFigure.getStolenType() ? field.getTurnType(fromRow, fromColumn, toRow.value, toColumn.value, 'stolen') : null;

        if (ownTurn && cellsToHint.stolen.includes(cellToCheck) && stolenTurnType && ownTurnType !== stolenTurnType) {

            userClarifyCell.value = cellFromCheck;

        }

        else {

            turnEnding(cellFromCheck, cellToFigure, ownTurn ? 'own' : 'stolen');
        }

    }



    return;
}



//emit for the parent component that game is over
const playerEmitGameOver = (reasonStr: string, color: ChessColor, surrender: boolean = false) => {
    if (surrender) multiplayerStore.sendSurrender();
    setGameEndInfo('checkmate', reasonStr, color === 'white' ? 'black' : 'white')
}


if (playerColor.value === 'black') switchRotate();


let isSurrendered = computed(() => multiplayerStore.surrenderLose),
    isLeft = computed(() => multiplayerStore.leaveLose);

//enemy moved figure
watch(multiplayerStore.turn, (turnInfo: TurnInfo) => {
    playChessSound();
    // DO STOLEN INFO MESSAGE
    field.moveFigure(turnInfo.fromRow, turnInfo.fromColumn, turnInfo.toRow, turnInfo.toColumn, turnInfo.turnType, turnInfo.figureTurnType);

    if (turnInfo.stolenType) {
        field.updateStolenType(turnInfo.stolenType);
        (field.getCell(turnInfo.toRow, turnInfo.toColumn).getFigure() as Figure).setStolenType(turnInfo.stolenType);
    }

    if (turnInfo.figureType) {
        field.getCell(turnInfo.toRow, turnInfo.toColumn)
            .setFigure(new Figure(turn.value, turnInfo.figureType));

    }

    switchGameStates();

})


//enemy surrendered
watch((isSurrendered), (current) => {
    if (current)
        setGameEndInfo('checkmate', textStrings.value[`${enemyColor.value}Surrendered`], playerColor.value)
})

//enemy left
watch((isLeft), (current) => {
    if (current)
        setGameEndInfo('checkmate', textStrings.value.enemyLeft, playerColor.value);
})

</script>

<template>
    <div class="chess-container" @dragstart.prevent>
        <GameEndComponent v-if="gameResult !== 'default'" :winner="winner" :reason="reason"
            @game-over="multiplayerStore.disconnectServer" :player="player"
            :color="multiplayerStore.leaveLose ? enemyColor : turn" :result="gameResult" />
        <div class="player-wrapper-relative">
            <PlayerComponent :key="3" :game-end="gameResult !== 'default'" :solo="soloPlay" :you="false"
                @rotate="switchRotate" @game-over="playerEmitGameOver" :player-obj="(enemyPlayer as Player)" />
                
            <transition-group name="from-above" appear>
                <PawnTransform :key="1" v-if="(cellCoords.length > 0)" @change-figure="changeFigure" :color="turn"
                    :row="toRow" :column="toColumn" />

                <StealTurnsComponent :key="2" v-if="(possibleSteal.length > 0)" :color="turn"
                    :possible-steal="possibleSteal" @steal-turns="stealTurns" />


                <UserTurnClarifyComponent :key="4" v-if="userClarifyCell?.getFigure()" @clarify="chooseMoveType"
                    :figure="(userClarifyCell?.getFigure() as Figure)" />
            </transition-group>
            
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
        <PlayerComponent :game-end="gameResult !== 'default'" @game-over="playerEmitGameOver" :solo="soloPlay" :you="true"
            :user="appStore.getUser" :player-obj="(player as Player)" />



    </div>
</template>

<style lang="scss">
.player-wrapper-relative {
    padding-top: 1rem;
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

            $size: calc(40px + (80 - 40) * ((100vw - 320px) / (700 - 320)));
            // $size: 60px;
            height: $size;
            width: calc($size * 8);

            max-width: calc(80px * 8);
            max-height: 80px;
            min-width: calc(35px * 8);
            min-height: 40px;
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