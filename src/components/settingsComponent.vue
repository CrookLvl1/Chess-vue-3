<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useAppSettings } from '@/stores/appSettings';
import type { LanguageId } from '@/class/chessTypes&Interfaces';
import { useAudioPaths, useImagePaths } from '@/stores/paths';
const emit = defineEmits(['close'])

const appStore = computed(() => useAppSettings());

const textStrings = computed(() => (appStore.value.getStrings));

const audio = new Audio(useAudioPaths().getPaths[0]);

const playAudio = () => {
    audio.volume = currentVolume.value;
    audio.play();
}

let user = computed(() => appStore.value.getUser);

let currentLangId = ref<LanguageId>(appStore.value.getLangId);
let currentVolume = ref<number>(appStore.value.getVolume);

let currentPlayerName = ref<string>(user.value.name);
let currentPlayerImg = ref<string>(user.value.imgSrc || useImagePaths().guestImgHref);
let currentBorder = ref<string>(user.value.borderColor);

const fileInputHandler = (inputEvent: Event) => {
    const file: File = ((inputEvent.target as HTMLInputElement).files as FileList)[0];
    if (Math.round(file.size / 1024) > 4096) return;

    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onloadend = (ev: ProgressEvent) => {
        const href = (ev.target as FileReader).result as string;
        currentPlayerImg.value = href;
    }

};

const apply = () => {
    appStore.value.setLangId(currentLangId.value);
    appStore.value.setVolume(currentVolume.value);

    appStore.value.setUserImg(new URL(currentPlayerImg.value).href);
    appStore.value.setUserName(currentPlayerName.value);
    appStore.value.setBorder(currentBorder.value);

    appStore.value.saveToLocal();
}

console.log(currentBorder.value)
console.log(user.value)
</script>
<template>
    <div class="settings-wrapper">
        <ul class="settings">
            <li class="setting">
                <h5 class="setting-title">{{ textStrings.yourAvatar }}:</h5>
                <img :style="`border-color:${currentBorder}`" :src="currentPlayerImg" alt="" class="preview">
                <input size="" type="file" name="" id="" @change="fileInputHandler"
                    accept="image/png, image/jpeg, image/gif">
                <span>{{ textStrings.warnImgSize }}</span>                
            </li>
            <li class="setting">
                <h5 class="setting-title">{{ textStrings.yourBorder }}:</h5>
                <ul class="borders">
                    <li @click="currentBorder = 'black'" style="background-color: black;" class="borders-color"></li>
                    <li @click="currentBorder = 'red'" style="background-color: red;" class="borders-color"></li>
                    <li @click="currentBorder = 'green'" style="background-color: green;" class="borders-color"></li>
                    <li @click="currentBorder = 'orange'" style="background-color: orange;" class="borders-color"></li>
                    <li @click="currentBorder = 'blue'" style="background-color: blue;" class="borders-color"></li>
                </ul>
            </li>
            <li class="setting">
                <h5 class="setting-title">{{ textStrings.enterName }}:</h5>
                <input :placeholder="textStrings.yourName" type="text" name="playerName" v-model="currentPlayerName" id="">
            </li>
            <li class="setting">
                <h5 class="setting-title">{{ textStrings.language }}:</h5>
                <select v-model="currentLangId" name="language" id="language">
                    <option v-for="langId in appStore.getIds" :selected="langId === currentLangId" :value="langId"
                        :key="langId">{{ langId }}</option>
                </select>
            </li>
            <li class="setting">
                <h5 class="setting-title">{{ textStrings.volume }}:</h5>
                <div class="volume-input-wrapper">
                    <input inputmode="numeric" min="0" max="1" class="current-volume" step="0.01" :value="currentVolume">
                    <input v-model="currentVolume" min="0" max="1" step="0.01" type="range" name="volume" id="volume">
                </div>
                <button @click="playAudio" class="classic-button classic-button-small test-button">
                    <span>{{ textStrings.test }}</span>
                    <div class="icon icon-play"></div>
                </button>
            </li>
        </ul>


        <div class="exit-buttons">
            <button class="classic-button exit-button" @click="emit('close')">
                <span>{{ textStrings.close }}</span>
                <div class="icon icon-cancel"></div>
            </button>
            <button class="classic-button exit-button apply-button" @click="apply">
                <span> {{ textStrings.apply }}</span>
                <div class="icon icon-apply"></div>
            </button>
        </div>
    </div>
</template>


<style lang="scss" scoped>
input {
    font-size: 1.5rem;
    font-family: serif;
}
.borders {
    display: flex;
    gap: 0.5rem;

    &-color {
        width: 2rem;
        height: 2rem;
        cursor: pointer;

        &:hover {
            opacity: 80%;
        }

        &:active {
            opacity: 50%;
        }
    }
}

.test-button {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0.5rem 1rem;
}

.volume-input-wrapper {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0;

    input {
        text-align: center;
        background-color: transparent;
        width: fit-content;
        border: none;

        &:focus {
            outline: none;
        }
    }

}

img.preview {
    width: 7rem;
    height: 7rem;
    border-radius: 12px;
    border: 0.25rem solid transparent;
}

.exit-buttons {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.settings-wrapper {

    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    
    .settings {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        
        .setting {
            flex-wrap: wrap;
            display: flex;
            gap: 1.5rem;
            align-items: center;

            h5.setting-title {
                font-size: 1.5rem;
            }
        }
    }
}
</style>