<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <main class="main-screen-wrapper">
    <header>
    </header>
    <RouterView class="main-wrapper" />
    <footer>

    </footer>
  </main>
</template>

<style lang="scss">
@media (max-width: 1024px) {
  .main-screen-wrapper {
    height: 100dvh;
    box-sizing: border-box;
  }
}

.main-screen-wrapper {
  max-width: 1024px;
  margin: 0 auto;
  width: 100dvw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}

body,
ul,
li,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
  list-style: none;
}

body {
  background-color: #6e6767;
}

html {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
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

.main-wrapper {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  position: relative;
}

.classic-button {
  background-color: rgb(114, 208, 110);
  font-size: 2rem;
  border: 2.5px solid black;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  padding: 10px 25px;
  user-select: none;
  font-weight: 500;

  &:hover {
    background-color: rgba(114, 208, 110, .7);
  }

  &:active {
    background-color: rgba(114, 208, 110, .5);
  }

  &-small {
    border: 1px solid black;
    border-radius: 2.5px;
    padding: 5px 10px;
    font-size: 2rem;
  }
}
</style>
