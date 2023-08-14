<script lang="ts" setup>
import { useAppSettings } from '@/stores/appSettings';
import { type Component, shallowRef, computed } from 'vue';
import AboutComponent from './aboutComponent.vue';
import AboutMeComponent from './aboutMeComponent.vue';
import SettingsComponent from './settingsComponent.vue';

const textStrings = computed(() => useAppSettings().getStrings);


const components: { [key: string]: Component } = {
    'settings': SettingsComponent,
    'aboutGame': AboutComponent,
    'aboutMe': AboutMeComponent,

}

let currentComponent = shallowRef<Component | null>(null);
const setComponent = (componentId: string) => {
    currentComponent.value = components[componentId];
}
setComponent('settings')
</script>
<template>
    <div class="header">
        <transition v-show="currentComponent" name="component">
            <component class="full-height-wrapper" :is="currentComponent" @close="currentComponent = null"></component>
        </transition>
        <div class="logo">
            <img src="@/assets/knightwhite.png" alt="">
            <img src="@/assets/rookblack.png" alt="">
        </div>
        <ul class="menu">
            <li class="menu-element"><button @click="setComponent('settings')" class="menu-button">{{ textStrings.settings
            }}</button></li>
            <li class="menu-element"><button @click="setComponent('aboutGame')" class="menu-button">{{
                textStrings.aboutGame }}</button></li>
            <li class="menu-element"><button @click="setComponent('aboutMe')" class="menu-button">{{ textStrings.aboutMe
            }}</button></li>
            <li class="menu-element"><button class="menu-button">{{ textStrings.cosmetic }}</button></li>
            <li class="menu-element"><button class="menu-button">{{ textStrings.cosmetic }}</button></li>
            <li class="menu-element"><button class="menu-button">{{ textStrings.cosmetic }}</button></li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.component-enter-from {
    opacity: 0%;
    transform: translateY(-100%);
}

.component-enter-to {
    opacity: 100%;
    transform: translateY(0%);
}

.component-enter-active {
    transition: all 1s ease-out;
}

.component-leave-from {
    opacity: 100%;
    transform: translateX(0%);
}

.component-leave-to {
    opacity: 0%;
    transform: translateX(-50%);
}

.component-leave-active {
    transition: all 400ms ease-in;
}

.header {
    border-radius: 4px;
    display: flex;
    position: relative;
    background: linear-gradient(45deg, rgb(156, 173, 64), rgb(244, 173, 81));
    gap: 1rem;

    .logo {
        position: relative;
        width: 50px;
        height: 50px;

        img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            aspect-ratio: 1 / 1;

            &:nth-child(1) {
                transform: rotate(-20deg);
            }

            &:nth-child(2) {
                left: 15px;

                transform: rotate(20deg);
            }

        }
    }

    .menu {
        width: 100%;
        display: flex;
        flex: 1 1;

        &-element {
            display: block;
            flex: 1 1;
        }

        &-button {
            cursor: pointer;
            width: 100%;
            height: 100%;

            background-color: transparent;

            font-size: 1.25rem;
            transition-duration: 150ms;
            transition-timing-function: ease-out;
            transition-property: box-shadow;
            transition-property: background-color;

            @media (max-width: 672px) {}

            &:hover {
                background-color: rgb(138, 189, 241);
                box-shadow: 0 0 10px 0 rgba(138, 189, 241, .5);
            }

            &:active {
                background-color: rgb(174, 209, 244);

            }
        }
    }
}
</style>