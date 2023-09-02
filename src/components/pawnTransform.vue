<script lang="ts" setup>
import { Figure } from '@/class/chess';
import { type ChessFigure, type ChessColor } from '@/class/chessTypes&Interfaces';
import FigureComponent from '@/components/figureComponent.vue';
import { useAppSettings } from '@/stores/appSettings';
import type { PropType } from 'vue';

const figures: Array<ChessFigure> = ['queen', 'bishop', 'knight', 'rook'];
const emit = defineEmits({
    'changeFigure': (type: ChessFigure) => true,
});


const props = defineProps({
    color: { type: String as PropType<ChessColor>, required: true },
    row: { type: Number, required: true },
    column: { type: Number, required: true }
})

</script>

<template>
    <ul class="choose-menu-wrapper">
        <li>
            <h3>{{ useAppSettings().getStrings.choose }}:</h3>
        </li>
        <template v-for="figureType in figures" :key="figureType">
            <li :data-type="figureType" class="choosable-figure" @click="emit('changeFigure', figureType)">
                <FigureComponent :figure="new Figure(color, figureType)" />
            </li>
        </template>
    </ul>
</template>

<style lang="scss" scoped>
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

</style>