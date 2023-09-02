<script lang="ts" setup>
import { Player } from '@/class/player';
import GameOptionsVue from '@/components/gameOptions.vue'
import { useAppSettings } from '@/stores/appSettings';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { ref, computed, defineAsyncComponent } from 'vue';
import SearchingCompVue from '@/components/searchingComp.vue';

const multiplayerStore = useMultiplayerStore();

let initSoloPlay = ref<boolean>(false)

let player = computed(() => multiplayerStore.getPlayer),
    enemyPlayer = computed(() => multiplayerStore.getEnemyPlayer);

let drawComponent = computed<boolean>(() => {
    return player.value && enemyPlayer.value && player.value.getTime() !== -1 && enemyPlayer.value.getTime() !== -1;
})

const initGame = (solo: boolean, time: number, personalGame: boolean, host?: boolean, roomId?: string) => {
    if (solo) {
        initSoloPlay.value = true;
        multiplayerStore.initSinglePlayer();
    }
    else {
        initSoloPlay.value = false;
        multiplayerStore.initMultiplayerGame(time, useAppSettings().getUser, personalGame, host, roomId);
    }
}
const ChessPlayComponent = defineAsyncComponent(() => import('@/components/chessPlayComponent.vue'))



</script>

<template>
    <div class="game-wrapper">
        <transition name="fade">
            <SearchingCompVue class="loading" v-show="drawComponent" :text="useAppSettings().getStrings.loading + '...'" />
        </transition>
        <transition appear name="from-above">
            <ChessPlayComponent v-if="drawComponent" :solo-play="initSoloPlay" :player="(player as Player)"
                :enemy-player="(enemyPlayer as Player)" />

            <GameOptionsVue @init-game="initGame" v-else />
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0%;
    visibility: hidden;
    display: none;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 100%;
    visibility: visible;
    display: flex;
}

.fade-enter-active,
.fand-leave-active {
    transition: all 300ms linear;
}


.game-wrapper {
    width: 100%;
    height: 100%;
}

.loading {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
}
</style>