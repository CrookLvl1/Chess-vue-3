<script lang="ts" setup>
import SearchingComp from '@/components/searchingComp.vue'
import { useAppSettings } from '@/stores/appSettings';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { computed, ref, watch } from 'vue';
import MultiplayerStartButtons from './multiplayerStartButtons.vue';
import PrivateGame from './privateGameComponent.vue';
import menuTransitionComponent from './menuTransitionComponent.vue';

type CurrentScreen = 'start' | 'searching' | 'multiplayer' | 'private' | 'searching';

const multiplayerStore = useMultiplayerStore();
const appStore = useAppSettings();
const textStrings = computed(() => appStore.getStrings);

let currentScreen = ref<CurrentScreen>('start');

const emit = defineEmits({
    'initGame': (solo: boolean, time: number, personalGame: boolean, host?: boolean, roomId?: string) => true
})

const reset = () => {
    currentScreen.value = 'start';
    multiplayerStore.disconnectServer();
}

const initMultiplayerGame = (time: number, personalGame: boolean = false, host?: boolean, roomId?: string) => {
    emit('initGame', false, time, personalGame, host, roomId);
    if (!personalGame) currentScreen.value = 'searching';
}

</script>

<template>
    <div class="interface-wrapper">
        <menuTransitionComponent>
            <template v-if="currentScreen === 'start'">
                <ul class="play-type-buttons">
                    <li> <button class="classic-button menu-button" @click="emit('initGame', true, 5999, false)">
                            {{ textStrings.playSolo }}</button></li>
                    <li> <button class="classic-button menu-button" @click="currentScreen = 'multiplayer'">
                            {{ textStrings.playMultiplayer }}</button></li>
                    <li>
                        <button class="classic-button menu-button" @click="currentScreen = 'private'">
                            {{ textStrings.playWithFriend }}</button>
                    </li>
                </ul>
            </template>
            <template v-else>
                <SearchingComp v-if="currentScreen === 'searching'" :text="textStrings.searching" />

                <MultiplayerStartButtons v-else-if="currentScreen === 'multiplayer'" @send-time="initMultiplayerGame" />

                <PrivateGame :key="2" v-else-if="currentScreen === 'private'" @start-game="initMultiplayerGame" />

            </template>
        </menuTransitionComponent>
        <menuTransitionComponent>
            <button v-if="currentScreen !== 'start'" class="classic-button reset-button" @click="reset">{{
                textStrings.returnButton }}</button>
        </menuTransitionComponent>

    </div>
</template>

<style lang="scss" scoped>
.interface-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 10rem 0 2rem;
    height: 100%;
    box-sizing: border-box;


    .reset-button {
        width: 20rem;
        height: 4.5rem;
        margin-top: auto;
        bottom: 1rem;
        position: static;
        transition: all 400ms ease-out;

        &:hover,
        &:focus {
            box-shadow:
                inset 10rem 0 0 0 rgb(240, 90, 90),
                inset -10rem 0 0 0 rgb(240, 90, 90);
            color: rgb(220, 220, 220);
        }

        &:active {
            transition: scale 100ms ease-in;
            scale: 0.9;
        }
    }
}
</style>