import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useImagePaths = defineStore('imagePaths', () => {
  const guestImgHref = new URL('@/assets/guest.png', import.meta.url).href;

  const paths = new Map();
  const figuresTitles = ['pawn', 'knight', 'bishop', 'queen', 'king', 'rook'];
  const colors = ['white', 'black'];

  for (let title of figuresTitles) {
    for (let color of colors) {
      const path = title + color + '.png';
      paths.set(path, new URL(`../assets/${path}`, import.meta.url).href);
    }
  }

  return { paths, guestImgHref }
})

export const useAudioPaths = defineStore('audioPaths', () => {
  let paths: Array<string> = ([]);
  const getPaths = computed(() => paths);

  const audioTitles = ['move1.mp3', 'move2.mp3', 'move3.mp3'];

  for (let title of audioTitles) {
    paths.push(new URL(`../assets/${title}`, import.meta.url).href);
  };

  return { paths, getPaths }
})
