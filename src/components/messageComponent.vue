<script lang="ts" setup>
import { type Message } from '@/class/chessTypes&Interfaces';
import { Player } from '@/class/player';
import { useAppSettings } from '@/stores/appSettings';
import { useImagePaths } from '@/stores/paths';
import { computed, ref, type PropType, reactive } from 'vue';

const textStrings = computed(() => useAppSettings().getStrings);

const props = defineProps({
    player: { type: Player, required: true },
    message: { type: Object as PropType<Message>, required: true }
})

let hint = ref<boolean>(false);

const playerName = computed<string>(() => {
    const name = props.player.getName();
    if (name.length > 10) {
        hint.value = true;
        return name.slice(0, 8) + '...';
    }

    return name;
});

const messageLines = reactive<Array<string>>(props.message.text.split(`\n`));


const time = ((): string => {
    const minutes = props.message.date.getMinutes();
    const hours = props.message.date.getHours();

    return `${hours >= 10 ? hours : '0' + hours}:${minutes >= 10 ? minutes : '0' + minutes}`;
})()


</script>

<template>
    <transition name="message-appearance" appear>
        <div class="message-wrapper">
            <img :style="{ borderColor: player.getImgBorder() }" :src="player.getImgSrc() || useImagePaths().guestImgHref ">
            <div class="text-wrapper">
                <div v-if="!message.currentUserSender && !message.read" class="read"></div>
                <div class="basic-info">
                    <h5 class="player-name" :data-hint-msg="hint ? player.getName() : null">{{ playerName }}</h5>
                    <h5 v-if="message.currentUserSender">{{ message.read ? textStrings.read : textStrings.unread }}</h5>
                    <h5>{{ time }}</h5>
                </div>
                <ul class="text">
                    <template v-for="line, index in messageLines" :key="index">
                        <li class="text-line">
                            {{ line }}
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
[data-hint-msg] {
    &::after, &::before {
        top: -10%;
        left: -50%;        
    }
}

.message-appearance-enter-from, .message-appearance-leave-to, .message-appearance-appear-from {
    opacity: 0%;
    box-shadow: 0 0 0 0 black;
    transform: translateX(-50%);
}

.message-appearance-enter-to, .message-appearance-leave-from, .message-appearance-appear-to {
    opacity: 100%;
    box-shadow: 0 0 0.75rem 1px black;
    transform: translateX(0%);
}
.message-appearance-enter-active, .message-appearance-leave-active, .message-appearance-appear-active {
    transition: all 300ms ease-out;
}


.message-wrapper {
    // border-bottom: 1px solid black;
    width: 100%;
    box-sizing: border-box;
    padding: 0.25rem;
    display: flex;
    font-size: 1.25rem;
    flex: 1 1;
    gap: 0.5rem;
    position: relative;
    box-shadow: 0 0 0.75rem 1px black;


    img {
        width: 4.5rem;
        height: 4.5rem;
        border-radius: 50%;
        box-sizing: border-box;
        border: 0.2rem solid transparent;
    }

    .text-wrapper {
        position: relative;

        .read {
            display: block;
            position: absolute;
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 50%;
            background-color: rgba(148, 159, 169, .7);
            right: 1rem;
            top: 40%;
        }

        width: 100%;
        max-width: 24rem;
        padding-right: 2rem;

        .basic-info {
            display: flex;
            justify-content: space-between;
            width: 100%;

            h5.player-name {
                position: relative;
            }

            h5 {
                box-sizing: border-box;
                font-size: 1.25rem;
                border-bottom: 0.15rem solid black;
                width: fit-content;
                display: block;
            }


        }

        .text {
            display: block;
            padding: 0.5rem 0 0 0.75rem;
            padding-right: 2rem;
            box-sizing: border-box;

            &-line {
                display: block;
                overflow-wrap: break-word;
            }
        }
    }
}
</style>