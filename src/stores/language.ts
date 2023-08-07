import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'
import { useAppInfo } from './appInfo';
import type { LanguageStrings, LanguageId } from '@/class/chessTypes&Interfaces';



export const useLanguageStrings = defineStore('language', () => {
    let id = computed(() => useAppInfo().getLangId);



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
            searching: 'Поиск игры'
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
            searching: 'Searching for game'
        }
    })


    const getStrings = computed<LanguageStrings>(() => {
        return languages[id.value];
    })


    return { id, getStrings }
})