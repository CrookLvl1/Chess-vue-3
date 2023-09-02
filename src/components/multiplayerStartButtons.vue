<script lang="ts" setup>
const emit = defineEmits({
    sendTime: (time: number) => true
});

</script>
<template>
    <ul class="buttons-wrapper">
        <li>
            <ul class="buttons-row">
                <li><button class="classic-button" @click="emit('sendTime', 60)">1</button></li>
                <li><button class="classic-button" @click="emit('sendTime', 120)">2</button></li>
                <li><button class="classic-button" @click="emit('sendTime', 180)">3</button></li>
            </ul>
        </li>
        <li>
            <ul class="buttons-row">
                <li><button class="classic-button" @click="emit('sendTime', 300)">5</button></li>
                <li><button class="classic-button" @click="emit('sendTime', 600)">10</button></li>
                <li><button class="classic-button" @click="emit('sendTime', 1200)">20</button></li>
            </ul>
        </li>
        <li>
            <ul class="buttons-row">
                <li><button class="classic-button" @click="emit('sendTime', 3600)">60</button></li>
                <li><button class="classic-button" @click="emit('sendTime', 7200)">120</button></li>
                <li><button class="classic-button" @click="emit('sendTime', 10800)">180</button></li>
            </ul>
        </li>
    </ul>
</template>
<style lang="scss" scoped>
.buttons-wrapper {
    width: 100%;
    gap: 3rem;
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
    box-sizing: border-box;

    .buttons-row {
        display: flex;
        width: 100%;
        gap: 1.5rem;

        li {
            position: relative;
            flex: 1 1;
            border-radius: 12px;

            button {
                width: 100%;
            }
        }
    }


}
</style>