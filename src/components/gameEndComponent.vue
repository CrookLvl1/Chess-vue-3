<script lang="ts" setup>
import type { GameState } from '@/class/chessTypes&Interfaces';
import { type PropType, computed } from 'vue';
import type { ChessColor } from '@/class/chessTypes&Interfaces';
import { useAppSettings } from '@/stores/appSettings';
import { useMultiplayerStore } from '@/stores/multiplayerStore';

const props = defineProps({
    result: {
        type: String as PropType<GameState>,
        required: true
    },
    winner: {
        type: String as PropType<ChessColor>,
        required: true,
    },
    reason: {
        type: String,
        required: false,
    }
})

const emit = defineEmits(['gameOver']);
const textStrings = useAppSettings().getStrings;
const multiplayerStore = useMultiplayerStore();
const player = computed(() => multiplayerStore.getPlayer)
const enemyPlayer = computed(() => multiplayerStore.getEnemyPlayer)


if (player.value.getStarted()) player.value.stop();
if (enemyPlayer.value.getStarted()) enemyPlayer.value.stop();

emit('gameOver');





</script>

<template>
    <transition :duration="1000" appear name="game">
        <div class="wrapper">
            <div class="info">
                <span v-if="result === 'checkmate'">{{ textStrings[`${winner}Win`] }}</span>
                <span v-else>{{ textStrings[`draw`] }}</span>

                <span v-if="reason">{{ reason }}</span>
            </div>
            <div class="buttons">
                <button class="classic-button" @click="multiplayerStore.resetInfo()">{{ textStrings.returnButton
                }}</button>
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
    span {
        display: block;
    }

    .info {
        text-align: center;
        font-size: 3rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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


