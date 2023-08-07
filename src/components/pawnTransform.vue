<script lang="ts" setup>
import { Figure } from '@/class/chess';
import { type ChessFigure, type ChessColor } from '@/class/chessTypes&Interfaces';
import FigureComponent from '@/components/figureComponent.vue';
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useLanguageStrings } from '@/stores/language';

const figures: Array<ChessFigure> = ['queen', 'bishop', 'knight', 'rook'];
const emit = defineEmits(['changeFigure']);


const choose = computed(() => useLanguageStrings().getStrings.choose);


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
    <div class="choose-menu-wrapper">
        <h3>{{ choose }}:</h3>
        <ul @click="handleClick">
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
    </div>
</template>

<style lang="scss" scoped>
.choose-menu-wrapper {
    display: flex;
    top: 0;
    left: 0;
    background-color: #476f58;
    width: fit-content;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    justify-content: space-between;
}

ul {
    display: flex;
    gap: 20px;

    .-figure- {
        $size: calc(40px + (90 - 40) * ((100vw - 320px) / (1024 - 320)));
        width: $size;
        height: $size;
        max-width: 80px;
        max-height: 80px;
        display: block;
        cursor: pointer;
        &:hover {
            background-color: rgb(60, 139, 72);
        }
    }
}
</style>