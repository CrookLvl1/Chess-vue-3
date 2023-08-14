<script lang="ts" setup>
import { Player } from '@/class/player';
import { useAppSettings } from '@/stores/appSettings';
import { useImagePaths } from '@/stores/paths';
import { computed, type PropType } from 'vue';
const textStrings = computed(() => useAppSettings().getStrings);


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
    return props.playerObj.getImgSrc() || useImagePaths().guestImgHref
})

let playerName = computed<string>(() => {
    return props.playerObj.getName() || textStrings.value.guest;
})




let time = computed<number>(() => {
    const propTime = props.playerObj.getTime();
    if (propTime <= 0) {
        props.playerObj.stop();
        emit('gameOver', textStrings.value.timeLose, playerColor)
        return 0;
    }

    return Math.ceil(propTime);


});

let playerColor = props.playerObj.getColor()
const soloPlay = computed(() => props.solo)

console.log('playing solo = ', soloPlay.value);

</script>

<template>
    <div class="player-wrapper">
        <div class="avatar">
            <img :src="playerImgHref" alt="" :style="`border-color: ${playerObj.getImgBorder()}`">
            {{ playerName }} <span v-if="you">{{ `(${textStrings.you})` }}</span>
        </div>

        <div class="player-buttons">
            <template v-if="you">
                <button class="classic-button classic-button-small"
                    @click="emit('gameOver', textStrings[`${playerObj.getColor()}Surrendered`], playerColor, true)">{{
                        textStrings.surrender }}</button>
            </template>
            <template v-else>
                <button class="classic-button classic-button-small" @click="emit('rotate')">
                    <span>{{ textStrings.rotate }}</span>
                </button>
                <button v-if="!soloPlay" class="classic-button classic-button-small chat-button">
                    {{ textStrings.chat }}
                    <img src="@/assets/chat.png" alt="">
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
.player-wrapper {
    width: 100%;
    position: relative;
    // border: 5px solid #123;
    padding: 0.25rem;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    align-items: center;
    font-size: 2rem;
    height: 5rem;
    gap: 0.5rem;
    padding: 0 1rem 0 0;


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
            height: 95%;
            border: 3px solid black;
            aspect-ratio: 1 / 1;
            border: 0.2rem solid transparent;
        }



    }

    .player-buttons {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
        height: 100%;

        .chat-button {
            height: 100%;
            display: flex;
            width: fit-content;

            img {
                width: 3rem;
                aspect-ratio: 1 / 1;
            }
        }
    }

}

.chat-button img {
    aspect-ratio: 1 / 1;
}
</style>