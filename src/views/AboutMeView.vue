<script lang="ts" setup>
import type { LanguageId } from '@/class/chessTypes&Interfaces';
import { useAppSettings } from '@/stores/appSettings';
import { computed } from 'vue';
const appStore = useAppSettings();

const textStrings = computed(() => appStore.getStrings);
const textStringArr = computed(() => appStore.getText);
let langId = computed(() => appStore.getLangId);

const languageChangeHandler = (ev: Event) => {
    appStore.setLangId((ev.target as HTMLSelectElement).value as LanguageId);
    appStore.saveToLocal();
}

</script>
<template>
    <div class="about-me-wrapper">
        <div class="header">
            <div class="date">03.09.2023</div>
            <select @change="languageChangeHandler" name="language" id="language">
                <option v-for="id in appStore.getIds" :value="id" :selected="id === langId">{{ id }}</option>
            </select>
        </div>
        <ul class="info">
            <li class="flex-center">
                <section class="first-section">
                    <div class="info-wrapper">
                        <h2 class="name">{{ textStrings.name }}</h2>
                        <div class="flex-center job">
                            <div class="icon-img-wrapper"><img loading="lazy" src="@/assets/web.png" alt=""></div>
                            <span>{{ textStrings.job }}</span>
                        </div>
                        <div class="flex-center">
                            <div class="icon-img-wrapper"><img loading="lazy" src="@/assets/location.png" alt=""></div>
                            <span>{{ textStrings.location }}</span>
                        </div>

                    </div>
                    <div>
                        <h3 class="contacts-title">{{ textStrings.contacts }}</h3>
                        <ul class="contacts">
                            <li class="mail flex-center">
                                <div class="icon-img-wrapper"><img loading="lazy" src="@/assets/mail.png" alt=""></div>
                                <span>maslennikovkonstantin23@gmail.com</span>
                            </li>

                            <li class="phone-number flex-center">
                                <div class="icon-img-wrapper"><img loading="lazy" src="@/assets/phone.png" alt=""></div>
                                <span>+79656544996</span>
                            </li>
                        </ul>
                    </div>
                    <ul class="links">
                        <li class="flex-center">
                            <a class="flex-center" href="https://wa.me/+79656544996" target="_blank">
                                <div class="icon-img-wrapper"><img loading="lazy" src="@/assets/whatsapp.png" alt=""></div>
                                <span>Whatsapp</span>
                            </a>
                        </li>

                        <li class="flex-center">
                            <a class="flex-center" href="https://t.me/konstantinMaslennikov" target="_blank">
                                <div class="icon-img-wrapper"><img loading="lazy" src="@/assets/telegram.png" alt=""></div>
                                <span>Telegram</span>
                            </a>
                        </li>

                        <li class="flex-center">
                            <a class="flex-center" target="_blank" href="https://github.com/CrookLvl1">
                                <div class="icon-img-wrapper"> <img loading="lazy" src="@/assets/github.png" alt=""></div>
                                <span>Github</span>
                            </a>
                        </li>
                        <li class="flex-center">
                            <a class="flex-center" href="https://www.linkedin.com/in/konstantin-maslennikov-b8329028b/" target="_blank">
                                <div class="icon-img-wrapper"><img loading="lazy" src="@/assets/linkedin.png" alt=""></div>
                                <span>LinkedIn</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </li>
            <li class="flex-center">
                <section class="second-section">
                    <div class="column skills">
                        <h3>{{ textStrings.skills }}</h3>
                        <ul>
                            <li><span>HTML/CSS</span></li>
                            <li><span>SASS</span></li>
                            <li><span>Javascript</span></li>
                            <li><span>Typescript</span></li>
                            <li><span>Vue 3</span></li>
                            <li><span>Pinia / Vuex</span></li>
                            <li><span>Vue router</span></li>
                            <li><span>Vite / Webpack</span></li>
                            <li><span>Git</span></li>
                            <li><span>Figma</span></li>
                        </ul>
                    </div>
                    <div class="column traits">
                        <h3>{{ textStrings.traits }}</h3>
                        <ul class="traits">
                            <li v-for="trait in textStringArr.traits" :key="trait"><span>{{ trait }}</span></li>
                        </ul>
                    </div>
                    <div class="column languages">
                        <h3>{{ textStrings.languages }}</h3>
                        <ul>
                            <li>
                                <h4>{{ textStrings.russian }}</h4>
                                <span class="russian">{{ textStrings.ruLevel }}</span>
                            </li>
                            <li>
                                <h4>{{ textStrings.english }}</h4>
                                <span class="english">{{ textStrings.enLevel }}</span>
                            </li>
                        </ul>
                    </div>

                </section>
            </li>
            <li class="flex-center">
                <section class="third-section">
                    <div class="column experience">
                        <h3>{{ textStrings.experience }}</h3>
                        <div class="progress">
                            <span>01.07.2023</span>
                            <span>{{ textStrings.current }}<router-link to="/" target="_blank">{{ textStrings.link }}</router-link></span>
                            <span>02.09.2023</span>
                        </div>
                    </div>
                    <div class="column education">
                        <h3>{{ textStrings.education }}</h3>
                        <div class="in-progress">
                            <div class="icon-img-wrapper">
                                <img loading="lazy" src="@/assets/hourglass.png" alt="">
                            </div>
                            <span>{{ textStrings.inProgress }}</span>
                        </div>
                        <span>{{ textStrings.university }} (2022 - 2028)</span>
                    </div>
                    <div class="column">
                        <h3>{{ textStrings.aboutMe }}</h3>
                        <span>{{ textStrings.about }}</span>
                    </div>
                </section>
            </li>

        </ul>

    </div>
</template>
<style lang="scss" scoped>
a, router-link {
    gap: 0.5rem;
    position: relative;
    width: fit-content;
    box-sizing: border-box;
    display: block;
    cursor: pointer;

    .icon-img-wrapper {
        transition: all 200ms ease-in;
        border-radius: 50%;

        img {
            width: 100%;
            height: 100%;
        }

    }


    transition: all 200ms ease-in;

    &::after {
        content: '';
        height: 2px;
        width: 100%;
        left: 0;
        bottom: -0.5rem;
        position: absolute;
        background-color: transparent;
        transition: all 200ms ease-in;
    }

    &:hover {
        &::after {
            background-color: black;
        }



        .icon-img-wrapper {
            border-radius: 50%;
            box-shadow: 0 0 0.5rem 0 black;
        }
    }
}


span {
    line-height: 1.5rem;
}

h4 {
    line-height: 2rem;
    font-size: 1.5rem;
}

span {
    font-size: max(1rem, 14px);
}

h3 {
    font-size: 2rem;
    padding-bottom: 1rem;
}

.icon-img-wrapper {
    width: 2rem;
    height: 2rem;

    img {
        width: 100%;
        height: 100%;
    }
}

.flex-center {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: fit-content;
    box-sizing: border-box;
    padding: 0.5rem 3rem 0;

    #language,
    .date {
        font-size: 1.5rem;
    }

    #language:focus {
        box-shadow: 0 0 10px 0 black;
    }

}

.about-me-wrapper {
    box-shadow: 0 0 10px 2px black;
    box-sizing: border-box;
    background-color: rgb(212, 212, 212);
    max-width: 1024px;
    margin: 0 auto;
    position: relative;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;

    .info {
        display: flex;
        flex-direction: column;
        height: 100%;


        >li {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            padding: 1rem 2rem 1rem 4rem;
            box-sizing: border-box;


            &:last-child {
                & section::before {
                    display: none;
                }
            }

            & section {

                >.column {
                    flex: 1 1;
                    box-sizing: border-box;
                    padding: 1rem;
                    overflow-y: auto;

                    h3 {
                        text-align: center;
                        margin-bottom: 0.5rem;
                    }

                    &:nth-child(2) {
                        border-right: 0.2rem solid gray;
                        border-left: 0.2rem solid gray;
                    }
                }

                display: flex;
                position: relative;
                width: 100%;
                box-sizing: border-box;
                flex-wrap: wrap;
                gap: 1rem;
                justify-content: space-between;

                &::before {
                    content: '';
                    width: 100%;
                    bottom: -1rem;
                    background-color: rgb(173, 173, 173);
                    position: absolute;
                    height: 2px;
                    border-radius: 12px;
                }

                &::after {
                    content: '';
                    height: 2rem;
                    width: 0.2rem;
                    border-radius: 12px;

                    background: linear-gradient(90deg, rgba(166, 154, 212, 1) 0%, rgba(103, 71, 156, 1) 50%, rgba(180, 53, 93, 0.9) 100%);
                    position: absolute;
                    left: -1rem;
                    top: 0%;
                    transition-property: all;
                    // transition-timing-function: ease-in-out;
                    transition-timing-function: cubic-bezier(.65, 1.79, .64, .85);
                    transition-duration: 500ms;
                    transition-delay: 0ms;
                }

                &:hover {
                    &::after {
                        transition-delay: 100ms;
                        height: 100%;
                        box-shadow: 0 0 0.5rem 0 rgba(103, 71, 156, 1);
                    }
                }

                &.first-section {
                    gap: 2rem;

                    .links {
                        display: flex;
                        flex-wrap: wrap;
                        width: 100%;
                        justify-content: space-around;
                        gap: 0 1rem;

                        >li {
                            height: 3rem;
                            font-size: 1.5rem;
                            width: fit-content;
                            min-width: 10rem;
                        }
                    }

                    .info-wrapper {
                        display: flex;
                        flex-direction: column;
                        flex: 1 1;
                        gap: 0.5rem;

                        .flex-center {

                            span {
                                display: block;
                                font-weight: normal;
                                align-items: center;
                                font-size: 2rem;
                            }
                        }


                        .name {
                            min-width: 350px;
                            // background-color: red;
                            font-weight: 600;
                            font-size: 3rem;
                            line-height: 3rem;
                        }

                    }

                    .contacts {
                        display: flex;
                        flex-direction: column;
                        gap: 0.25rem;

                        &-title {
                            line-height: 3rem;
                        }

                        >li {
                            height: 3rem;
                            font-size: 1.5rem;
                            width: fit-content;
                            min-width: 10rem;


                            &.phone-number {
                                a::after {
                                    display: none;
                                }
                            }

                            span {

                                display: block;
                            }



                        }
                    }



                }

                &.second-section {
                    justify-content: space-between;
                    height: max-content;

                    .column {

                        &.skills {
                            >ul {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 1rem;

                                >li {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background-color: rgba(255, 255, 255, .5);
                                    min-width: 24px;
                                    width: fit-content;
                                    padding: 4px 10px;
                                    min-height: 30px;
                                    border-radius: 12px;
                                    position: relative;

                                    span {
                                        line-height: max(1rem, 14px);
                                    }
                                }
                            }
                        }

                        &.traits {
                            >ul {
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                gap: 0.75rem;

                                >li {
                                    min-height: 36px;
                                    max-width: 22rem;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    text-align: center;
                                    border-radius: 12px;
                                    // flex: 1 1;
                                    background-color: rgb(207, 190, 229);
                                    box-shadow: 2px 2px 5px 0 black;

                                    span {
                                        font-size: 16px;
                                        letter-spacing: 0.5px;
                                        line-height: 2.5rem;
                                    }
                                }
                            }
                        }

                        &.languages {
                            >ul {
                                display: flex;
                                flex-direction: column;
                                padding-left: 1rem;
                                width: max-content;
                                gap: 1.5rem;

                                >li {

                                    span {
                                        display: block;
                                        text-align: center;
                                        margin-top: 0.75rem;
                                        padding-top: 1rem;
                                        width: 100%;
                                        position: relative;

                                        &::after,
                                        &::before {
                                            content: '';
                                            height: 3px;
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            border-radius: 12px;
                                        }

                                        &::before {
                                            width: 100%;
                                            background-color: rgb(130, 153, 175);
                                        }

                                        &::after {
                                            background-color: lightcoral;
                                            box-shadow: 0 0 3px 0 black;
                                        }

                                        &.russian::after {
                                            width: 100%;

                                        }

                                        &.english::after {
                                            width: 67%;
                                        }
                                    }

                                }
                            }
                        }

                    }
                }

                &.third-section {
                    >.column {

                        span {
                            line-height: 1.75rem;
                        }

                        &.education {
                            .in-progress {
                                border-bottom: 1px solid black;
                                padding-bottom: 0.5rem;
                                display: flex;
                                gap: 0.5rem;
                                align-items: center;

                                .icon-img-wrapper {
                                    width: 1.5rem;
                                    height: 1.5rem;
                                }
                            }
                        }

                        &.experience {
                            .progress {
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                min-height: 100px;
                                padding-left: 1rem;
                                position: relative;

                                a {
                                    font-size: 1.5rem;
                                    color: rgb(128, 0, 128);

                                    text-decoration: underline;

                                    &::after {
                                        display: none;
                                        bottom: 0;
                                    }
                                }


                                &::after {
                                    content: '';
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    background-color: rgb(0, 0, 0);

                                    height: 100%;
                                    width: 0.25rem;
                                    border-radius: 12px;
                                }

                                >span {
                                    position: relative;

                                    &::after {
                                        position: absolute;
                                        background-color: rgb(0, 0, 0);
                                        content: '';
                                        width: 0.75rem;
                                        height: 0.25rem;
                                        left: -1rem;
                                        top: 40%;
                                        border-radius: 12px;

                                    }

                                    &:nth-child(2) {
                                        padding-left: 3rem;

                                        &::after {
                                            width: 3.25rem;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            }


        }


    }

    .footer {
        margin-top: auto;
        text-align: end;
        box-sizing: border-box;
        font-size: 1.5rem;
    }
}


@media (max-width: 767.57px) {
    h4 {
        font-size: 1.75rem;
    }

    .about-me-wrapper {
        overflow-x: hidden;

        .info>li {
            padding: 2rem 1rem;

            &>section {

                >div {
                    box-sizing: border-box;
                    min-width: 100%;
                }



                &::before {
                    max-width: 100%;
                }

                &::after {
                    display: none;
                }

                >div.column {
                    border: none !important;
                }
            }
        }
    }

}

@media (max-width: 467.57px) {
    .about-me-wrapper .info>li {
        padding: 1rem 0.5rem;

        & section {
            >ul.links {
                border: none;
                max-width: 200px;
            }
        }
    }
}
</style>