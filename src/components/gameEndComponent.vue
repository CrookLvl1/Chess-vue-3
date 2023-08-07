<script lang="ts" setup>
import type { GameState } from '@/class/chessTypes&Interfaces';
import type { PropType } from 'vue';
import type { ChessColor } from '@/class/chessTypes&Interfaces';
import { useLanguageStrings } from '@/stores/language';
import { useMultiplayerStore } from '@/stores/multiplayerStore';

const props = defineProps({
    result: {
        type: String as PropType<GameState>,
        required: true
    },
    color: {
        type: String as PropType<ChessColor>,
        required: true,
    },
})

const emit = defineEmits(['gameOver']);
emit('gameOver');
const languageText = useLanguageStrings().getStrings;
let text: string;

if (props.result === 'checkmate') {
    text = languageText[`${props.color === 'black' ? 'white' : 'black'}Win`]
} else {
    text = languageText.draw;
}





</script>

<template>
    <transition :duration="1000" appear name="game">
        <div class="wrapper">
            <div class="info">
                    <span>{{ text }}</span>
            </div>
            <div class="buttons">
                <button class="classic-button" @click="useMultiplayerStore().resetInfo()">{{ languageText.returnButton }}</button>
            </div>
        </div>
    </transition>
</template>


<style lang="scss" scoped>
.wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 20px;
    background-color: rgba(98, 112, 126, 0.9);
    box-shadow: 0 0 5px 1.5px black;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .info {
        text-align: center;
        font-size: 3rem;
    }   
    .buttons {
        display: flex;
    }
}



.game-enter-from,
.game-appear-from {
    opacity: 0%;
    transform: translateY(-70%);
}

// .game-leave-from,
.game-enter-to,
.game-appear-to {
    opacity: 100%;
    transform: translateY(0%);
}


.game-enter-active,
.game-appear-active {
    transition: all 1s ease-out;
}
</style>


