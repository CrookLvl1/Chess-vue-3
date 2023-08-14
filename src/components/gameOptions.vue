<script lang="ts" setup>
import SearchingComp from '@/components/searchingComp.vue'
import { useAppSettings } from '@/stores/appSettings';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { computed, ref } from 'vue';

const multiplayerStore = useMultiplayerStore();
const textStrings = computed(() => useAppSettings().getStrings);

let startScreen = ref<boolean>(true);
let searching = ref<boolean>(false);

const emit = defineEmits({
    'initGame': (solo: boolean, time: number) => true
})


const reset = () => {
    searching.value = false;
    startScreen.value = true;
    multiplayerStore.disconnectServer();
}

const initMultiplayerGame = (time: number) => {
    searching.value = true;
    emit('initGame', false, time);
}
</script>

<template>
    <div class="play-type-buttons">

        <template v-if="startScreen">
            <button class="classic-button start-game-button" @click="emit('initGame', true, 5999)">
                {{ textStrings.playSolo }}</button>
            <button class="classic-button start-game-button" @click="startScreen = false">
                {{ textStrings.playMultiplayer }}</button>
        </template>

        <template v-else>
            <template v-if="!searching">
                <div class="buttons-row">
                    <button class="classic-button" @click="initMultiplayerGame(60)">1</button>
                    <button class="classic-button" @click="initMultiplayerGame(120)">2</button>
                    <button class="classic-button" @click="initMultiplayerGame(180)">3</button>
                </div>
                <div class="buttons-row">
                    <button class="classic-button" @click="initMultiplayerGame(300)">5</button>
                    <button class="classic-button" @click="initMultiplayerGame(600)">10</button>
                    <button class="classic-button" @click="initMultiplayerGame(1200)">20</button>
                </div>
            </template>
            <SearchingComp v-else :text="textStrings.searching" />
            <button class="classic-button reset-button" @click="reset">{{ textStrings.returnButton }}</button>
        </template>

    </div>
</template>

<style lang="scss" scoped>
.start-game-button {
    width: 33%;
    min-width: fit-content;

    @media (max-width: 600px) {
        width: fit-content;
    }
}


.play-type-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: 10rem;

    .reset-button {
        width: 33%;
    }

    .buttons-row {
        display: flex;
        justify-content: space-evenly;

        button {
            width: 25%;
        }

        width: 100%;
        gap: 1rem;
    }

    // justify-content: space-between;
    margin-top: 2rem;
    gap: 3rem;

    // align-items: center;

}
</style>