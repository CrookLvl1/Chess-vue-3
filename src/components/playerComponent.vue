<script lang="ts" setup>
import { Player } from '@/class/player';
import { useLanguageStrings } from '@/stores/language';
import { computed, type PropType } from 'vue';

const props = defineProps({
    playerObj: {
        type: Object as PropType<Player>,
        required: true
    },
    you: {
        type: Boolean,
        required: false
    }
})
const emit = defineEmits(['timeend', 'rotate']);
//Поражение игрока данного цвета

const textStrings = useLanguageStrings().getStrings;

console.log(props.playerObj)

let time = computed<number>(() => {
    const propTime = props.playerObj.getTime();
    if (propTime <= 0) {
        props.playerObj.stop();
        emit('timeend')
        return 0;
    }
    else return propTime;


});

let name = computed<string>(() => props.playerObj.getName());


if (time.value <= 1) {
    console.log(123);
};


</script>

<template>
    <div class="player-wrapper">
        <div class="avatar">
            <img src="../assets/guest.png" alt="">
            <template v-if="you">
                <span>{{ name }} (You)</span>
                <button class="classic-button classic-button-small" @click="emit('timeend')">{{
                    textStrings.surrender }}</button>
            </template>
            <template v-else>
                <span>{{ name }}</span>
                <button class="classic-button classic-button-small rotate-button" @click="emit('rotate')"><div><img src="../assets/rotate.png" alt=""></div></button>
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
    height: fit-content;
    position: relative;
    border: 5px solid #123;
    box-sizing: border-box;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
        display: block;
        font-size: 2rem;
    }

    .avatar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        

        > img {
            $size: calc(35px + (50 - 35) * ((100vw - 320px) / (1024 - 320)));
            width: $size;
            height: $size;
            max-width: 50px;
            min-height: 35px;
            max-height: 50px;
            min-width: 35px;
            margin-right: 10px;
        }
        .rotate-button {
            width: 65px;
            height: 50px;
            display: flex;
            img {
                width: 100%;
                height: 100%;
            }
        }


    }

    .timer {}
}
</style>