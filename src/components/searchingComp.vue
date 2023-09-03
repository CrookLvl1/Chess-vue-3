<script lang="ts" setup>
import { useAppSettings } from '@/stores/appSettings';
import { computed } from 'vue';
const textStrings = computed(() => useAppSettings().getStrings);

const props = defineProps({
    text: { type: String, required: true },
    connection: { type: Boolean, required: false, default: true }
})

const reset = () => {
    fetch(`https://api.render.com/deploy/srv-cjq3jc61208c73filrv0?key=mM-T4na_nlo`)
        .catch(() => console.log("RESET"));
};


</script>
<template>
    <transition name="appear-from-right">
        <keep-alive v-if="connection">
            <div class="searching-wrapper">
                <template v-if="connection">
                    <div class="online-wrapper">
                        <button class="classic-button" @click="reset">
                            {{ textStrings.reset }}
                        </button>
                    </div>
                </template>
                <div class="loading">
                    <div class="text">{{ text }}</div>
                    <div class="animation">
                        <div class="circle"></div>
                        <div class="circle"></div>
                        <div class="circle"></div>
                        <div class="circle"></div>
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        </keep-alive>
    </transition>
</template>
<style lang="scss">
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

.searching-wrapper {
    display: flex;
    // width: 100%;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;

    .online-wrapper,
    .loading {
        display: flex;
        gap: 1.5rem;
        width: 100%;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
    .online-wrapper {
        flex-direction: column;
        gap: 1rem;
        span {
            font-size: 2rem;
        }
        margin-bottom: 2rem;
    }
    .animation {
        display: flex;
        gap: 1rem;
    }

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
</style>