<script lang="ts" setup>
import { useLanguageStrings } from '@/stores/language';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { ref } from 'vue';

const emit = defineEmits(['send']);
const textStrings = useLanguageStrings().getStrings;

let multiplayer = ref<boolean>(false);
let searching = ref<boolean>(false);

const reset = () => {
    multiplayer.value = false;
    searching.value = false;
    useMultiplayerStore().disconnectServer();

}

const chose = (time:number) => {
    emit('send', false, time);
    searching.value = true;
    console.log(searching.value)
}
</script>

<template>
    <div class="main-screen-wrapper">
        <div class="play-type-buttons">
            <template v-if="!multiplayer">
                <button class="classic-button" @click="emit('send', true, 100); multiplayer = false;">
                    {{ textStrings.playSolo }}</button>
                <button class="classic-button" @click="multiplayer = true">
                    {{ textStrings.playMultiplayer }}</button>
            </template>
            <template v-else>
                <template v-if="searching">
                    <div class="loading">
                        123
                        <div class="circle"></div>
                        <div class="circle"></div>
                        <div class="circle"></div>
                    </div>
                </template>
                <template v-else>
                    <button class="classic-button" @click="chose(60)">1</button>
                    <button class="classic-button" @click="chose(120)">2</button>
                    <button class="classic-button" @click="chose(180)">3</button>
                    <button class="classic-button" @click="chose(300)">5</button>
                    <button class="classic-button" @click="chose(600)">10</button>
                    <button class="classic-button" @click="chose(1200)">20</button>
                </template>
                <button class="classic-button" @click="reset">{{ textStrings.returnButton }}</button>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>

@media (max-width: 1024px) {
    .main-screen-wrapper {
        height: 100dvh;
        box-sizing: border-box;
    }
}

.main-screen-wrapper {
    max-width: 1024px;
    width: 100dvw;
    background-color: rgba(98, 112, 126, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    padding: 50px 0;
}


.play-type-buttons {
    display: flex;
    // justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;

    button {
        width: 100%;

    }

    // align-items: center;

}
</style>