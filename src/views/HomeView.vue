<script lang="ts" setup>
import GameWrap from '@/components/gameWrap.vue';

import { reactive, ref, computed } from 'vue';

let component = ref('game');

const currentComp = computed(() => GameWrap)

</script>
<template>
  <div>
    <component :is="currentComp"></component>
  </div>
</template>
<style lang="scss"></style>