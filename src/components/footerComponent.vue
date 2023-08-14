<script lang="ts" setup>
import { useAppSettings } from '@/stores/appSettings';


</script>
<template>
    <div class="footer-text"><span>{{ useAppSettings().getStrings.copyright }}</span> © 2023</div>
</template>

<style lang="scss">
    .footer-text {
        font-size: 1rem;
        text-align: center;
    }
</style>