<script lang="ts" setup>
import { Player } from '@/class/player';
import ChessPlayComponent from '@/components/chessPlayComponent.vue';
import GameOptionsVue from '@/components/gameOptions.vue'
import { useAppSettings } from '@/stores/appSettings';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { ref, computed } from 'vue';

const multiplayerStore = useMultiplayerStore();

let initSoloPlay = ref<boolean>(false)

let player = computed(() => multiplayerStore.getPlayer),
    enemyPlayer = computed(() => multiplayerStore.getEnemyPlayer);

let drawComponent = computed<boolean>(() => {
    return player.value && enemyPlayer.value && player.value.getTime() !== -1 && enemyPlayer.value.getTime() !== -1;
})

const initGame = (solo: boolean, time: number) => {
    if (solo) {
        initSoloPlay.value = true;
        multiplayerStore.initSinglePlayer();
    }
    else {
        initSoloPlay.value = false;
        multiplayerStore.initMultiplayerGame(time, useAppSettings().getUser);
    }
}

</script>

<template>
    <div class="game-wrapper">
        <ChessPlayComponent v-if="drawComponent"
            :solo-play="initSoloPlay" :player="(player as Player)" :enemy-player="(enemyPlayer as Player)" />

        <GameOptionsVue @init-game="initGame" v-else />
    </div>
</template>

<style lang="scss">
    .game-wrapper {
        width: 100%;
    }
</style>