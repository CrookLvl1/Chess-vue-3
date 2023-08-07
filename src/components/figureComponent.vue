<script lang="ts" setup>
import { Figure } from '@/class/chess';
import { type PropType, computed, watch} from 'vue';
import { useImagePaths } from '@/stores/paths';

const props = defineProps({
    figure: { type: [Object, null] as PropType<Figure | null>, required: true }
})



const { paths } = useImagePaths();
const href = computed<string>(() => paths.get(props.figure?.getSrc()));

</script>
<template>
    <img v-if="figure" :src="href" alt="">
    <!-- <div>{{ figure?.getSrc() }}</div> -->
</template>
<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
    transition: transform 300ms cubic-bezier(.89, .01, .12, 1.04);

}
</style>