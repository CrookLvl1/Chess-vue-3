import type { LanguageId } from "@/class/chessTypes&Interfaces";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAppInfo = defineStore('appInfo', () => {
    const saved = localStorage.getItem('settings');
    console.log(saved); 


    let langId = ref<LanguageId>('eng');
    let volume = ref<number>(0.25);


    const setLangId = (id: LanguageId) => langId.value = id;
    const setVolume = (value: number) => volume.value = value;

    const getVolume = computed<number>(() => volume.value);
    const getLangId = computed<LanguageId>(() => langId.value);
    
    
    const saveToLocal = () => {
        localStorage.setItem('settings', JSON.stringify({
            langId: langId.value,
            volume: volume.value
        }))
    }
    return {
        setLangId,
        getLangId,
        setVolume,
        getVolume,
        saveToLocal
    }
})