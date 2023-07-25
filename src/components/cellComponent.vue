<script lang="ts" setup>
import FigureComponent from './figureComponent.vue';
import { Cell, type CellColor, type ChessColor, ChessField, type Turn } from '../class/chess'
import { reactive, type PropType } from 'vue';


const props = defineProps({
    cell: { type: Object as PropType<Cell>, required: true },
    width: { type: Number, required: true },
    turn: { type: String as PropType<ChessColor>, required: true },
    soloPlay: { type: Boolean, required: true },
    colorDown: { type: String as PropType<ChessColor>, required: true },
    lastTurn: { type: [Object, null] as PropType<Turn | null>, required: true }
})

let bg: CellColor = (props.cell.getCoords().reduce((a, b) => a + b)) % 2 ? '#7c573e' : '#908782';

// if (props.cell.getSelected()) bg =  
// const cell = reactive(props.cell)
</script>

<template>
    <li class="cell-wrapper" :style="{
        // backgroundColor: bg,
        backgroundColor: 'rgba(189, 150, 93, .8)',
        width: width + 'px',
        height: width + 'px',
        cursor:
            !cell.isFree() &&
                turn === cell.getFigure()?.getColor() &&
                (soloPlay || turn === colorDown) ||
                cell.getHint() ?
                'pointer' : 'default'

    }">
        <FigureComponent v-if="cell.getFigure()" :figure="cell.getFigure()" />
        <!-- <div>{{ cell.getCoords() }}</div> -->
        <div class="hint" v-show="cell.getHint()">
            <div class="circle" :style="!cell.isFree() && { backgroundColor: 'lightcoral', opacity: '47.5%' } || ''"></div>
        </div>
    </li>
</template>

<style lang="scss">
.cell-wrapper {
    position: relative;
    display: block;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(189, 150, 93, .1);

}


.hint {
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    .circle {
        position: absolute;
        width: 12.5px;
        height: 12.5px;
        background-color: #414e5b;
        border-radius: 50%;
        opacity: 50%;

    }
}
</style>
