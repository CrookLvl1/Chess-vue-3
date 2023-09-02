<script lang="ts" setup>
const props = defineProps({
    text: { type: String, required: true }
})

</script>
<template>
        <transition name="appear-from-right">
            <div class="searching-wrapper">
                <div class="text">{{ text }}</div>
                <div class="animation">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
            </div>
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