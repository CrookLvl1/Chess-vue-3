<script lang="ts" setup>
import { type ChessFigure, type ChessColor, Figure } from '@/class/chess';
import FigureComponent from './figureComponent.vue';
import type { PropType } from 'vue';

const figures: Array<ChessFigure> = ['queen', 'bishop', 'knight', 'rook'];

const props = defineProps({
    color: { type: Object as PropType<ChessColor>, required: true },
    row: {type: Number, required: true},
    column: {type: Number, required: true}
})

const handleClick = (ev: MouseEvent) => {
    let target = ev.target as HTMLElement;
    while (!target.classList.contains('-figure-') && target.tagName !== 'UL') {
        target = target.parentElement as HTMLElement;
    }

    if (target.tagName === 'UL') return;




}

</script>

<template>
    <div class="choose-menu">
        <ul @click="handleClick">
            <li class="-figure-">
                <FigureComponent :figure="new Figure(`bishop${color}.png`, color, 'bishop')" />
            </li>
            <li class="-figure-">
                <FigureComponent :figure="new Figure(`knight${color}.png`, color, 'knight')" />
            </li>
            <li class="-figure-">
                <FigureComponent :figure="new Figure(`rook${color}.png`, color, 'rook')" />
            </li>
            <li class="-figure-">
                <FigureComponent :figure="new Figure(`queen${color}.png`, color, 'queen')" />
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.choose-menu {
    display: flex;
    padding: 10px 20px;
    background-color: #476f58;
    width: fit-content;
}

ul {
    .-figure- {
        width: 50px;
        height: 50px;
        display: block;
    }
}
</style>