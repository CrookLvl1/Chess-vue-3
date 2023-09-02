<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useAppSettings } from '@/stores/appSettings';
import type { LanguageId } from '@/class/chessTypes&Interfaces';
import { useAudioPaths, useImagePaths } from '@/stores/paths';
const emit = defineEmits(['close'])

const appStore = computed(() => useAppSettings());
const textStrings = computed(() => (appStore.value.getStrings));

const audio = new Audio(useAudioPaths().getPaths[0]);
audio.preload = 'auto';

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

const editName = () => {
    (async () => {
        showCurrentName.value = false;
        console.log(editNameInput.value);
    })().then(() => editNameInput.value?.focus())
}


const apply = () => {
    appStore.value.setLangId(currentLangId.value);
    appStore.value.setVolume(currentVolume.value);

    appStore.value.setUserImg(new URL(currentPlayerImg.value).href);
    appStore.value.setUserName(currentPlayerName.value);
    appStore.value.setBorder(currentBorder.value);

    appStore.value.saveToLocal();
}
let showCurrentName = ref<boolean>(true);

const focusOut = (ev: FocusEvent) => {
    const inputElement = ev.target as HTMLInputElement;
    const value = +inputElement.value as number;
    if (!value) currentVolume.value = 0.25;
    if (value < 0) currentVolume.value = 0;
    else if (value > 1) currentVolume.value = 1;
}

const editNameInput = ref<HTMLInputElement>();




</script>
<template>
    <div class="settings-wrapper">
        <ul class="settings">
            <li class="setting setting-avatar">
                <!-- <h5 class="setting-title">{{ textStrings.yourAvatar }}:</h5> -->
                <div class="preview" :style="`border-color:${currentBorder}`">
                    <input name="file" type="file" id="file" @change="fileInputHandler"
                        accept="image/png, image/jpeg, image/gif">
                    <label for="file">
                        <img class="preview-img" alt="" :src="currentPlayerImg">
                        <div class="edit-img-wrapper">
                            <img class="edit-img" src="@/assets/edit.png" alt="">
                        </div>
                    </label>
                </div>
                <span class="preview-img-hint">{{ textStrings.warnImgSize }}</span>
            </li>
            <li class="setting">
                <div class="current-name-wrapper" v-show="showCurrentName">
                    <div class="current-name">{{ currentPlayerName }}</div>
                    <img src="@/assets/edit.png" alt="" class="edit-name-img" @click="editName">
                </div>

                <div class="current-name-wrapper" v-show="!showCurrentName">
                    <input ref="editNameInput" @keypress.enter.prevent="showCurrentName = true" v-show="!showCurrentName"
                        class="edit-name-input" maxlength="25" :placeholder="textStrings.yourName" type="text"
                        name="playerName" v-model="currentPlayerName" id="playerName">
                    <button class="icon icon-apply setting-icon-apply" @click="showCurrentName = true"></button>
                </div>

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
                <h5 class="setting-title">{{ textStrings.language }}:</h5>
                <select v-model="currentLangId" name="language" id="language">
                    <option v-for="langId in appStore.getIds" :selected="langId === currentLangId" :value="langId"
                        :key="langId">{{ langId }}</option>
                </select>
            </li>
            <li class="setting">
                <h5 class="setting-title">{{ textStrings.volume }}:</h5>
                <div class="volume-input-wrapper">
                    <input @focusout="focusOut" inputmode="numeric" min="0" max="1" class="current-volume" step="0.01"
                        v-model="currentVolume">
                    <input v-model="currentVolume" min="0" max="1" step="0.01" type="range" name="volume" id="volume">
                </div>
                <button @click="playAudio" class="classic-button classic-button-small test-button">
                    <span>{{ textStrings.test }}</span>
                    <div class="icon icon-play"></div>
                </button>
            </li>
        </ul>


        <div class="exit-buttons">
            <button class="classic-button exit-button close" @click="emit('close')">
                <span>{{ textStrings.close }}</span>
                <div class="icon icon-cancel"></div>
            </button>
            <button class="classic-button exit-button apply" @click="apply">
                <span> {{ textStrings.apply }}</span>
                <div class="icon icon-apply"></div>
            </button>
        </div>
    </div>
</template>


<style lang="scss" scoped>
input,
select {
    font-size: 1.5rem;
    font-family: serif;
    box-sizing: border-box;

    &:focus {
        outline: none;
        box-shadow: 0 0 2.5px 1px black;
    }
}

.borders {
    display: flex;
    gap: 0.5rem;

    &-color {
        width: 2.5rem;
        height: 2.5rem;
        cursor: pointer;
        transition: all 200ms ease-out;

        &:hover {
            opacity: 80%;
            transform: scale(1.1);
            box-shadow: 0 0 10px 0 black;
        }

        &:active {
            opacity: 50%;
            transform: scale(0.9);
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
            box-shadow: none;
        }
    }

}


.preview {
    position: relative;
    width: 7rem;
    height: 7rem;
    border-radius: 12px;
    border: 0.25rem solid transparent;
    overflow: hidden;

    &-img-hint {
        font-size: 1.25rem;
        display: block;
        opacity: 0%;
        visibility: hidden;
        transition: opacity 300ms ease-in;
    }

    &:hover {
        .edit-img-wrapper {
            opacity: 100%;
        }
    }

    &:hover+.preview-img-hint {
        opacity: 100%;
        visibility: visible;
    }

    input[type=file] {
        display: none;
    }


    .edit-img-wrapper {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.35);
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0%;
        transition: opacity 150ms ease-out;
    }

    img {
        user-select: none;
        pointer-events: none;

        &.preview-img {
            width: 100%;
            height: 100%;
        }

        &.edit-img {
            position: absolute;
            width: 50%;
            height: 50%;
            top: 25%;
            right: 25%;
        }
    }
}

.current-name-wrapper {
    height: 3rem;
    gap: 1rem;
    display: flex;
    align-items: center;

    .edit-name-input {
        padding: 0.25rem 1rem;
        border: none;
        background-color: transparent;
        width: 100%;

        &:focus {
            box-shadow: 0 0 0.5rem 0 black;
        }

    }

    .current-name {
        font-size: 1.5rem;

    }

    .edit-name-img {
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        transition: all 150ms ease-out;

        &:hover {
            transform: scale(1.35);
        }
    }

}

.exit-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;

    .exit-button {
        font-size: 1.5rem;

        display: flex;
        flex: 1 1 fit-content;
        max-width: 20rem;
        gap: 1rem;
        justify-content: center;
        transition-duration: 300ms;


        &:active {
            transform: scale(0.9);
        }

        &.apply {
            &:hover {
                box-shadow:
                    inset 10rem 0 0 0 lightblue,
                    inset -10rem 0 0 0 lightblue
            }
        }

        &.close {
            &:hover {
                box-shadow: 
                    inset 10rem 0 0 0 lightcoral,
                    inset -10rem 0 0 0 lightcoral
                ;
            }
        }
    }
}

.settings-wrapper {
    // height: 100%;
    flex: 1 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;

    .settings {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .setting {
            display: flex;
            gap: 1.5rem;
            align-items: center;
            flex-wrap: wrap;
            padding-left: 0.5rem;

            &-avatar {
                align-items: flex-start;
            }

            &-icon-apply {
                width: 2rem;
                height: 2rem;
                overflow: visible;
                cursor: pointer;
                transition: all 150ms ease-out;

                &:hover {
                    transform: scale(1.5);

                }
            }

            h5.setting-title {
                font-size: 1.5rem;
            }

        }
    }
}
</style>