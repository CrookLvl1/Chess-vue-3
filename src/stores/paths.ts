import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

export const useImagePaths = defineStore('imagePaths', () => {
  const paths = new Map();
  const figuresTitles = ['pawn', 'knight', 'bishop', 'queen', 'king', 'rook'];
  const colors = ['white', 'black'];

  for (let title of figuresTitles) {
    for (let color of colors) {
      const path = title + color + '.png';
      paths.set(path, new URL(`../assets/${path}`, import.meta.url).href);
    }
  }

  return { paths }
})

export const useAudioPaths = defineStore('audioPaths', () => {
  let paths: Array<string> = reactive<Array<string>>([]);
  const getPaths = computed(() => paths);

  const audioTitles = ['move1.mp3', 'move2.mp3', 'move3.mp3'];

  for (let title of audioTitles) {
    paths.push(new URL(`../assets/${title}`, import.meta.url).href);
  };

  return { paths, getPaths }
})