<script lang="ts" setup>
import { Figure } from '@/class/chess';
import type { ChessFigure, ChessColor, TurnType, FigureTurnType } from '@/class/chessTypes&Interfaces';
import FigureComponent from './figureComponent.vue';
import { computed, type PropType } from 'vue';
import { useAppSettings } from '@/stores/appSettings';
const props = defineProps({
    figure: { type: Figure, required: true }
});

const emit = defineEmits({
    clarify: (type: FigureTurnType) => true,
})

const color = computed<ChessColor>(() => props.figure.getColor());
const mainType = computed<ChessFigure>(() => props.figure.getType());
const stolenType = computed<ChessFigure>(() => props.figure.getStolenType() as ChessFigure);


</script>
<template>
    <div class="user-clarify-wrapper">
        <ul class="type-select">
            <h5>{{ useAppSettings().getStrings.chooseTurn }}:</h5>
            <li class="choosable-figure" @click="emit('clarify', 'own')">
                <FigureComponent :figure="new Figure(color, mainType)" />
            </li>
            <li class="choosable-figure" @click="emit('clarify', 'stolen')">
                <FigureComponent :figure="new Figure(color, stolenType)" />
            </li>
        </ul>
    </div>
</template>
<style lang="scss" scoped>
.user-clarify-wrapper {
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
    gap: 2rem;
    width: 100%;
    transition: all 250ms ease-out;

    h5 {
        font-size: 1.5rem;
    }

}

.type-select {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}
</style>