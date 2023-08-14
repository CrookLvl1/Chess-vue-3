<script lang="ts" setup>
import { Figure } from '@/class/chess';
import { type PropType, computed, watch } from 'vue';
import { useImagePaths } from '@/stores/paths';

const props = defineProps({
    figure: { type: [Object, null] as PropType<Figure | null>, required: true }
})



const { paths } = useImagePaths();
const href = computed<string>(() => paths.get(props.figure?.getSrc()));

</script>
<template>
    <div class="figure-wrapper">
        <img v-if="figure" :src="href" alt="">
    </div>
    <!-- <div>{{ figure?.getSrc() }}</div> -->
</template>
<style lang="scss" scoped>
.figure-wrapper {
    width: 100%;
    height: 100%;
}
img {
    width: 100%;
    height: 100%;

}
</style>