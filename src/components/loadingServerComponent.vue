<script lang="ts" setup>
import { useAppSettings } from '@/stores/appSettings';
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { computed } from 'vue';

fetch(`https://api.render.com/deploy/srv-cjq3jc61208c73filrv0?key=mM-T4na_nlo`)
    .catch(() => console.log("RESET"));



const textStrings = computed(() => useAppSettings().getStrings);

const readyState = computed(() => useMultiplayerStore().getReadyState);

let connectionState = computed(() => {
    switch (readyState.value) {
        case 1: { return textStrings.value.serverOnline }
        case 0: { return textStrings.value.serverOffline }
        case 3:
        case 4:
            { return textStrings.value.serverError }
    }
});
</script>
<template>
    <div class="server-connection-wrapper">
        <span>{{ connectionState }}</span>
    </div>
</template>
<style scoped>
span {
    font-size: 2rem;
}
</style>