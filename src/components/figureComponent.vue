<script lang="ts" setup>
import { Figure } from '@/class/chess';
import { type PropType, computed } from 'vue';
import { useImagePaths } from '@/stores/paths';

const props = defineProps({
    figure: { type: [Object, null] as PropType<Figure | null>, required: true }
})



const paths = useImagePaths().paths;

const href = computed<string>(() => paths.get(props.figure?.getSrc()));

</script>
<template>
    <div class="figure-wrapper">
        <div class="main-img-wrapper">
            <img loading="lazy" v-if="figure" :src="href" alt="">
        </div>
        <img loading="lazy" class="stolen" v-if="figure?.getStolenType()"
            :src="paths.get(figure.getStolenType() + figure.getColor() + '.png')" alt="">
    </div>
</template>
<style lang="scss" scoped>
.figure-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    transition: all 300ms cubic-bezier(.89, .01, .12, 1.04);
    display: flex;
    align-items: center;
    justify-content: center
}

.main-img-wrapper {
    width: 84%;
    height: 84%;
    img {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
}


img.stolen {
    position: absolute;
    left: -20%;
    top: -10%;
    width: 55%;
    height: 55%;
}
</style>