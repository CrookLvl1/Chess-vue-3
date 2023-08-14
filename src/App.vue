<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppSettings } from './stores/appSettings';
import HeaderComponentVue from './components/headerComponent.vue';
import FooterComponent from './components/footerComponent.vue';
import { computed } from 'vue';

const textStrings = computed(() => useAppSettings().getStrings);



const url = new URL('../src/assets/bishopblack.png', import.meta.url).href;

console.log(url);
console.log(encodeURIComponent(url));
console.log(decodeURIComponent(encodeURIComponent(url)))



</script>

<template>
  <main class="main-screen-wrapper">
    <header>
      <HeaderComponentVue />
    </header>
    <RouterView class="main-wrapper" />
    <footer>
      <FooterComponent />
    </footer>
  </main>
</template>

<style lang="scss">
html {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}

button.exit-button {
  font-size: 1.5rem;
  display: flex;
  flex: 1 1 100px;
  max-width: 20rem;
  gap: 1rem;
  justify-content: center;
}

.flex {
  display: flex;
}

.icon {
  position: relative;
  width: 2rem;
  position: relative;
  height: 2rem;
  overflow: hidden;

  &-cancel {

    &::before,
    &::after {
      content: '';
      width: 0.4rem;
      position: absolute;
      border-radius: 12px;
      height: 100%;
      box-shadow: 0 0 2.5px 0 green;
      left: 40%;
      top: 0;
      background-color: rgb(165, 119, 119);
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }

  &-apply {

    &::before,
    &::after {
      content: '';
      position: absolute;
      border-radius: 12px;
      width: 0.4rem;
      box-shadow: 0 0 2.5px 0 green;
      background-color: rgb(35, 33, 172);
      bottom: 0;
    }

    &::before {
      height: 60%;
      left: 20%;
      transform: rotate(-40deg);
    }

    &::after {
      height: 100%;
      left: 55%;
      transform: rotate(35deg);
    }
  }

  &-play {

    &::after {
      content: '';
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      border: 1rem solid rgba(52, 95, 224, 0.734);
      border-top: 1rem solid transparent;
      border-bottom: 1rem solid transparent;
      border-right: 1rem solid transparent;
      position: absolute;
    }
  }


}


header,
footer {
  width: 100%;
}

@media (max-width: 968px) {
  html {
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  html {
    font-size: 8px;
  }
}


body,
ul,
li,
h1,
h2,
h3,
h4,
h5,
h6,
p,
button {
  margin: 0;
  padding: 0;
  list-style: none;
}

button {
  border: none;
}

body {
  background-color: #6e6767;
}

.main-screen-wrapper {
  max-width: 1024px;
  margin: 0 auto;
  width: 100dvw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  height: 100dvh;
  box-sizing: border-box;
}

.main-wrapper {
  position: relative;
  width: 100%;
}

.full-height-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 100dvh;
  box-sizing: border-box;
  background-color: rgb(91, 143, 194);
  background: linear-gradient(rgb(91, 143, 194), rgb(131, 180, 230));
}

.classic-button {
  background-color: rgb(114, 208, 110);
  font-size: 2rem;
  border: 2.5px solid black;
  border-radius: 6px;
  height: fit-content;
  cursor: pointer;
  padding: 1rem 2rem;
  user-select: none;
  font-weight: 500;
  transition-property: background-color;
  transition-timing-function: ease-out;
  transition-duration: 150ms;

  &:hover {
    background-color: rgba(114, 208, 110, .7);

  }

  &:active {
    background-color: rgba(114, 208, 110, .5);
  }

  &-small {
    border: 1px solid black;
    font-size: 1.5rem;
    padding: 1rem;
  }
}

footer {
  margin-top: auto;
}
</style>
