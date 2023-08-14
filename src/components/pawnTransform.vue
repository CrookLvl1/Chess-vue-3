<script lang="ts" setup>
import { Figure } from '@/class/chess';
import { type ChessFigure, type ChessColor } from '@/class/chessTypes&Interfaces';
import FigureComponent from '@/components/figureComponent.vue';
import { useAppSettings } from '@/stores/appSettings';
import type { PropType } from 'vue';

const figures: Array<ChessFigure> = ['queen', 'bishop', 'knight', 'rook'];
const emit = defineEmits(['changeFigure']);


const props = defineProps({
    color: { type: String as PropType<ChessColor>, required: true },
    row: { type: Number, required: true },
    column: { type: Number, required: true }
})

const handleClick = (ev: MouseEvent) => {
    let target = ev.target as HTMLElement;
    while (!target.classList.contains('-figure-') && target.tagName !== 'UL') {
        target = target.parentElement as HTMLElement;
    }

    if (target.tagName === 'UL') return;

    const type = target.dataset.type as ChessFigure;

    emit('changeFigure', type);


}

</script>

<template>
        <ul @click="handleClick" class="choose-menu-wrapper">
            <li>
                <h3>{{ useAppSettings().getStrings.choose }}:</h3>
            </li>
            <li data-type="bishop" class="-figure-">
                <FigureComponent :figure="new Figure(color, 'bishop')" />
            </li>
            <li data-type="knight" class="-figure-">
                <FigureComponent :figure="new Figure(color, 'knight')" />
            </li>
            <li data-type="rook" class="-figure-">
                <FigureComponent :figure="new Figure(color, 'rook')" />
            </li>
            <li data-type="queen" class="-figure-">
                <FigureComponent :figure="new Figure(color, 'queen')" />
            </li>
        </ul>
</template>

<style lang="scss" scoped>
// $size: calc(40px + (80 - 40) * ((100vw - 320px) / (1024 - 320)));

.choose-menu-wrapper {
    display: flex;
    top: 0;
    left: 0;
    position: absolute;
    z-index: 10;
    height: 100%;
    background-color: rgba(53, 90, 126, 0.9);
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    // gap: 0.75rem;
    transition: all 250ms ease-out;
    h3 {
        font-size: 1.5rem;
    }
}



.-figure- {
    height: 100%;
    aspect-ratio: 1 / 1;
    padding: 1%;
    box-sizing: border-box;

    // background-color: rgb(107, 142, 62);
    display: block;
    cursor: pointer;
    border-radius: 50%;
    transition: all 250ms ease-out;


    &:hover {
        background-color: rgb(200, 212, 103);
        box-shadow: 0 0 10px 0 rgb(200, 212, 103);
    }
}

</style>