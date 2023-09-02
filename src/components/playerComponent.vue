<script lang="ts" setup>
import { Player } from '@/class/player';
import { useAppSettings } from '@/stores/appSettings';
import { useImagePaths } from '@/stores/paths';
import { computed, type PropType, ref } from 'vue';
import MessengerWindowComponentVue from './messengerWindowComponent.vue';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import type { Message } from '@/class/chessTypes&Interfaces';
const textStrings = computed(() => useAppSettings().getStrings);
const multiplayerStore = useMultiplayerStore();

const unreadMessages = computed(() => multiplayerStore.getMessages.filter((msg: Message) => !msg.currentUserSender && !msg.read));

const props = defineProps({
    playerObj: {
        type: Object as PropType<Player>,
        required: true
    },
    you: {
        type: Boolean,
        required: true
    },
    solo: {
        type: Boolean,
        required: true
    }
})
const emit = defineEmits(['gameOver', 'rotate']);
//Поражение игрока данного цвета

let playerImgHref = computed<string>(() => {
    return props.playerObj.getImgSrc() || useImagePaths().guestImgHref;
})

let nameHint = ref<boolean>(false);

let fullPlayerName = computed<string>(() => {
    return props.playerObj.getName() || textStrings.value.guest;
})

let visiblePlayerName = computed<string>(() => {
    if (fullPlayerName.value.length > 8) {
        nameHint.value = true;
        return fullPlayerName.value.slice(0, 6) + '...';
    }

    return fullPlayerName.value;
})




let time = computed<number>(() => {
    const propTime = props.playerObj.getTime();
    if (propTime <= 0) {
        props.playerObj.stop();
        emit('gameOver', textStrings.value.timeLose, playerColor)
        return 0;
    }

    return Math.round(propTime);


});

let playerColor = props.playerObj.getColor()

let showChat = ref<boolean>(false);

const switchShowChat = () => showChat.value = !showChat.value;

const soloPlay = computed(() => props.solo)

</script>

<template>
    <div class="player-wrapper">
        <div class="avatar">
            <img :src="playerImgHref" alt="" :style="`border-color: ${playerObj.getImgBorder()}`">
            <span :data-hint-msg="nameHint ? fullPlayerName : null" class="player-name">{{ visiblePlayerName }}</span> <span
                v-if="you">{{ `(${textStrings.you})` }}</span>
        </div>

        <div class="player-buttons">
            <template v-if="you">
                <button class="classic-button classic-button-small"
                    @click="emit('gameOver', textStrings[`${playerObj.getColor()}Surrendered`], playerColor, true)">
                    <span>{{ textStrings.surrender }}</span>
                    <img class="surrender" src="@/assets/surrender.png" alt="">
                </button>
            </template>
            <template v-else>
                <MessengerWindowComponentVue @close="switchShowChat" v-show="showChat" />
                <button class="classic-button classic-button-small" @click="emit('rotate')">
                    <span>{{ textStrings.rotate }}</span>
                    <img class="rotate" src="@/assets/rotate.png" alt="">
                </button>
                <button @click="switchShowChat" v-if="!soloPlay" class="classic-button classic-button-small chat-button">
                    <span>{{ showChat ? textStrings.closeChat : textStrings.openChat }}</span>
                    <div class="unread-messages">{{ unreadMessages.length > 0 ? unreadMessages.length : '' }}</div>
                    <img class="chat" src="@/assets/chat.png" alt="">
                </button>
            </template>
        </div>
        <div class="timer">
            <span> {{ time < 600 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60) }}: {{ (time % 60 < 10) ? `0${time %
                60}` : time % 60 }} </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(-360deg);
    }
}

@keyframes surrender {
    0% {
        transform: rotate(0deg);
    }

    40% {
        transform: rotate(25deg);
    }

    80% {
        transform: rotate(-25deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

@keyframes chat {
    0% {
        transform: scale(1);
    }

    25% {
        transform: scale(1.25);
    }

    50% {
        transform: scale(1.3)
    }

    75% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }

}

.unread-messages {
    display: block;
    position: absolute;
    color: red;
    right: 0;
    top: 0;
    font-weight: 700;
    font-size: 2rem;
}

.player-wrapper {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    align-items: center;
    font-size: 2.5rem;
    gap: 0.75rem;
    padding-right: 1rem;
    width: 100%;
    margin: 0 auto;


    span {
        display: block;
    }

    .avatar {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.25rem;
        box-sizing: border-box;

        img {
            border-radius: 6px;
            width: 5rem;
            height: 5rem;
            border: 3px solid black;
            border: 0.2rem solid transparent;
        }



    }

    .player-name {
        display: block;
        position: relative;
    }

    .player-buttons {
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 100%;
        flex: 1 1;

        button {
            height: 4rem;
            display: flex;
            gap: 0.5rem;
            transition: all 250ms linear;

            &:hover,
            &:active {
                box-shadow:
                    inset 0 4rem 0 0 rgb(102, 108, 182),
                ;

                img {
                    animation-duration: 700ms;
                    animation-delay: 250ms;
                    &.rotate {
                        animation-name: rotate;
                        animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }

                    &.surrender {
                        animation-name: surrender;
                        animation-timing-function: ease-in-out;
                    }

                    &.chat {
                        animation-name: chat;
                        animation-duration: 350ms;
                        animation-timing-function: ease-in-out;
                        animation-iteration-count: 2;
                    }
                }

            }

            img {
                height: 100%;
                width: 2rem;
                height: 2rem;
            }
        }
    }

}

@media (max-width: 700px) {
    .player-wrapper .player-buttons button {
        span {
            display: none;
        }

        // padding: 0 2rem;
        // box-sizing: border-box;
        // height: 100%;
        justify-content: center;
        align-items: center;
        min-width: 8rem;
        height: 4rem;

        img {
            width: 3.5rem;
            height: 3.5rem;
        }
    }
}
@media (max-width: 600px) {
    .player-wrapper .avatar {
        img {
            width: 6rem;
            height: 6rem;
        }
    }
}
</style>