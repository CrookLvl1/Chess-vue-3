<script lang="ts" setup>
import FigureComponent from '@/components/figureComponent.vue';
import { type CellColor, type ChessColor, type Turn } from '@/class/chessTypes&Interfaces'
import { type PropType, computed } from 'vue';
import { Cell } from '@/class/chess';



const props = defineProps({
    cell: { type: Object as PropType<Cell>, required: true },
    turn: { type: String as PropType<ChessColor>, required: true },
    soloPlay: { type: Boolean, required: true },
    colorDown: { type: String as PropType<ChessColor>, required: true },
    lastTurn: { type: [Object, null] as PropType<Turn | null>, required: true },
    rotate: { type: Boolean, required: true }
})
let bg = computed<CellColor>(() => {
    const cell = props.cell;

    let bg: CellColor = (cell.getCoords().reduce((a, b) => a + b)) % 2 ? '#7c573e' : '#908782';

    const lastTurn = props.lastTurn;
    const coords = cell.getCoords();
    if (lastTurn?.fromRow === coords[0] && lastTurn?.fromColumn === coords[1] ||
        lastTurn?.toRow === coords[0] && lastTurn?.toColumn === coords[1]) {
        //~lightgreen color
        bg = '#90955a';
    }


    //~lightcoral color
    else if (cell.getChecked()) bg = '#d17363';

    //~(red - orange) color
    else if (cell.isSelected()) bg = '#b18f4f';

    return bg;
});


</script>

<template>
    <li class="cell-wrapper" :style="{
        backgroundColor: bg,
        boxShadow: cell.isSelected() ? `0 0 50px 0 ${bg}` : '',
        cursor:
            turn === cell.getFigure()?.getColor() &&
                (soloPlay || turn === colorDown) ||
                cell.getHint() ? 'pointer' : 'default'
    }">
        <FigureComponent :style="{'transform': rotate ?'rotate(180deg)' : ''}" v-if="cell.getFigure()" :figure="cell.getFigure()" />
        <!-- <div>{{ cell.getCoords() }}</div> -->
        <div class="hint" v-show="cell.getHint()">
            <div class="circle" :class="{ 'cell-attacked': !cell.isFree() }">
            </div>
        </div>
    </li>
</template>

<style lang="scss">
.cell-wrapper {
    position: relative;
    display: block;
    padding: 1%;
    box-sizing: border-box;
    width: 12.5%;
    height: 100%;
    transition: all 100ms ease-out;
    transition-property: background-color;
    transition-property: box-shadow;
}

.cell-attacked {
    background-color: lightcoral;
    box-shadow: 0 0 0 1rem lightcoral;
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
        width: 1rem;
        height: 1rem;
        background-color: #414e5b;
        border-radius: 50%;
        opacity: 50%;

    }
}
</style>
