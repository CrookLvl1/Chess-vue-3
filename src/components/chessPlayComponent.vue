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
import { useLanguageStrings } from '@/stores/language';
import { useAppInfo } from '@/stores/appInfo';

const settingsStore = useAppInfo();

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

const multiplayerStore = useMultiplayerStore();


const player = computed<Player>(() => props.player);
const enemyPlayer = computed<Player>(() => props.enemyPlayer);
let result = ref<GameState>('default');

let soundVolume = computed(() => settingsStore.getVolume);
const audioHrefs = useAudioPaths().paths;





const genRandomSound = (hrefs: Array<string>): () => void => {
    const random = (min: number, max: number): number => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return function (): void {
        const audio = new Audio(hrefs[random(0, hrefs.length)]);
        audio.volume = soundVolume.value;

        audio.play();
        setTimeout(() => audio.currentTime = 0, 100);
    }
}
const playChessSound = genRandomSound(audioHrefs);

let color = computed<ChessColor>(() => player.value.getColor());


const field = reactive(new ChessField(props.soloPlay, color.value));

let turn = computed<ChessColor>(() => field.getTurn()),
    colorDown = computed<ChessColor>(() => field.getColorDown()),
    soloPlay = computed<boolean>(() => field.getSoloplay()),
    lastTurn = computed<Turn | null>(() => field.getLastTurn());


let cellCoords = ref<[Number, Number] | []>([]);


//checking game results (draw | default | checkmate)
const checkGameResult = (): GameState => {
    if (field.checkKingMenaces(turn.value) && field.isCheckMate(turn.value) === 'checkmate') {
        return 'checkmate';
    }

    //default || draw
    else return field.isDraw(turn.value)
}

const switchGameStates = (): GameState => {
    field.switchTurn();
    field.calcKingSecure(turn.value)

    //timers
    if (turn.value === player.value.getColor()) {
        player.value.start();
        enemyPlayer.value.stop();
    } else {
        enemyPlayer.value.start();
        player.value.stop()
    };

    return checkGameResult();
}



watch((multiplayerStore.turn), (turnInfo) => {
    console.log('turnInfo');
    console.log(turnInfo);
    playChessSound();
    field.moveFigure(turnInfo.fromRow, turnInfo.fromColumn, turnInfo.toRow, turnInfo.toColumn);


    if (turnInfo.figureType) {
        field.getCell(turnInfo.toRow, turnInfo.toColumn)
            .setFigure(new Figure(turn.value, turnInfo.figureType));

    }

    result.value = switchGameStates();

})


let clicked = false;
let fromRow: number,
    fromColumn: number,
    toRow = ref<number>(0),
    toColumn = ref<number>(0);


let cellsToHint: Array<Cell> = [];



let handleEvents = computed(() => {
    return !(cellCoords.value.length > 0)
});

console.log(handleEvents.value)

const userClickHandler = (ev: MouseEvent) => {
    if (!handleEvents.value || ev.button !== 0) return;
    if (rotate.value && colorDown.value === 'white' || !rotate.value && colorDown.value === 'black') switchRotateUser();
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
        (soloPlay.value || turn.value === colorDown.value) ||
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

            if (!field.moveFigure(fromRow, fromColumn, toRow.value, toColumn.value,)) {
                playChessSound();
                result.value = switchGameStates();

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

//change figure on last move coords
const changeFigure = (type: ChessFigure) => {
    console.log('emit')
    field.transformFigure(toRow.value, toColumn.value, turn.value, type);

    cellCoords.value = [];

    result.value = switchGameStates();
    multiplayerStore.sendTurnInfo({ fromRow, fromColumn, toRow: toRow.value, toColumn: toColumn.value, figureType: type });
}


const leftEnemy = computed(() => multiplayerStore.leaveLose);
const enemyLose = () =>
    result.value = 'checkmate';

watch((leftEnemy), (current) => {
    if (current) enemyLose();
})

const switchRotateUser = () => {
    rotate.value = !rotate.value;
}

let rotate = ref<boolean>(false);
if (colorDown.value === 'black') switchRotateUser();

</script>

<template>
    <div class="chess-container" @dragstart.prevent>
        <GameEndComponent @game-over="multiplayerStore.disconnectServer" v-if="result !== 'default'" :player="player"
            :color="multiplayerStore.leaveLose ? enemyPlayer.getColor() : turn" :result="result" />
        <PlayerComponent @rotate="switchRotateUser" @timeend="result = 'checkmate'" v-if="enemyPlayer"
            :player-obj="(enemyPlayer as Player)" />
        <ul id="chessField" class="chess-outer-list" @click="userClickHandler"
            :style="{ transform: rotate ? 'rotate(180deg)' : '' }">

            <template v-for="rowArr, rowIndex in field.getCells()" :key="rowArr">
                <ul class="row">
                    <template v-for="cell, columnIndex in rowArr" :key="cell">

                        <CellComponentVue :rotate="rotate" :last-turn="lastTurn"
                            :color-down="colorDown" :solo-play="soloPlay" :turn="turn" :cell="cell" :data-row="rowIndex"
                            :data-column="columnIndex" />

                    </template>
                </ul>

            </template>
        </ul>
        <PlayerComponent @timeend="result = 'checkmate'" v-if="player" :you="true" :player-obj="(player as Player)" />


        <div class="turn-view">
            <PawnTransform v-show="!handleEvents" @change-figure="changeFigure" :color="turn" :row="toRow"
                :column="toColumn" />
            <div class="text">{{ useLanguageStrings().getStrings[`${color}Turn`] }}</div>
            <div class="color-show" :style="{ backgroundColor: turn }"></div>
        </div>
    </div>
</template>

<style lang="scss">
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

.rotate-first {
    transform: rotate(180deg);
}

.chess-container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: fit-content;
}

.chess-outer-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    user-select: none;
    box-shadow: 0 0 10px 2px;
    transition: all 300ms cubic-bezier(.89, .01, .12, 1.04);


    .row {
        display: flex;

        $size: calc(40px + (80 - 40) * ((100vw - 320px) / (1024 - 320)));
        // $size: 60px;
        height: $size;
        width: calc($size * 8);

        max-width: calc(80px * 8);
        max-height: 80px;
    }

}
</style>@/stores/appInfo