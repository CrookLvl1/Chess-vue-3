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
export type CurrentComponent = 'initMultiplayerComponent' | 'chessGame';
export type FigureTurnType = 'own' | 'stolen';
export type DrawReason = 'stalemate' | 'seventyFiveMovesRule' | 'threefoldRepeat';
export type GameEndReason = DrawReason | 'checkmate';

export type InfoType = 'turn' | 'playersInfo' | 'leave' | 'surrender' | 'message' | 'userprofileinfo' | 'readMessages' | 'personalroom' | 'roomnotfound';

export interface PossibleTurns {
    'own': Array<Cell>,
    'stolen': Array<Cell>
}


export interface User {
    name: string,
    imgSrc: string,
    borderColor: string
}



export interface Turn {
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
    fromFigureType: ChessFigure,
    toFigureType: ChessFigure | null,
    stolenType: ChessFigure | null,
    type: TurnType,
    figureTurnType: FigureTurnType,
    figure: Figure,
}

export interface TurnInfo {
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
    turnType: TurnType,
    figureTurnType: FigureTurnType,
    figureType: ChessFigure | null,
    stolenType: ChessFigure | null,

};

export interface MessageInfo {
    text: string,
}

export interface Message extends MessageInfo {
    read: boolean,
    currentUserSender: boolean,
    id: number,
    date: Date
}

export interface Settings {
    volume: number,
    langId: LanguageId,
    user: User,

}

export interface PlayersInfo {
    whiteId: number,
    blackId: number,
    yourColor: ChessColor,
    time: number
}

export interface Info {
    info: TurnInfo | PlayersInfo | Message | User | Array<number> | string,
    type: InfoType,
    pingTime?: number
}



export interface Positions {
    [key: number]: Map<Cell, number>
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
