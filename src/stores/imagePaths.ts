import { defineStore } from 'pinia'

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
