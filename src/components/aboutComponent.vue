<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useAppSettings } from '@/stores/appSettings';
const appStore = useAppSettings();

const textStrings = computed(() => appStore.getStrings)

const textStringsArray = computed(() => appStore.getText);


const list = ref<HTMLUListElement>();

watch((list), (current) => {
    current = current as HTMLUListElement;
    const style: DOMRect = current.getBoundingClientRect();
    const listChildren = current.children

});





</script>
<template>
    <div class="about-game-wrapper">
        <ul class="titles">
            <h5 class="title">
                {{ textStrings.gameTitle }}
            </h5>
            <h5 class="rules-title">
                {{ textStrings.mainRule }}
            </h5>
            <h5 class="rules-read-hint">
                {{ textStrings.readHint }}
            </h5>
        </ul>
        <div class="rules">
            <ul class="rules-list" ref="list">
                <template v-for="rule in textStringsArray.gameRules">
                    <li class="rules-list-item">
                        <p>{{ rule }}</p>
                    </li>
                </template>

            </ul>
        </div>

    </div>
</template>
<style lang="scss" scoped>
.titles {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

h5,
p {
    line-height: 1.75em;
}

.about-game-wrapper {
    padding: 1.5rem;
    overflow-y: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    h5.title {
        font-weight: 600;
        font-size: 2.5rem;
    }
}

.rules {
    flex: 1 1;
    overflow-y: auto;
    border: 2px solid black;
    padding: 2rem 2rem 2rem 3rem;
    width: 100%;
    box-sizing: border-box;

    scrollbar-width: thin;
    &::-webkit-scrollbar {
        width: 0.5rem;
        border-radius: 12px;

        &-thumb {
            border-radius: 12px;
            background-color: rgb(179, 249, 255, 1);

            &:hover {
                background-color: rgb(179, 249, 255, .7);
            }

            &:active {
                background-color: rgb(78, 78, 78);
            }

        }
    }


    &-read-hint {
        user-select: none;
        pointer-events: none;
        font-size: 2rem;
        font-weight: 500;
        text-decoration: underline;
        box-shadow: inset 0 0 2rem 0 yellow;
        color: white;
        text-align: center;
        padding: 1.5rem 0;
        margin-bottom: 1rem;
    }

    &-title {
        font-size: 2rem;
    }

    &-list {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;


        &-item {
            list-style: decimal outside none;
            padding: 0.25rem 0.5rem;
            box-shadow: 0 0 0.25rem 0.1rem black;
            transition: all 300ms ease-out;
            font-size: 1.5rem;

            p {
                font-size: 1.5rem;
                transition: all 200ms linear;
            }

            &:hover,
            &:active {
                list-style: none;
                border: none;
                outline: none;
                box-shadow: 0 0 1rem 0.2rem black;
                background-color: rgb(201, 201, 201);

                p {
                    font-size: 2rem;
                }
            }

        }
    }
}

@media (max-width: 600px) {
    .rules {
        &-list {
            &-item {
                font-size: 2rem;
            }

            p {
                font-size: 1.5rem;

                &:hover,
                &:active {
                    font-size: 2.5rem;
                }
            }
        }

    }
}


.exit-buttons-wrapper {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
}</style>