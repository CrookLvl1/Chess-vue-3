<script lang="ts" setup>
import { useAppSettings } from '@/stores/appSettings';
import { type Component, shallowRef, computed, defineAsyncComponent, onMounted } from 'vue';


const AboutComponent = defineAsyncComponent(() => import('@/components/aboutComponent.vue'))
const SettingsComponent = defineAsyncComponent(() => import('@/components/settingsComponent.vue'))
const textStrings = computed(() => useAppSettings().getStrings);

let currentComponent = shallowRef<Component | null>(null);


//prevent init animation
onMounted(() => {
    setTimeout(() =>
        (document.querySelector('.label-open') as HTMLLabelElement)
            .style.setProperty('--duration', '400ms'), 400);
})


</script>
<template>
    <div class="header">
        <input type="checkbox" name="checkbox" id="checkbox">
        <div class="full-window-wrapper"></div>
        <transition v-show="currentComponent" name="component">
            <div class="full-height-wrapper">
                <div class="component-header"><button @click="currentComponent = null"
                        class="icon icon-cancel icon-exit-behavior"></button></div>
                <component @close="currentComponent = null" :is="currentComponent"></component>
            </div>
        </transition>
        <div class="logo">
            <img src="@/assets/knightwhite.png" alt="">
            <img src="@/assets/rookblack.png" alt="">
        </div>
        <label class="label-open" for="checkbox"><span></span></label>
        <ul class="header-menu">
            <li class="header-menu-element"><button @click="currentComponent = SettingsComponent"
                    class="header-menu-button">{{
                        textStrings.settings
                    }}</button></li>
            <li class="header-menu-element"><button @click="currentComponent = AboutComponent" class="header-menu-button">{{
                textStrings.aboutGame }}</button></li>
            <li class="header-menu-element"><router-link target="_blank" to="/aboutme" class="header-menu-button">{{
                textStrings.aboutMe
            }}</router-link></li>
            <li class="header-menu-element"><button class="header-menu-button">{{ textStrings.cosmetic }}</button></li>
            <li class="header-menu-element"><button class="header-menu-button">{{ textStrings.cosmetic }}</button></li>
            <li class="header-menu-element"><button class="header-menu-button">{{ textStrings.cosmetic }}</button></li>
            <li class="header-menu-element header-menu-element-for-label"> <label class="header-menu-button label-close"
                    for="checkbox">{{
                        textStrings.close
                    }}</label></li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.component-header {
    display: flex;
    justify-content: flex-end;
}


.component-enter-from {
    opacity: 0%;
    transform: translateY(-100%);
}

.component-enter-to {
    opacity: 100%;
    transform: translateY(0%);
}

.component-enter-active {
    transition: all 700ms ease-out;
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

.full-window-wrapper {
    width: 100%;
    height: 100dvh;
    left: 0;
    top: 0;
    position: absolute;
    z-index: 100;
    opacity: 0%;
    transition: all 300ms ease-in;
    background-color: rgba(0, 0, 0, .5);
    visibility: hidden;
}

.header {
    border-radius: 4px;
    display: flex;
    position: relative;

    background-color: yellowgreen;
    background: linear-gradient(45deg, rgb(156, 173, 64), rgb(244, 173, 81));
    gap: 1rem;

    .logo {
        position: relative;
        width: 48px;
        height: 48px;

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

    .header-menu {
        width: 100%;
        display: flex;
        flex: 1 1;
        // height: 100%;

        &-element {
            user-select: none;
            display: block;
            flex: 1 1;

            //label for burger-menu 
            &:last-child {
                display: none;
            }
        }

        &-button {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            width: 100%;
            height: 100%;
            background-color: transparent;

            font-size: 1.25rem;
            transition-duration: 150ms;
            transition-timing-function: ease-out;
            transition-property: box-shadow;
            transition-property: background-color;


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

@keyframes top {
    50% {
        translate: 0 150%;
        rotate: 0deg;
    }

    100% {
        rotate: 45deg;
        width: 70%;
        translate: -10% 325%;
    }
}

@keyframes center {
    50% {
        translate: 0 150%;
    }

    100% {
        translate: 0 150%;
    }
}

@keyframes bottom {
    50% {
        translate: 0 150%;
        rotate: 0deg;
        width: 100%;
    }

    100% {
        width: 70%;
        translate: 50% 325%;
        rotate: -45deg;
    }
}

@keyframes top-init {
    0% {
        rotate: 45deg;
        width: 70%;
        translate: -10% 325%;
    }

    50% {
        rotate: 0deg;
        width: 100%;
        translate: 0 150%;
    }

    100% {
        translate: 0 100%;
    }
}

@keyframes center-init {
    0% {
        translate: 0 150%;
    }

    50% {
        translate: 0 150%;
    }

    100% {
        translate: 0 300%;
    }

}

@keyframes bottom-init {
    0% {
        translate: 50% 350%;
        width: 70%;
        rotate: -45deg;
    }

    50% {
        rotate: 0deg;
        width: 100%;
        translate: 0 150%;
    }

    100% {
        translate: 0 500%;
    }
}

.label-open {
    display: none;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    transition: all 250ms ease-out;


    &::after,
    &::before,
    >span {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 7px;
        background-color: rgba(88, 83, 83, 1);
        border-radius: 12px;
        transition: all 250ms ease-out;
        animation-timing-function: ease-in-out;
        animation-duration: var(--duration, '0ms');
        animation-fill-mode: both;
    }

    &::before {
        animation-name: top-init;
        translate: 0 100%;
    }

    >span {
        translate: 0 300%;
        animation-name: center-init;
    }

    &::after {
        translate: 0 500%;
        animation-name: bottom-init;
    }

    &:hover {
        &::before {
            animation-name: top;
        }

        >span {
            animation-name: center;
        }

        &::after {
            animation-name: bottom;
        }
    }

}


#checkbox {
    display: none;
}

@media (max-width: 1023.75px) {
    .label-open {
        display: block;
    }

    .header {
        justify-content: space-between;
        padding: 0 1.5rem;
        align-items: center;


        .header-menu {
            transform: translateY(-100%);
            flex-direction: column;
            position: absolute;
            visibility: hidden;
            top: 0;
            right: 0;
            width: 40rem;
            z-index: 100;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            transition: all 400ms ease-out;

            background: linear-gradient(45deg, rgb(156, 173, 64), rgb(244, 173, 81));

            &-element {

                .header-menu-button,
                label {
                    padding: 0.5rem 0;
                    font-size: 1.5rem;
                    line-height: 3.5rem;
                }


                //menu element that contains label
                &:last-child {
                    display: flex;
                    text-align: center;
                }

                .label-close {
                    font-size: 1.5rem;
                }

            }
        }
    }

    #checkbox:checked {
        &~.header-menu {
            transform: translateY(0);
            visibility: visible;
        }

        &~.full-window-wrapper {
            visibility: visible;
            opacity: 100%;
        }
    }

}

@media (max-width: 600px) {
    .header .header-menu {
        width: 100dvw;

        &-element {
            .header-menu-button {
                font-size: 3rem;
            }
        }
    }

}
</style>