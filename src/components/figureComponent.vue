<script lang="ts" setup>
import { Figure } from '@/class/chess';
import { onUpdated, type PropType } from 'vue';
import { useImagePaths } from '@/stores/imagePaths';

const props = defineProps({
    figure: { type: [Object, null] as PropType<Figure | null>, required: true }
})



const { paths } = useImagePaths();
const href = paths.get(props.figure?.getSrc());

</script>
<template>
    <img v-if="figure" :src="href" alt="">
    <!-- <div>{{ figure?.getSrc() }}</div> -->
</template>
<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
}
</style>
