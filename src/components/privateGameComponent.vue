<script lang="ts" setup>
import MultiplayerStartButtons from '@/components/multiplayerStartButtons.vue';
import { useAppSettings } from '@/stores/appSettings';
import { computed, ref, watch, type InputHTMLAttributes } from 'vue';
import SearchingCompVue from '@/components/searchingComp.vue';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import menuTransitionComponent from '@/components/menuTransitionComponent.vue';

const multiplayerStore = useMultiplayerStore();
const textStrings = computed(() => useAppSettings().getStrings);

const emit = defineEmits({
    'start-game': (time: number, personalGame: boolean, host: boolean, roomId?: string) => true
})
type Screen = 'start' | 'host' | 'waiting' | 'join';

let currentScreen = ref<Screen>('start')

let waiting = ref<boolean>(false);
let roomId = ref<string>();


let hostId = computed(() => multiplayerStore.getRoomId);

watch(hostId, (current) => roomId.value = current);

let roomNotFound = computed<boolean>(() => multiplayerStore.isRoomNotFound)

watch(roomNotFound, (current) => {

    if (current) {
        waiting.value = false;
        multiplayerStore.resetRoomId()
    }
})


const joinGame = () => {
    multiplayerStore.resetRoomNotFound();
    waiting.value = true;
    emit('start-game', 60, true, false, roomId.value);
}

const initGame = (time: number) => {
    waiting.value = true;
    emit('start-game', time, true, true, roomId.value);
}


const copyToClipboard = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(`${roomId.value}`);
        return;
    }

    let textArea = document.createElement('textarea');
    textArea.value = `${roomId.value}`;

    textArea.style.position = 'absolute';
    textArea.style.zIndex = '-100';
    textArea.style.top = '0';
    textArea.style.left = '0';
    document.body.append(textArea);
    textArea.focus();
    textArea.select();

    //no other options :((((
    document.execCommand('copy');
    textArea.remove()
}

</script>
<template>
    <div class="private-game-wrapper">

        <menuTransitionComponent>
            <template v-if="!waiting">

                <template v-if="currentScreen === 'start'">
                    <ul class="play-type-buttons">
                        <li>
                            <button class="classic-button menu-button" @click="currentScreen = 'host'">{{
                                textStrings.createRoom
                            }}</button>
                        </li>
                        <li>
                            <button class="classic-button menu-button" @click="currentScreen = 'join'">{{
                                textStrings.joinRoom
                            }}</button>
                        </li>
                    </ul>
                </template>

                <template v-else>
                    <MultiplayerStartButtons v-if="currentScreen === 'host'" @send-time="initGame" />
                    <template v-else>
                        <div class="join-wrapper">
                            <div class="user-input">
                                <input type="text" v-model="roomId" class="room-id" :placeholder="textStrings.roomId"
                                    minlength="1" maxlength="25" @keypress.enter.prevent="joinGame">

                                <button @click="joinGame" class="classic-button">{{ textStrings.confirm }}</button>
                            </div>
                            <div v-if="roomNotFound" class="room-not-found">{{ textStrings.roomNotFound }}</div>
                        </div>
                    </template>

                </template>


            </template>
            <template v-else>
                <div class="waiting-wrapper">
                    <SearchingCompVue :text="textStrings.waiting" />

                    <div class="room-id-wrapper">
                        <span>{{ textStrings.roomId }}:</span>
                        <div class="id-wrapper">
                            <span v-if="roomId">{{ roomId }}</span>
                            <div :data-hint-msg="textStrings.copied" class="img-wrapper">
                                <img @click="copyToClipboard" src="@/assets/copy.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </menuTransitionComponent>

    </div>
</template>
<style lang="scss" scoped>
.private-game-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.hint-style {

    &::after,
    &::before {
        opacity: 100%;
    }
}

.join-wrapper {
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;

    .user-input {
        display: flex;
        gap: 2rem;
        align-items: center;
    }

    .room-not-found {
        font-size: 2rem;
        font-weight: 500;
    }

    .room-id {
        padding: 1rem;
        border-radius: 12px;

        &:focus {
            &::placeholder {
                opacity: 40%;
            }
        }
    }

    button {
        height: 100%;
    }
}

.waiting-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
    gap: 5rem;
    position: relative;
}



.room-id-wrapper {
    display: flex;
    font-size: 2rem;
    gap: 2rem;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    .id-wrapper {
        position: relative;

        .img-wrapper {
            width: 2rem;
            height: 2rem;
            cursor: pointer;
            position: absolute;
            top: -1.5rem;
            right: -2.5rem;
            display: block;

            img {
                width: 100%;
                height: 100%;
            }

            &:hover {
                transform: scale(1.2);

                &::after,
                &::before {
                    opacity: 0%;
                }

            }

            &:active {
                transform: scale(1);
            }
        }
    }

}
</style>