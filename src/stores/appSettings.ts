import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'
import type { LanguageStrings, LanguageId, Settings, User } from '@/class/chessTypes&Interfaces';



export const useAppSettings = defineStore('app-settings', () => {

    const languages = reactive<Record<LanguageId, LanguageStrings>>({
        ru: {
            choose: 'Выберите фигуру',
            whiteWin: 'Белые победили',
            blackWin: 'Чёрные победили',
            checkmate: 'Шах и мат',
            draw: "Ничья",
            returnButton: 'Вернуться',
            play: 'Играть',
            playSolo: 'Одиночная игра',
            playMultiplayer: 'Мультиплеер',
            surrender: 'Сдаться',
            whiteSurrendered: 'Белые сдались',
            blackSurrendered: 'Чёрные сдались',
            enemyLeft: 'Оппонент покинул игру',
            timeLose: 'Победа по времени',
            profile: 'Профиль',
            chat: 'Открыть чат',
            language: 'Язык',
            volume: 'Громкость',
            test: 'Проверить',
            copyright: 'Все права защищены',
            guest: 'Гость',
            you: 'Вы',
            yourName: 'Ваше имя',
            enterName: 'Введите ваше имя',
            yourAvatar: 'Ваш аватар',
            yourBorder: 'Рамка аватара',
            warnImgSize: 'Картинка должа весить меньше 4096 кб',
            ok: 'Ок',

            whiteTurn: 'Ход белых',
            blackTurn: 'Ход чёрных',
            settings: 'Настройки',
            searching: 'Поиск игры',
            aboutGame: 'Об игре',
            aboutMe: 'Обо мне',
            rotate: 'Повернуть',
            cosmetic: 'Просто кнопка',
            close: 'Закрыть',
            apply: 'Применить',
        },
        eng: {
            choose: 'Choose figure',
            whiteWin: `White won`,
            blackWin: `Black won`,
            checkmate: 'Checkmate',
            draw: 'Draw',
            returnButton: 'Return',
            play: 'Play',
            playSolo: 'Singleplayer',
            playMultiplayer: 'Multiplayer',
            surrender: 'Surrender',
            whiteSurrendered: 'White surrendered',
            blackSurrendered: 'Black surrendered',
            enemyLeft: 'Enemy left the game',
            timeLose: 'Enemy run out of time',
            profile: 'Profile',
            chat: 'Open chat',
            language: 'Language',
            volume: 'Volume',
            test: 'Test',
            copyright: 'All rights reserved',
            guest: 'Guest',
            you: 'You',
            yourName: 'Your name',
            enterName: 'Enter your name',
            yourAvatar: 'Your avatar',
            yourBorder: `Avatar's border`,
            warnImgSize: 'The image should be less than 4096 kb',
            ok: 'Ok',


            whiteTurn: `White's turn`,
            blackTurn: `Black's turn`,
            settings: 'Settings',
            searching: 'Searching for game',
            aboutGame: 'About game',
            aboutMe: 'About me',
            rotate: 'Rotate',
            cosmetic: 'Just a button',
            close: 'Close',
            apply: 'Apply',
        }
    })

    //app settings
    let langId = ref<LanguageId>('eng');
    let volume = ref<number>(0.25);
    let user = reactive<User>({name: 'Guest', 'imgSrc': '', borderColor: 'black'})

    const saved = localStorage.getItem('settings');
    if (saved) {
        const settings = JSON.parse(saved) as Settings;
        langId.value = settings.langId;
        volume.value = settings.volume;
        user.borderColor = settings.user.borderColor;
        user.name = settings.user.name;
        user.imgSrc = settings.user.imgSrc;
    }

    const saveToLocal = () => {
        localStorage.setItem('settings', JSON.stringify({
            volume: volume.value,
            langId: langId.value,
            user: user
        }))
    }



    const setLangId = (newId: LanguageId) => langId.value = newId;
    const setVolume = (value: number) => volume.value = value;
    
    
    const getStrings = computed<LanguageStrings>(() => {
        return languages[langId.value];
    })
    
    const getVolume = computed<number>(() => volume.value);
    const getLangId = computed<LanguageId>(() => langId.value);
    const getUser = computed(() => user);
    
    const getIds = computed(() => Object.keys(languages));
    
    const setBorder = (value: string) => user.borderColor = value;
    const setUserImg = (value: string) => user.imgSrc = value;
    const setUserName = (value: string) => user.name = value;

    return { getStrings, getLangId, setLangId, getIds, saveToLocal, getVolume, setVolume, getUser, setUserImg, setUserName, setBorder }
})