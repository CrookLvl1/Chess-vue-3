<script lang="ts" setup>
import type { GameState } from '@/class/chessTypes&Interfaces';
import { type PropType, computed, ref } from 'vue';
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

let fold = ref<boolean>(false);

if (player.value.getStarted()) player.value.stop();
if (enemyPlayer.value.getStarted()) enemyPlayer.value.stop();

emit('gameOver');





</script>

<template>
    <transition appear name="from-above">
        <div class="game-end-wrapper" :style="{transform: fold ? 'translateY(-97.5%)' : ''}">
            <div class="info">
                <span v-if="result === 'checkmate'">{{ textStrings[`${winner}Win`] }}</span>
                <span v-else>{{ textStrings[`draw`] }}</span>

                <span v-if="reason">{{ reason }}</span>
            </div>
            <div class="buttons">
                <button class="classic-button" @click="multiplayerStore.resetInfo()">{{ textStrings.returnButton
                }}</button>
            </div>
                <button class="classic-button fold-button" @click="fold = !fold" :style="`${fold ? 'bottom' : 'top'}: 1rem`"
                >{{ fold ? textStrings.unfold :
                    textStrings.fold }}</button>
        </div>
    </transition>
</template>


<style lang="scss" scoped>
.game-end-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 6rem 2rem 1rem;
    background-color: rgba(98, 112, 126, 0.9);
    box-shadow: 0 0 5px 1.5px black;
    display: flex;
    flex-direction: column;
    transition: all 400ms ease-out;
    .fold-button {
        position: absolute;
        right: 1rem;
    }

    span {
        display: block;
        line-height: 1.3em;
    }

    .info {
        text-align: center;
        font-size: 3rem;
        display: flex;
        flex-direction: column;
        gap: 5rem;
    }
}

.buttons {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
}
</style>