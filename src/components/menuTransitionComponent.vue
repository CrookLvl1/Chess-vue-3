<script lang="ts" setup>
defineProps({
    appear: {
        type: Boolean,
        required: false
    }
})
</script>

<template>
    <transition :appear="appear" name="menu">
        <slot></slot>
    </transition>
</template>

<style lang="scss" scoped>
.menu-enter-from,
.menu-appear-from {
    opacity: 0%;
    transform: translateX(50%);

}

.menu-leave-to {
    opacity: 0%;
    transform: translateX(-50%);
}


.menu-enter-to,
.menu-leave-from,
.menu-appear-to {
    opacity: 100%;
    transform: translateX(0%);
}

.menu-leave-active {
    transition: all 200ms ease-in;
    position: absolute;
}

.menu-enter-active,
.menu-appear-active {
    transition: all 500ms ease-in;
    position: absolute;
}
</style>