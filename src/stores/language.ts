import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'
import type { LanguageStrings, LanguageId } from '@/class/chessTypes&Interfaces';



export const useLanguageStrings = defineStore('language', () => {
    let id = ref<LanguageId>('ru');
    const setId = (newId: LanguageId) => id.value = newId;




    const languages = reactive<Record<LanguageId, LanguageStrings>>({
        ru: {
            choose: "Выберите фигуру",
            whiteWin: 'Белые победили',
            blackWin: 'Чёрные победили',
            draw: "Ничья",
            returnButton: 'Вернуться',
            play: 'Играть',
            playSolo: 'Одиночная игра',
            playMultiplayer: 'Мультиплеер',
            surrender: 'Сдаться',
            whiteTurn: 'Ход белых',
            blackTurn: 'Ход чёрных',
        },
        eng: {
            choose: "Choose figure",
            whiteWin: `White won`,
            blackWin: `Black won`,
            draw: 'Draw',
            returnButton: 'Return',
            play: 'Play',
            playSolo: 'Singleplayer',
            playMultiplayer: 'Multiplayer',
            surrender: 'Surrender',
            whiteTurn: `White's turn`,
            blackTurn: `Black's turn`,
        }
    })


    const getStrings = computed<LanguageStrings>(() => {
        return languages[id.value];
    })


    return { id, getStrings, setId }
})