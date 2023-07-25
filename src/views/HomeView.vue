<script lang="ts" setup>
import type { ChessColor } from '@/class/chess';
import { Figure, ChessField } from '@/class/chess';
import { Cell } from '@/class/chess';
import CellComponentVue from '@/components/cellComponent.vue';
import { computed, reactive, ref } from 'vue';

let playerColor = ref<ChessColor>('white');

let rotate = computed(() => playerColor.value === 'black')


const field = reactive(new ChessField(true, playerColor.value, 85));

let turn = computed(() => field.getTurn())



let clicked = false;
let fromRow: number,
  fromColumn: number,
  toRow: number,
  toColumn: number;

let cellsToHint: Array<Cell> = [];

const mouseUpHandler = (ev: MouseEvent) => {
  if (ev.button !== 0) return;

  let target = ev.target as HTMLElement;

  while (!target.classList.contains('cell-wrapper') && target.tagName !== 'LI') {
    target = target.parentElement as HTMLElement;
  }

  if (!target.classList.contains('cell-wrapper')) return;

  //not allow to touch enemy figures if playing not solo...
  const cell = field.getCell(
    +(target.dataset.row as string),
    +(target.dataset.column as string)
  );

  if (!(!cell.isFree() &&
    field?.getTurn() === cell.getFigure()?.getColor() &&
    (field?.getSoloplay() || field?.getTurn() === field?.getColorDown()) ||
    cell.getHint()))
    return;


  console.log(target);



  if (!clicked) {
    fromRow = +(target.dataset.row as string);
    fromColumn = +(target.dataset.column as string);
    if (field.getCell(fromRow, fromColumn).isFree()) return;

    // switch hints
    cellsToHint = field.getHints(fromRow, fromColumn);
    console.log(cellsToHint);
    if (cellsToHint.length === 0) return;

    cellsToHint.forEach((cell: Cell) => {
      cell.switchHint();
    })

    field.getCell(fromRow, fromColumn).switchSelected()

    clicked = true;
  }
  else {
    toRow = +(target.dataset.row as string);
    toColumn = +(target.dataset.column as string);

    //Если игрок нажимает на фигуру своего же цвета
    if (field.getCell(fromRow, fromColumn).getFigure()?.getColor() === field.getCell(toRow, toColumn).getFigure()?.getColor()) {
      cellsToHint.forEach((cell: Cell) => cell.switchHint());
      clicked = false;
      return;
    };

    if (field.getCell(toRow, toColumn).getHint()) {
      cellsToHint.forEach((cell: Cell) => {
        cell.switchHint();
      })

      field.getCell(fromRow, fromColumn).switchSelected()

      field.moveFigure(fromRow, fromColumn, toRow, toColumn);
      field.switchTurn();
    }


    clicked = false;
    cellsToHint = [];
    return;
  }


}
</script>

<template>
  <div class="chess">
    <ul class="chess-outer-list" @mouseup="mouseUpHandler"
      :style="{ transform: rotate ? 'rotate(180deg) ' : '', width: field.getCellsWidth() * 8 + 'px' }">
      <template v-for="rowArr, rowIndex in field.getCells()" :key="rowArr">
        <ul class="row">
          <template v-for="cell, columnIndex in rowArr" :key="cell">

            <CellComponentVue id="bg" :last-turn="field.getLastTurn()"
              :style="rotate ? { transform: 'rotate(180deg)' } : ''" :color-down="field.getColorDown()"
              :solo-play="field.getSoloplay()" :turn="field.getTurn()" :width="field.getCellsWidth()" :cell="cell"
              :data-row="rowIndex" :data-column="columnIndex" />

          </template>
        </ul>
      </template>
    </ul>
    <div class="turn-view">
      <div class="text">{{ turn.slice(0, 1).toUpperCase() + turn.slice(1) }}'s turn</div>
      <div class="color-show" :style="{ backgroundColor: turn }"></div>
    </div>
  </div>
</template>

<style lang="scss">
#bg {
  background-color: rgb(146, 129, 90);
}

html {
  font-size: 16px;
}

.turn-view {
  display: flex;
  border: 5px solid rgb(138, 115, 115);
  padding: 10px;
  align-items: center;
  justify-content: space-around;

  .text {
    font-size: 30px;
    color: rgb(201, 189, 189);
  }

  .color-show {
    width: 200px;
    height: 50px;
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
h6 {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 1rem;
}

body {
  background-color: rgb(110, 103, 103)
}

.chess {
  margin: 0 auto;
  width: fit-content;
}

.chess-outer-list {
  display: flex;
  flex-wrap: wrap;

  .row {
    display: flex;
  }
}
</style>