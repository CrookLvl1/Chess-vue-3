<script lang="ts" setup>
import { useLanguageStrings } from '@/stores/language';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { useAppInfo } from '@/stores/appInfo';
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

const chose = (time: number) => {
    emit('send', false, time);
    searching.value = true;
    console.log(searching.value)
}
</script>

<template>
    <div class="menu-wrapper">
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
                        <div class="text">{{ textStrings.searching }}...</div>
                        <div class="circle"></div>
                        <div class="circle"></div>
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
@keyframes fadeAnimation {
    0% {
        opacity: 100%;
        transform: translateY(0%);
    }

    25% {
        opacity: 50%;
        transform: translateY(-15%);
    }

    50% {
        opacity: 0%;
        transform: translateY(-30%);
    }

    75% {
        opacity: 50%;
        transform: translateY(-15%);
    }

    100% {
        opacity: 100%;
        transform: translateY(0%);
    }
}

.menu-wrapper {
    padding: 50px 0;
    background-color: rgba(98, 112, 126, 1);

}
.loading {
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;

    .text {
        font-size: 2rem;
    }

    .circle {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: rgb(255, 255, 255);
        transform: translateZ(0);

        @for $i from 2 through 6 {
            &:nth-child(#{$i}) {
                animation: fadeAnimation 1s linear #{150 * $i}ms infinite;
            }
        }

    }
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
</style>@/stores/appInfo