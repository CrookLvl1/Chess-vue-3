import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'
import type { LanguageStrings, LanguageId, Settings, User } from '@/class/chessTypes&Interfaces';



export const useAppSettings = defineStore('app-settings', () => {

    const languages: Record<LanguageId, LanguageStrings> = {
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
            seventyFiveMovesRule: 'Правило 75 ходов',
            threefoldRepeat: 'Троекратное повторение позиции',
            stalemate: 'Пат',
            send: 'Отправить',
            typeAMessage: 'Напишите сообщение',
            createRoom: 'Создать комнату',
            joinRoom: 'Присоединиться к комнате',
            typeRoomCode: 'Введите id комнаты',
            chooseTurn: 'Выберите тип хода',
            gameTitle: 'Шахматы с хищением',
            mainRule: 'За исключением следующих изменений правила такие же, как и в обычных шахматах',
            loading: 'Загрузка',

            profile: 'Профиль',
            openChat: 'Открыть чат',
            closeChat: 'Закрыть чат',
            language: 'Язык',
            volume: 'Громкость',
            test: 'Проверить',
            copyright: 'Все права защищены',
            guest: 'Гость',
            you: 'Вы',
            yourName: 'Ваше имя',
            yourAvatar: 'Ваш аватар',
            yourBorder: 'Рамка аватара',
            warnImgSize: 'Картинка должа весить меньше 4096 кб',
            ok: 'Ок',
            steal: 'Похитить ходы',
            yes: 'Да',
            no: 'Нет',
            stealRefuse: 'Не похищать ходы',
            chatting: 'Чат',
            read: 'Прочитано',
            unread: 'Не прочитано',
            typing: 'Печатает',
            playWithFriend: 'Сыграть с другом',
            fold: 'Свернуть',
            unfold: 'Развернуть',
            waiting: 'Ожидание другого игрока',
            confirm: 'Подтвердить',
            roomId: 'Id комнаты',
            roomNotFound: 'Комната не найдена',
            nextLine: 'Shift + Enter - новая строка',
            copied: 'Скопировано',
            readHint: 'Наведитесь или нажмите на правило, чтобы сделать его больше',
            name: "Масленников Константин",
            job: 'Junior front-end разработчик',
            location: 'Россия',
            contacts: 'Контакты',
            skills: 'Навыки',
            traits: 'Личные качества',
            languages: 'Языки',
            russian: 'Русский',
            english: 'Английский',
            enLevel: 'B2 (выше среднего)',
            ruLevel: 'Носитель',
            experience: 'Опыт',
            education: 'Образование',
            inProgress: 'в процессе...',
            university: 'Уфимский университет науки и технологий, Прикладная информатика, бакалавриат 2 курс заоч.',
            link: 'ссылка',
            about: 'Начинающий front-end web разработчик, все технологии изучил самостоятельно в течение ~8 месяцев. Не имею коммерческого опыта разработки веб-приложений, однако имеется небольшой собственный pet-проект. Имеется небольшой некомерческий опыт работы с вебсокетами и REST запросами.',
            current: 'Pet-проект. Шахматы с хищением (текущий) с использованием вебсокетов',

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
            gameTitle: 'Plunder chess',

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
            openChat: 'Open chat',
            closeChat: 'Close chat',
            language: 'Language',
            volume: 'Volume',
            test: 'Test',
            copyright: 'All rights reserved',
            guest: 'Guest',
            you: 'You',
            yourName: 'Your name',
            yourAvatar: 'Your avatar',
            yourBorder: `Avatar's border`,
            warnImgSize: 'The image should be less than 4096 kb',
            ok: 'Ok',
            steal: 'Steal turns',
            yes: 'Yes',
            no: 'No',
            stealRefuse: `Don't steal turns`,
            seventyFiveMovesRule: '75 moves rule',
            threefoldRepeat: 'Threefold repetition',
            stalemate: 'Stalemate',
            send: 'Send',
            chatting: 'Chat',
            typeAMessage: 'Text a message',
            read: 'Has been read',
            unread: 'Unread',
            typing: 'Typing...',
            playWithFriend: 'Play with friend',
            fold: 'Fold',
            unfold: 'Unfold',
            createRoom: 'Create a room',
            joinRoom: 'Join a room',
            typeRoomCode: `Input room's id`,
            waiting: 'Waiting for another player',
            confirm: 'Confirm',
            roomId: 'Room id',
            roomNotFound: 'Room not found',
            chooseTurn: 'Choose turn type',
            nextLine: 'Shift + Enter - new line',
            copied: 'Copied',
            mainRule: 'The rules are the same as the regular chess, except for these changes',
            readHint: 'Hover or click on a rule to make it bigger',
            loading: 'Loading',
            name: "Konstantin Maslennikov",
            job: 'Junior front-end developer',
            location: 'Russia',
            contacts: 'Contacts',
            skills: 'Skills',
            traits: 'Personal traits',
            russian: 'Russian',
            english: 'English',
            enLevel: 'B2 (upper intermediate)',
            ruLevel: 'Native speaker',
            languages: 'Languages',
            experience: 'Experience',
            education: 'Education',
            inProgress: 'in progress...',
            university: `Ufa University of Science and Technology, Bachelor's degree, Applied Informatics 2 course distance ed.`,
            link: 'link',
            about: 'I am a junior front-end web developer, learned my tech stack by myself in about 8 months.I do not have any commercial experience, but have a pet project. Also, i have some work experience with websockets and REST requests.',
            current: 'Pet-project. Plunder chess (current) using websockets',


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
    }

    const languageDesc: Record<LanguageId, Record<string, Array<string>>> = {
        ru: {
            gameRules: [
                'При взятии атакующая фигура имеет право похитить ходы только что взятой фигуры',
                'Чтобы похитить ходы взятой фигуры, достаточно нажать во всплывающем сверху окне на тип фигуры, ходы которой вы собираетесь захватить. Тип похищенной фигуры отображается слева сверху в клетке с основной фигурой',
                'Если вы выполнили взятие фигуры, которая имеет украденные ходы другой фигуры, вы вправе выбрать один из типов фигуры',
                'Одновременно фигура может иметь лишь один дополнительный тип фигуры',
                'Фигура, имеющая дополнительный тип может лишь раз осуществить ход, согласно движениям фигуры изображённой в левой верхнем углу клетки, после чего дополнительный тип расходуется',
                'Фигуры всё ещё могут осуществлять свои обычные ходы без расходования дополнительного типа',
                'Если при взятии атакующая фигура уже имеет дополнительный тип, то вы имеете право заменить старый тип новым',
                'Вы не обязаны похищать ходы, если не желаете, однако вы не можете получить ходы только что взятой фигуры позже во время игры',
                'Все фигуры, кроме пешки, имеют право похитить ходы пешки, для использования взятия на проходе или хода на две клетки вперёд. Учитывайте, что используя похищенный ход пешкой на две клетки вперёд, ваша фигура может быть взята на проходе',
                'Король не может использовать ход пешкой на две клетки вперёд, если существует опасность взятия на проходе на следующем ходу',
                'Фигура имеющая дополнительный тип ввиде пешки, достигнув противоположного конца поля не имеет права для превращения в другую фигуру',
                'Пешка, дошедшая до противоположного конца поля, используя ход похищенной фигуры, всё ещё имеет право на превращение в другую фигуру на выбор',
                'Пешка, дошедная до противоположного конца поля, используя свой обычный ход, после превращения в выбранную фигуру наследует похищенный ранее тип, если он всё ещё расширяет потенциал фигуры',
                'Если пешка, используя ход похищенной фигуры возвратилась на второй ряд своего цвета, то она возвращает себе право хода на две клетки вперёд, равно как и возможность быть взятой на проходе',
                'Дополнительный тип фигуры может ставить короля в шах, ограничения на количество шахов - нет',
                'Король имеет право сходить ходом похищенной фигуры, чтобы избежать шаха',
            ],
            traits: ['Тайм-менеджмент', 'Желание развиваться', 'Самостоятельность', 'Адаптивность', 'Дипломатичность'],
        },
        eng: {
            gameRules: [
                `Whenever a piece is captured, the capturing piece has the option to plunder the captured piece's moves`,
                `To plunder the moves choose in popup window type of figure which you want to set as additional type of the capturing piece. Additional type is shown on the top-left corner of the cell`,
                'If you capture piece that already have an additional type, then you may plunder that type instead if you like',
                'A piece may only have one additional type at a time',
                'A piece that have the additional type is allowed to perform any legal move of the stolen type one time, consuming additional type',
                `Pieces may still perform their conventional moves while having an additional type without consuming it`,
                `If you capture a piece with a conventional move while having an additional type, you may replace it with new type`,
                'You do not have to plunder if you do not want to, but you may not plunder for that capture at a later time',
                `All pieces, expect for pawns, may plunder pawns in order to get en passant move or double-step move. Consider that piece that moved using pawn's double-step move may be captured by en passant`,
                `A king may not perform the pawn's double-step move if en passant is present`,
                `An additional type, that is the pawn, does not allow the main piece to promote to a higher rank piece`,
                `Pawn, that uses additional type's move to reach the opposite edge of the chessboard, must promote to a higher rank piece`,
                `As long as that additional type adds movement potential to the promoted piece, a pawn, that uses conventional move to reach the opposite edge of the chessboard and promote, will inherit it`,
                `If a pawn uses additional type's move to return to it's color second row it regains it's double-step option as well as the condition to be captured by en passant`,
                `Additional type automatically and immediately check an opponent's king. There is no limit to the number of times of additional type can check`,
                `Kings may use their additional type's move to escape check`,
            ],
            traits: ['Time-management', 'Willingness to learn', 'Independency', 'Adaptability', 'Diplomacy'],
        }
    }

    //app settings
    let langId = ref<LanguageId>(navigator.language.includes('ru') ? 'ru' : 'eng');
    let volume = ref<number>(0.25);
    let user = reactive<User>({ name: 'Guest', 'imgSrc': '', borderColor: 'black' });

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


    const getStrings = computed<LanguageStrings>(() =>
        languages[langId.value]);

    const getText = computed<Record<string, Array<string>>>(() =>
        languageDesc[langId.value]);

    const getVolume = computed<number>(() => volume.value);
    const getLangId = computed<LanguageId>(() => langId.value);
    const getUser = computed(() => user);

    const getIds = computed(() => Object.keys(languages));

    const setBorder = (value: string) => user.borderColor = value;
    const setUserImg = (value: string) => user.imgSrc = value;
    const setUserName = (value: string) => user.name = value;

    return { getStrings, getText, getLangId, setLangId, getIds, saveToLocal, getVolume, setVolume, getUser, setUserImg, setUserName, setBorder }
})