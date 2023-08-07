<script lang="ts" setup>
import { Player } from '@/class/player';
import ChessPlayComponent from '@/components/chessPlayComponent.vue';
import GameOptionsVue from '@/components/gameOptions.vue'
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { ref } from 'vue';



const store = useMultiplayerStore();
let initSoloPlay = ref<boolean>(false)

let player = store.getPlayer,
    enemyPlayer = store.getEnemyPlayer;


const initGame = (solo: boolean, timeValue: number) => {
    console.log(solo, timeValue);
    initSoloPlay.value = solo;

    if (!initSoloPlay.value) store.initServer(timeValue);

    else store.setSoloPlayers();

    
    return;
}


</script>

<template>
    <div class="game-wrapper">
        <template v-if="player && enemyPlayer && player.getTime() !== -1 && enemyPlayer.getTime() !== -1">
            <ChessPlayComponent :solo-play="initSoloPlay" :player="(player as Player)"
                :enemy-player="(enemyPlayer as Player)" />
        </template>
        <template v-else>
            <GameOptionsVue @send="initGame" />
        </template>
    </div>
</template>

<style lang="scss"></style>