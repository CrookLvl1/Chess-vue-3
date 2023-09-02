<script setup lang="ts">
import { RouterView } from 'vue-router'


</script>

<template>
  <RouterView class="game-bg" />
</template>

<style lang="scss">
.from-above-enter-from,
.from-above-appear-from {
  opacity: 0%;
  transform: translateY(-70%);
}

.from-above-leave-from {
  opacity: 100%;
  transform: translateX(0%);

}

.from-above-leave-to {
  opacity: 0%;
  transform: translateX(-40%);
}

.from-above-leave-active {
  position: absolute;
  transition: all 400ms ease-in;
  top: 0;
}

// .game-leave-from,
.from-above-enter-to,
.from-above-appear-to {
  opacity: 100%;
  transform: translateY(0%);
}


.from-above-enter-active,
.from-above-appear-active {
  transition: all 1s ease-out;
  position: absolute;
  top: 0;
}


[data-hint-msg] {
  &::before {
    content: '';
    position: absolute;
    opacity: 0%;
    visibility: hidden;
    left: 30%;
    top: -1.5rem;
    width: 0;
    height: 0;
    border: 0.5rem solid rgb(184, 194, 204);
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }

  &::after {
    content: attr(data-hint-msg);
    display: block;
    z-index: 10;
    background-color: rgb(184, 194, 204);
    font-size: 1.5rem;
    width: max-content;
    position: absolute;
    left: -60%;
    top: -4rem;
    padding: 0.25rem 1rem;
    border: 2px solid black;
    opacity: 0%;
    visibility: hidden;
  }

  &:hover::after,
  &:hover::before,
  &:active::after,
  &:active::before {
    transition: opacity 250ms ease-out 500ms;
    visibility: visible;

    opacity: 100%;
  }

  &::after,
  &::before {
    transition: opacity 250ms ease-in 0ms;
  }
}

html {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}


.flex {
  display: flex;
}

.main-button {
  display: flex;
}


.icon {
  position: relative;
  width: 2rem;
  position: relative;
  height: 2rem;
  overflow: hidden;

  &:focus {
    box-shadow: none;
  }

  &-cancel {

    &::before,
    &::after {
      content: '';
      width: 0.4rem;
      position: absolute;
      border-radius: 12px;
      height: 100%;
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
    background-color: transparent;

    &::before,
    &::after {
      content: '';
      position: absolute;
      border-radius: 12px;
      width: 0.4rem;
      background-color: rgb(35, 33, 172);
      bottom: 0;
    }

    &::before {
      height: 60%;
      left: 12.5%;
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
      border: 1rem solid rgba(52, 95, 224, 0.7);
      border-top: 1rem solid transparent;
      border-bottom: 1rem solid transparent;
      border-right: 1rem solid transparent;
      position: absolute;
    }
  }

  &-exit-behavior {
    border: none;
    cursor: pointer;
    align-self: flex-end;
    width: 4rem;
    height: 4rem;
    transition: all 250ms ease-out;
    position: relative;
    background-color: transparent;
    min-width: 40px;
    min-height: 40px;
    max-width: 60px;
    max-height: 60px;

    &::after,
    &::before {
      left: 45%;
      transition: all 250ms ease-out;
      background-color: rgba(240, 128, 128)
    }

    &:hover {

      &::after,
      &::before {
        background-color: rgba(240, 128, 128, .7);
      }
    }

    &:active,
    &:focus {
      transform: scale(0.8);
      &::after, &::before {
        box-shadow: 0 0 1rem 0 black;
      }
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
button,
a {
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  border: none;
  text-decoration: none;
  color: #000;
}

input {
  outline: none;
  border: none;

}

button {
  border: none;

  &:focus {
    outline: none;
    box-shadow: 0 0 5px 2px black;
  }
}

body {
  line-height: 1.5em;
  overflow-y: auto;
  background-color: rgb(191, 188, 188);
}

.game-bg {
  background-color: rgb(140, 138, 138)
}


.main-screen-wrapper {
  max-width: 1024px;
  margin: 0 auto;
  width: 100dvw;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100dvh;
  box-sizing: border-box;
  overflow-x: hidden;
}

.main-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.full-height-wrapper {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 100dvh;
  box-sizing: border-box;
  background-color: rgb(91, 143, 194);
  background: linear-gradient(0deg, rgb(114, 125, 154), rgb(132, 132, 180))
}

.play-type-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  li {
    width: 50%;
    box-sizing: border-box;
    min-width: fit-content;

    button {
      width: 100%;
      flex: 1 1;
    }

    @media (max-width: 700px) {
      max-width: max(50%, 250px);
      width: 100%;
    }
  }

  gap: 3rem;
}

.classic-button {
  background-color: rgb(114, 208, 110);
  font-size: 2rem;
  // border: 2.5px solid black;
  border-radius: 6px;
  height: fit-content;
  cursor: pointer;
  padding: 1rem 2rem;
  position: relative;
  user-select: none;
  font-weight: 500;
  transition-property: all;
  transition-timing-function: ease-out;
  transition-duration: 150ms;

  &:hover {
    background-color: rgba(114, 208, 110, .7);

  }

  &:active {
    background-color: rgba(114, 208, 110, .5);
    box-shadow: none;
    transform: scale(0.9);
  }

  &-small {
    // border: 1px solid black;
    font-size: 1.5rem;
    padding: 1rem;
  }
}

@keyframes menu {
  0% {
    box-shadow: 0.4rem 0.4rem 0.2rem 0 yellow;
    transform: translate(0.2rem, 0.2rem);
    border-radius: 0;
  }

  50% {
    box-shadow:
      0 0 0 0.5px yellow;
    transform: translate(0, 0);

  }

  100% {
    box-shadow: 0 0 1rem 1px yellow,
      inset 0 0 1rem 1px rgb(255, 247, .7);
    transform: translate(0, 0);
    // border-radius: 12px;
  }
}

@keyframes menu-init {
  0% {
    box-shadow: 0 0 1rem 1px yellow;
  }

  100% {
    box-shadow:
      0.4rem 0.4rem 0.2rem 0 yellow,
      inset 0 0 0 0 yellow;
    transform: translate(0.2rem, 0.2rem);
  }
}

.menu-button {
  transition: all 400ms ease-out;
  animation-name: menu-init;
  animation-duration: 400ms;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  border-radius: 0;



  &:hover {
    animation-name: menu;
    color: white;
  }

  &:active {
    transition-property: scale;
    transition-duration: 100ms;
    scale: 0.95;
  }


}

.choosable-figure {
  width: 5rem;
  height: 5rem;
  padding: 1%;
  box-sizing: border-box;

  // background-color: rgb(107, 142, 62);
  display: block;
  cursor: pointer;
  border-radius: 50%;
  transition: all 250ms ease-out;


  &:hover {
    background-color: rgb(200, 212, 103);
    box-shadow: 0 0 10px 0 rgb(200, 212, 103);
  }
}


footer {
  margin-top: auto;
}</style>
