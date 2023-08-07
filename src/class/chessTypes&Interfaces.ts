export interface LanguageStrings {
    [key: string]: string,
}

export type LanguageId = 'ru' | 'eng';


import { Cell, Figure } from "./chess";

export type ChessColor = 'white' | 'black';
export type ChessFigure = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn';
export type LinealDirection = 'top' | 'left' | 'bottom' | 'right';
export type DiagonalDirection = 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right';
export type KnightDirection = 'top-right-top' | 'top-right-bottom' | 'top-left-top' | 'top-left-bottom' | 'bottom-right-top' | 'bottom-right-bottom' | 'bottom-left-top' | 'bottom-left-bottom';
export type CellColor = '#7c573e' | '#908782' | '#b18f4f' | '#90955a' | '#ef6161' | '#d17363'; //
export type TurnType = 'default' | 'en passant' | 'castling';
export type GameState = 'default' | 'checkmate' | 'draw';
export type GameEndState = 'lose' | 'win';
export type MainDirection = 'lineal' | 'diagonal';
export type CellsArrays = Record<ChessColor, Array<Cell>>;

export type InfoType = 'turn' | 'playersInfo' | 'leave';
export interface TurnInfo {
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
    figureType: ChessFigure | null
};

export interface Info {
    info: TurnInfo | number | PlayersInfo,
    type: InfoType
}
export interface PlayersInfo {
    whiteId: number,
    blackId: number,
    yourColor: ChessColor,
    startTime: number
}




export enum lineDirections {
    '-1 0' = 'top',
    '0 -1' = 'left',
    '0 1' = 'right',
    '1 0' = 'bottom',
    '-1 1' = 'top-right',
    '-1 -1' = 'top-left',
    '1 1' = 'bottom-right',
    '1 -1' = 'bottom-left',
}
export enum knightDirections {
    '-2 1' = 'top-right-top',
    '-1 2' = 'top-right-bottom',
    '-2 -1' = 'top-left-top',
    '-1 -2' = 'top-left-bottom',
    '1 -2' = 'bottom-left-top',
    '2 -1' = 'bottom-left-bottom',
    '1 2' = 'bottom-right-top',
    '2 1' = 'bottom-right-bottom'
}

export type LineDirectionsKey = keyof typeof lineDirections;


export interface CellAttacked {
    direction: LinealDirection | DiagonalDirection,
    mainDirection: MainDirection,
    cell: Cell,
    attackingCellCoords: [number, number]
}

export interface Timer {
    time: number,
    interval: (ReturnType<typeof setInterval>)
}

export interface Turn {
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
    type: TurnType,
    figure: Figure,

}

export interface GameSave {
    downColor: ChessColor,
    lastTurn: Turn,
    turn: ChessColor,
    figures: {
        [key: string]: {
            figure: Figure,
            coords: [number, number]
        }
    },
}
