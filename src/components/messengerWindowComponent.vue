<script lang="ts" setup>
import { type Message } from '@/class/chessTypes&Interfaces'
import { useMultiplayerStore } from '@/stores/multiplayerStore';
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { useAppSettings } from '@/stores/appSettings'
import type { Player } from '@/class/player';
import MessageComponent from '@/components/messageComponent.vue';
const emit = defineEmits(['close']);

const multiplayerStore = useMultiplayerStore();
const textStrings = computed(() => useAppSettings().getStrings);

const player = computed<Player>(() => multiplayerStore.getPlayer);
const enemyPlayer = computed<Player>(() => multiplayerStore.getEnemyPlayer);
const messagesWrapper = ref<HTMLUListElement>();


const text = ref<string>('');

let messages = computed<Array<Message>>(() => {
    return multiplayerStore.getMessages;
});

let readMessages = reactive<Array<number>>([]);

const sendMessageAsync = async () => {
    multiplayerStore.sendMessage(text.value);
    text.value = '';
}

const sendMessage = () => {
    if (text.value.length <= 0) return;
    sendMessageAsync().then(() => {
        messagesWrapper.value?.scrollBy({ top: messagesWrapper.value.scrollHeight });

    })
}

const enterPressHandler = (ev: KeyboardEvent) => {
    if (ev.shiftKey) {
        text.value += `\n`;
        return;
    }

    sendMessage();
}


//IIFE 
const sendReadMessagesDelayed = (() => {
    let timeout: ReturnType<typeof setTimeout>;

    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            multiplayerStore.sendReadMessages(readMessages);
            readMessages = [];
        }, 2000)
    }
})();


const opponentMessages = reactive<Array<HTMLLIElement>>([]);

onMounted(() => {
    //OBSERVING ONLY MESSAGES THAT HAS BEEN SENT BY THE OPPONENT
    let observer = new IntersectionObserver((entries: Array<IntersectionObserverEntry>, observer: IntersectionObserver) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    observer.unobserve(entry.target);   
                    const msg = messages.value.find((message: Message) => message.id === +((entry.target as HTMLElement).dataset.id as string));
                    if (msg) {
                        msg.read = true;
                        readMessages.push(msg.id);
                        sendReadMessagesDelayed()
                    }
                }, 1000)
            }
        })
    }, { root: messagesWrapper.value, rootMargin: '0px', threshold: 0.8 });
    
    console.log("OBSERVER INIT", observer);
    watch(opponentMessages, (current: Array<Element>, previous: Array<Element>) => {
        if (current.length === 0) return;
        observer.observe(current[current.length - 1]);
    })

})


</script>

<template>
    <transition name="messenger">
        <div class="messenger-wrapper">
            <div class="messenger-header">
                <h4 class="chat">{{ textStrings.chatting }}</h4>
                <button @click="emit('close')" class="icon icon-cancel icon-exit-behavior"></button>
            </div>
            <div class="messages-list-wrapper ">
                <ul ref="messagesWrapper" class="messages-list">

                    <template v-for="message in messages" :key="message.id">
                        <li v-if="!message.currentUserSender" ref="opponentMessages" :data-id="message.id">
                            <message-component :player="message.currentUserSender ? player : enemyPlayer"
                                :message="message" />
                        </li>
                        <li v-else>
                            <message-component :player="message.currentUserSender ? player : enemyPlayer"
                                :message="message" />
                        </li>
                    </template>

                </ul>
            </div>
            <div class="user-input">
                <textarea maxlength="150`" :placeholder="textStrings.typeAMessage + '...\n' + textStrings.nextLine"
                    @keypress.enter.prevent="enterPressHandler" v-model="text"></textarea>
                <button class="classic-button send-btn" @click="sendMessage">
                    <span>{{ textStrings.send }}</span>
                </button>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
div.messenger-wrapper {
    overflow-x: hidden;
    overflow-y: auto;

    outline: 2px solid black;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 1rem;
    padding-bottom: 2rem;
    gap: 0.75rem;
    z-index: 100;
    position: absolute;
    top: -1rem;
    left: -1rem;
    width: 35rem;
    height: 53rem;
    background-color: rgb(130, 134, 137);

    .messenger-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4.chat {
            display: block;
            font-weight: 600;
            font-size: 2rem;
        }
    }

    .user-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        box-sizing: border-box;
        gap: 1rem;

        textarea {
            resize: none;
            border-radius: 6px;
            padding: 0;
            margin: 0;
            border: none;
            flex: 1 1;
            height: 100%;
            padding: 0.5rem;
            box-sizing: border-box;
            background-color: lightgray;

            &::placeholder {
                transition: all 400ms linear;
                color: rgba(0, 0, 0, 0.7);
                font-size: 1rem;
            }

            &:focus {
                outline: none;

                &::placeholder {
                    color: rgba(0, 0, 0, 1);
                    font-weight: 600;
                }
            }
        }

        .send-btn {
            display: flex;
            gap: 1rem;
            font-size: 1.5rem;
            font-weight: 600;
            height: 100%;

            &-icon {
                &::after {
                    border-left-color: 1;
                }
            }
        }
    }


}

.messages-list-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    overflow-x: hidden;

    .messages-list {
        max-height: 40rem;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        box-sizing: border-box;
        overflow-x: hidden;
        scrollbar-color: rgb(179, 249, 255, 1) transparent;
        // scrollbar-width: thin;


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
    }
}


.messenger-enter-from,
.messenger-leave-to {
    transform: translateX(-70%);
    opacity: 0%;
}

.messenger-enter-to,
.messenger-leave-from {
    transform: translateX(0%);
    opacity: 100%;
}

.messenger-enter-active {
    transition: all 200ms ease-out;
}

.messenger-leave-active {
    transition: all 200ms ease-in;
}
</style>