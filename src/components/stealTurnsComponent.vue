<script lang="ts" setup>
import type { ChessFigure, ChessColor } from '@/class/chessTypes&Interfaces';
import { useAppSettings } from '@/stores/appSettings';
import FigureComponent from '@/components/figureComponent.vue';
import { computed, type PropType } from 'vue';
import { Figure } from '@/class/chess';

const props = defineProps({
    color: {
        type: String as PropType<ChessColor>,
        required: true,
    },
    possibleSteal: {
        type: Array<ChessFigure>,
        required: true,
    }
})

const textStrings = useAppSettings().getStrings;
const emit = defineEmits({ 'stealTurns': (steal: ChessFigure | null) => true });
// const figure = computed(() => new Figure(props.color, props.figureType)); 
console.log("STEAL LOADED");
const makeFigure = (type: ChessFigure) => new Figure(props.color, type);
</script>
<template>
    <div class="steal-menu-wrapper">
        <h5>{{ textStrings.steal }}?</h5>
        <ul class="figures-steal-list" v-if="possibleSteal">
            <template v-for="figureType in possibleSteal" :key="figureType">
                <li class="choosable-figure" @click="emit('stealTurns', figureType)">
                    <FigureComponent :figure="makeFigure(figureType)" />
                </li>
            </template>
        </ul>
        <button class="choose-figure" v-for="figureType in possibleSteal" :key="figureType"
            @click="emit('stealTurns', figureType)">

        </button>
        <button @click="emit('stealTurns', null)" class="classic-button classic-button-small refuse-steal-btn">{{
            textStrings.stealRefuse }}</button>
    </div>
</template>

<style lang="scss" scoped>
.steal-menu-wrapper {
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
    gap: 0.75rem;
    width: 100%;
    transition: all 250ms ease-out;

    h5 {
        font-size: 1.5rem;
    }

}

.refuse-steal-btn {
    flex: 1 1;
}

.figures-steal-list {
    display: flex;
    height: 100%;
    align-items: center;
    flex: 1 1;

    li {
        width: 6rem;
        height: 6rem;
    }
}</style>