import type {
    ChessFigure, ChessColor, GameSave, Turn, TurnType, CellAttacked,
    DiagonalDirection, LinealDirection, LineDirectionsKey, GameState, MainDirection, PossibleTurns, FigureTurnType, Positions, DrawReason,
} from "./chessTypes&Interfaces";

import { lineDirections } from './chessTypes&Interfaces'


export class Cell {
    constructor(figure: null | Figure, row: number, column: number) {
        this.figure = figure;
        this.row = row;
        this.column = column;
        this.hint = false;
        this.selected = false;
        this.checked = false;

    }

    private figure: Figure | null;
    private row: number;
    private column: number;
    private hint: boolean;
    private selected: boolean;
    private checked: boolean;


    getCoords(): [number, number] {
        return [this.row, this.column];
    }

    setCoords(coords: [number, number]) {
        this.row = coords[0];
        this.column = coords[1];
    }

    getFigure(): Figure | null {
        return this.figure;
    }
    setFigure(figure: Figure | null) {
        this.figure = figure;
    }

    isFree(): boolean {
        return this.figure === null;
    }

    getHint(): boolean {
        return this.hint;
    }
    setHint(value: boolean) {
        this.hint = value;
    }

    isSelected(): boolean {
        return this.selected;
    }
    switchSelected() {
        this.selected = !this.selected;
    }
    getChecked(): boolean {
        return this.checked;
    }
    setChecked(isChecked: boolean) {
        this.checked = isChecked;
    }

}

let figureNextId = 0;
export class Figure {
    constructor(color: ChessColor, type: ChessFigure, stolenType: ChessFigure | null = null) {
        this.color = color;
        this.type = type;
        this.stolenType = stolenType;
        this.id = figureNextId++;
    }

    private color: ChessColor;
    private type: ChessFigure;
    private stolenType: ChessFigure | null;
    private id: number;

    getId(): number {
        return this.id;
    }

    getSrc(): string {
        return `${this.type}${this.color}.png`;
    }
    getColor(): ChessColor {
        return this.color;
    }
    getType(): ChessFigure {
        return this.type;
    }
    getStolenType(): ChessFigure | null {
        return this.stolenType;
    }
    setStolenType(value: ChessFigure | null): void {
        this.stolenType = value;
    }
}
export class CastlingFigure extends Figure {

    constructor(...args: [ChessColor, ChessFigure]) {
        super(...args);
    }

    private moved: boolean = false;

    isMoved(): boolean {
        return this.moved;
    }

    switchMoved() {
        this.moved = true;
    }



}

export class ChessField {
    constructor(soloPlay: boolean, colorDown: ChessColor, loadGame?: GameSave) {
        this.soloPlay = soloPlay;
        this.colorDown = colorDown;


        this.cellsArr = [];
        this.turn = 'white';
        this.lastTurn = null;
        this.turnInt = 0;
        this.kingSecureCells = new Set<Cell>();
        this.blackPositions = {};
        this.whitePositions = {};
        this.whiteThreefoldRepeat = false;
        this.blackThreefoldRepeat = false;
        this.userHandleTurn = false;

        this.whiteKingCell = null;
        this.blackKingCell = null;
        this.whiteKingDefence = null;
        this.blackKingDefence = null;
        this.blackCheck = false;
        this.whiteCheck = false;
        this.whiteFiguresCells = [];
        this.blackFiguresCells = [];
        this.blackKingDefence = null;
        this.whiteKingDefence = null;

        this.directions = {
            diagonal: {
                'top-left': [-1, -1],
                'top-right': [-1, +1],
                'bottom-left': [+1, -1],
                'bottom-right': [+1, +1]
            },
            lineal: {
                'top': [-1, 0],
                'bottom': [1, 0],
                'left': [0, -1],
                'right': [0, 1]
            },
            knight: {
                'top-right-top': [-2, 1],
                'top-right-bottom': [-1, 2],
                'bottom-right-top': [1, 2],
                'bottom-right-bottom': [2, 1],
                'bottom-left-bottom': [2, -1],
                'bottom-left-top': [1, -2],
                'top-left-bottom': [-1, -2],
                'top-left-top': [-2, -1]
            }
        }


        for (let i = 0; i < 8; i++) {
            this.cellsArr.push([]);

            for (let j = 0; j < 8; j++) {

                if (i < 2 || i > 5) {
                    const figureType: ChessFigure = this.initFigureType(i, j);
                    const color: ChessColor = i < 2 ? 'black' : 'white';

                    if (figureType === 'king') {
                        this.cellsArr[i].push(new Cell(
                            new CastlingFigure(color, figureType), i, j
                        ));

                        this[`${color}KingCell`] = this.cellsArr[i][j];
                    }
                    else if (figureType === 'rook') {
                        this.cellsArr[i].push(new Cell(
                            new CastlingFigure(color, figureType), i, j
                        ));

                        this[`${color}FiguresCells`].push(this.cellsArr[i][j]);
                    }
                    else {
                        this.cellsArr[i].push(new Cell(
                            new Figure(color, figureType), i, j
                        ));

                        this[`${color}FiguresCells`].push(this.cellsArr[i][j]);
                    }


                }

                else
                    this.cellsArr[i].push(new Cell(
                        null, i, j
                    ))
            }




        }





        console.log(this.cellsArr)
    }


    private cellsArr: Array<Array<Cell>>;
    private soloPlay: boolean;
    private colorDown: ChessColor;
    private turn: ChessColor;
    private lastTurn: Turn | null;
    private blackPositions: Positions;
    private whitePositions: Positions;
    private whiteKingCell: Cell | null;
    private blackKingCell: Cell | null;
    private whiteFiguresCells: Array<Cell>;
    private blackFiguresCells: Array<Cell>;
    private whiteThreefoldRepeat: boolean;
    private blackThreefoldRepeat: boolean;
    private userHandleTurn: boolean;

    private whiteKingDefence: Array<CellAttacked> | null;
    private blackKingDefence: Array<CellAttacked> | null;
    private kingSecureCells: Set<Cell>;
    private whiteCheck: boolean = false;
    private blackCheck: boolean = false;


    private directions: { [key: string]: { [key: string]: [number, number] } };
    private turnInt: number;

    setUserHandleTurn() {
        this.userHandleTurn = true;
    }

    private initFigureType = (row: number, column: number): ChessFigure => {
        if (row === 2 || row === 6) return 'pawn';
        if (row === 0 || row === 7) {
            switch (column) {
                case 0:
                case 7:
                    return 'rook';

                case 1:
                case 6:
                    return 'knight';

                case 2:
                case 5:
                    return 'bishop';

                case 3:
                    return 'queen';
                case 4:
                    return 'king';
            }
        }

        return 'pawn';
    }


    private filterBy(arr: Array<Cell>, includeTypes: Array<ChessFigure>, allyColor: ChessColor | null): Array<Cell> {
        return arr.filter((cell: Cell) => {
            const figure = cell.getFigure();

            return includeTypes.includes(figure?.getType() as ChessFigure) || includeTypes.includes(figure?.getStolenType() as ChessFigure) && figure?.getColor() !== allyColor;
        })
    }

    calcKingSecure(color: ChessColor) {
        console.log('king SECURE = ', color);
        const arr: Array<CellAttacked> = [];
        const kingCell = this[`${color}KingCell`] as Cell;
        const coords = kingCell.getCoords();

        const enemyColor: ChessColor = color === 'white' ? 'black' : 'white';

        const cellsAroundKing: Array<{ arr: Array<Cell>, mainDirection: MainDirection, direction: LinealDirection | DiagonalDirection }> = [

        ];

        for (const direction in this.directions.lineal) {
            cellsAroundKing.push({
                arr: this.checkDirections({ row: coords[0], column: coords[1], mainDirection: 'lineal', allyColor: enemyColor, checkDirections: [direction as LinealDirection] }),
                mainDirection: 'lineal',
                direction: direction as LinealDirection
            })
        }
        for (const direction in this.directions.diagonal) {
            cellsAroundKing.push({
                arr: this.checkDirections({ row: coords[0], column: coords[1], mainDirection: 'diagonal', allyColor: enemyColor, checkDirections: [direction as DiagonalDirection] }),
                mainDirection: 'diagonal',
                direction: direction as DiagonalDirection
            })
        }


        cellsAroundKing.forEach((cell) => {
            if (cell.arr.length === 0) return;

            const defendingCell: Cell = cell.arr[cell.arr.length - 1];
            const coords = defendingCell.getCoords();
            const menaceCellsArr = this.filterBy(this.checkDirections({ row: coords[0], column: coords[1], allyColor: color, mainDirection: cell.mainDirection, checkDirections: [cell.direction] }),
                ['queen', cell.mainDirection === 'diagonal' ? 'bishop' : 'rook'], color);

            const menaceCell = menaceCellsArr[menaceCellsArr.length - 1];
            if (!menaceCell) return;

            arr.push(
                {
                    cell: defendingCell,
                    direction: cell.direction,
                    mainDirection: cell.mainDirection,
                    attackingCellCoords: menaceCell.getCoords()
                }
            )

        })

        this[`${color}KingDefence`] = arr;

    }

    isCheckMate(color: ChessColor): GameState {
        const kingTurns = this.checkTurns(...(this[`${color}KingCell`] as Cell).getCoords());
        if (kingTurns.own.length > 0 || kingTurns.stolen.length > 0) return 'default';
        const figuresCells = this[`${color}FiguresCells`] as Array<Cell>;

        //king have no cells to retreat
        for (const cell of figuresCells) {

            const turns: PossibleTurns = this.checkTurns(...cell.getCoords());

            for (const turnCell of turns.own) {
                if (this.kingSecureCells.has(turnCell)) return 'default';
            }
            for (const turnCell of turns.stolen) {
                if (this.kingSecureCells.has(turnCell)) return 'default';
            }


        }
        return 'checkmate';
    }

    isDraw(color: ChessColor): [GameState, DrawReason | null] {
        if (this.blackThreefoldRepeat && this.whiteThreefoldRepeat) return ['draw', 'threefoldRepeat'];
        if (this.turnInt > 75) return ['draw', 'seventyFiveMovesRule'];

        const kingTurns = this.checkTurns(...(this[`${color}KingCell`] as Cell).getCoords());
        if (kingTurns.own.length > 0 || kingTurns.stolen.length > 0) return ['default', null];

        for (const cell of this[`${color}FiguresCells`]) {
            const turns: PossibleTurns = this.checkTurns(...cell.getCoords());

            if (turns.own.length > 0 || turns.stolen.length > 0) return ['default', null];
        }

        return ['draw', 'stalemate'];
    }

    private getMenaceCells(row: number, column: number, color: ChessColor, cellsCheck: 'line' | 'knight' | 'all', ESPECIALLYFORKING: boolean = false): Set<Cell> {
        const returnArray = new Set<Cell>();
        const pawnCheckDirections: Array<DiagonalDirection> = color === 'white' ? ['top-left', 'top-right'] : ['bottom-left', 'bottom-right'];

        if (ESPECIALLYFORKING) {
            [
                ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', ignoreTypes: ['king'] }), ['bishop', 'queen'], color),
                ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: pawnCheckDirections, range: 1 }), ['pawn'], color),
                ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal', ignoreTypes: ['king'] }), ['queen', 'rook'], color),
                ...this.filterBy(this.checkKnight(row, column, color), ['knight'], color),
                ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal', range: 1 }), ['king'], color),
                ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', range: 1 }), ['king'], color)
            ].forEach((cell: Cell) => returnArray.add(cell));

            return returnArray;
        }


        switch (cellsCheck) {
            case 'line': {
                [
                    //Проверка диагональных шахов
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal' }), ['bishop', 'queen'], color),
                    //Проверка пешечных шахов
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: pawnCheckDirections, range: 1 }), ['pawn'], color),
                    //Проверка вертикальных и горизонтальных шахов
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal' }), ['queen', 'rook'], color),
                    //Проверка ходов короля
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal', range: 1 }), ['king'], color),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', range: 1 }), ['king'], color)
                ].forEach((cell: Cell) => returnArray.add(cell));

                break;
            }
            case 'knight': {
                //Проверка шахов конём
                this.filterBy(this.checkKnight(row, column, color), ['knight'], color)
                    .forEach((cell: Cell) => returnArray.add(cell));
                break;
            }
            case 'all': {
                [
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal' }), ['bishop', 'queen'], color),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: pawnCheckDirections, range: 1 }), ['pawn'], color),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal' }), ['queen', 'rook'], color),
                    ...this.filterBy(this.checkKnight(row, column, color), ['knight'], color),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal', range: 1 }), ['king'], color),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', range: 1 }), ['king'], color)
                ].forEach((cell: Cell) => returnArray.add(cell))
                break;
            }

        }

        return returnArray;
    }

    checkKingMenaces(color: ChessColor): boolean {
        const coords: [number, number] = (this[`${color}KingCell`] as Cell).getCoords();
        const row = coords[0], column = coords[1];
        let result: boolean = false;


        const kingMenaceCellsLine: Set<Cell> = this.getMenaceCells(row, column, color, 'line');
        const kingMenaceCellsKnight: Set<Cell> = this.getMenaceCells(row, column, color, 'knight')
        const enemyColor: ChessColor = color === 'white' ? 'black' : 'white';

        this[`${enemyColor}Check`] = false;
        this[`${enemyColor}KingCell`]?.setChecked(false);

        if (kingMenaceCellsKnight.size + kingMenaceCellsLine.size > 1) {
            result = true;
            this.kingSecureCells.clear();

            this[`${color}Check`] = true;
            this[`${color}KingCell`]?.setChecked(true);
            return true;
        }

        if (kingMenaceCellsLine.size > 0 || kingMenaceCellsKnight.size > 0) {
            result = true;
            this.kingSecureCells.clear()

            this[`${color}Check`] = true;
            this[`${color}KingCell`]?.setChecked(true);

            //bgColor of color king cell

            if (kingMenaceCellsLine.size > 0) {
                for (const cell of kingMenaceCellsLine) {
                    let [attackRow, attackColumn] = cell.getCoords();

                    let temp: [number, number] = [attackRow - row, attackColumn - column];
                    let direction: MainDirection;
                    let checkDirection: LinealDirection | DiagonalDirection;
                    let divideNumber: number;

                    if (temp[0] === 0) {
                        direction = 'lineal';
                        divideNumber = Math.abs(temp[1]);
                    } else if (temp[1] === 0) {
                        direction = 'lineal'
                        divideNumber = Math.abs(temp[0]);
                    } else {
                        direction = 'diagonal';
                        divideNumber = Math.abs(temp[0]);
                    }
                    checkDirection = lineDirections[
                        (temp
                            .map(value => value / divideNumber)
                            .join(' ') as LineDirectionsKey)
                    ];

                    this.checkDirections({ row, column, allyColor: color, mainDirection: direction, checkDirections: [checkDirection] }).forEach((cell: Cell) => this.kingSecureCells.add(cell));

                }
            }

            if (kingMenaceCellsKnight.size > 0) {
                for (const cell of kingMenaceCellsKnight) {
                    this.kingSecureCells.add(cell);
                }
            }

        }

        else {
            this.kingSecureCells.clear();

            this[`${color}Check`] = false;
            this[`${color}KingCell`]?.setChecked(false);
        }




        return result;
    }

    getLastTurn(): Turn | null {
        return this.lastTurn;
    }

    getCell(row: number, column: number): Cell {
        return this.cellsArr[row][column];
    }

    getCells(): Array<Array<Cell>> {
        return this.cellsArr;
    }


    getFilteredCells(busy: boolean): Array<Cell> {
        const returnArray: Array<Cell> = [];

        if (busy) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (!this.cellsArr[i][j].isFree())
                        returnArray.push(this.cellsArr[i][j]);
                }
            }
            return returnArray;
        }
        else {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (this.cellsArr[i][j].isFree())
                        returnArray.push(this.cellsArr[i][j]);
                }
            }
        }
        return returnArray;
    }


    getSoloplay(): boolean {
        return this.soloPlay;
    }

    getColorDown(): ChessColor {
        return this.colorDown;
    }

    getTurn(): ChessColor {
        return this.turn;
    }

    switchTurn() {
        this.turn = this.turn === 'white' ? 'black' : 'white';

    }

    isPawnLongMove(fromRow: number, toRow: number, figure: Figure, figureTurnType: FigureTurnType): boolean {
        const color = figure.getColor();
        return (figure.getType() === 'pawn' && figureTurnType === 'own' ||
            figure.getStolenType() === 'pawn' && figureTurnType === 'stolen') &&
            (color === 'white' && fromRow === 6 || color === 'black' && fromRow === 1) &&
            Math.abs(fromRow - toRow) === 2;
    }

    getTurnType(fromRow: number, fromColumn: number, toRow: number, toColumn: number, figureTurnType: FigureTurnType): TurnType {
        //turn is not done yet
        const fromCell: Cell = this.cellsArr[fromRow][fromColumn];
        const toCell: Cell = this.cellsArr[toRow][toColumn];


        const fromFigureType = fromCell.getFigure()?.getType() as ChessFigure;
        const fromFigureStolenType = fromCell.getFigure()?.getStolenType() as ChessFigure | null;

        const columnDifference = Math.abs(toColumn - fromColumn);
        if (fromFigureType === 'king' && columnDifference === 2 && figureTurnType === 'own')
            return 'castling';


        const result = !!(this.lastTurn && (this.lastTurn.figure.getStolenType() === 'pawn' || this.lastTurn.figure.getType() === 'pawn') && columnDifference === 1 &&
            this.isPawnLongMove(this.lastTurn.fromRow, this.lastTurn.toRow, this.lastTurn.figure, this.lastTurn.figureTurnType) &&
            toRow === (this.lastTurn.fromRow + this.lastTurn.toRow) / 2 && toCell.isFree() &&
            (fromFigureType === 'pawn' && figureTurnType === 'own' || fromFigureStolenType === 'pawn' && figureTurnType === 'stolen'));


        if (result) return 'en passant';

        return 'default';
    }

    updateCell(row: number, column: number, color: ChessColor, newCell?: Cell) {
        const arr: Array<Cell> = this[`${color}FiguresCells`];
        const currentCell: Cell = this.cellsArr[row][column];
        currentCell.setFigure(null);
        arr.splice(
            arr.findIndex((cell: Cell) => currentCell === cell), 1
        );
        if (newCell) arr.push(newCell)
    }
    private oppositeDirection(direction: LinealDirection | DiagonalDirection): LinealDirection | DiagonalDirection {
        switch (direction) {
            case 'bottom': return 'top';
            case 'top': return 'bottom';
            case 'left': return 'right';
            case 'right': return 'left';
            case 'bottom-left': return 'top-right';
            case 'bottom-right': return 'top-left';
            case 'top-left': return 'bottom-right';
            case 'top-right': return 'bottom-left';
        }

    }

    isStealAvailable(figureType: ChessFigure, stealType: ChessFigure): boolean {
        console.log('is Steal AVailable = ', figureType, stealType)
        if (figureType === stealType) return false;

        switch (figureType) {
            case 'queen':
                return stealType !== 'bishop' && stealType !== 'rook';

            default: return true;
        }
    }

    updateStolenType(type: ChessFigure) {
        (this.lastTurn as Turn).stolenType = type;
    }

    private checkThreefoldRepeat(color: ChessColor, figure: Figure, toCell: Cell) {
        if (!this[`${color}ThreefoldRepeat`]) {
            const figureId: number = figure.getId();
            const positions: Positions = this[`${color}Positions`];

            if (!positions[figureId]) positions[figureId] = new Map<Cell, number>();
            const positionsMap = positions[figureId];

            const value = (positionsMap.get(toCell) || 0) + 1;
            if (value >= 3)
                this[`${color}ThreefoldRepeat`] = true;
            else positionsMap.set(toCell, value)
        }
    }



    //RETURN TRUE IF PAWN IS ON THE EDGE OF THE BOARD AFTER MOVE AND FALSE IF IT DOESN'T
    //Взятие на проходе как то сделать ащ ас иду спать )0
    moveFigure(fromRow: number, fromColumn: number, toRow: number, toColumn: number, turnType: TurnType, figureTurnType: FigureTurnType, updateLastTurn: boolean = true): boolean {
        const tmpFrom: Cell = this.cellsArr[fromRow][fromColumn];
        const figure = tmpFrom.getFigure() as Figure;
        const color: ChessColor = figure.getColor();

        const toCell: Cell = this.cellsArr[toRow][toColumn];


        this.checkThreefoldRepeat(color, figure, toCell);


        console.log('move Figure = ', fromRow, fromColumn, toRow, toColumn, this.cellsArr[fromRow][fromColumn], this.cellsArr[toRow][toColumn]);

        const enemyColor: ChessColor = color === 'white' ? 'black' : 'white';


        // const turnType: TurnType = this.getTurnType(fromRow, fromColumn, toRow, toColumn);





        const fromType: ChessFigure = figure.getType();
        const toCellFigure: Figure | null = toCell.getFigure() || null;
        const toType: ChessFigure | null = toCellFigure?.getType() || null;


        const toCellCoords: null | [number, number] = toCell.isFree() ? null : toCell.getCoords();

        if (toCellCoords) {
            this.turnInt = 0;

            this.updateCell(...toCellCoords, enemyColor);
        }

        if (fromType === 'pawn')
            this.turnInt = 0;

        toCell.setFigure(tmpFrom.getFigure());
        this.cellsArr[fromRow][fromColumn].setFigure(null);

        switch (turnType) {
            case 'castling': {
                const rookColumn: number = toColumn > fromColumn ? 7 : 0;
                this.moveFigure(fromRow, rookColumn, fromRow, rookColumn === 0 ? 3 : 5, 'default', figureTurnType, false);
                break;
            }

            case 'en passant': {
                this.updateCell(fromRow, toColumn, enemyColor);
                break;
            }
        }


        if (fromType === 'king') {
            this.cellsArr[fromRow][fromColumn].setChecked(false);
            this[`${color}Check`] = false;

            this[`${color}KingCell`] = toCell;
            (this[`${color}KingCell`]?.getFigure() as CastlingFigure).switchMoved();

        }
        else
            this.updateCell(fromRow, fromColumn, color, toCell);


        if (fromType === 'rook')
            (figure as CastlingFigure).switchMoved();



        if (updateLastTurn) {
            this.lastTurn = {
                fromRow,
                fromColumn,
                toRow,
                toColumn,
                figureTurnType,
                fromFigureType: fromType,
                toFigureType: toType,
                type: turnType,
                figure: new Figure(color, fromType, figure.getStolenType()),
                stolenType: null
            }
            this.turnInt++;
        }

        if (figureTurnType === 'stolen') toCell.getFigure()?.setStolenType(null);

        // if pawn moved or enemy piece has been eaten



        if (fromType === 'pawn' && toRow === (color === 'white' ? 0 : 7) && (this.soloPlay || this.turn === this.colorDown)) return true;

        return false;
    }




    transformFigure(row: number, column: number, color: ChessColor, type: ChessFigure, addtitionalType: ChessFigure | null = null) {
        const stealAvailable: boolean = !!addtitionalType && this.isStealAvailable(type, addtitionalType);

        this.cellsArr[row][column].setFigure(
            new Figure(color, type, stealAvailable ? addtitionalType : null)
        )
    }

    private isBusyByColor(row: number, column: number, color: ChessColor): boolean {
        return !this.cellsArr[row][column].isFree() && this.cellsArr[row][column].getFigure()?.getColor() === color;
    }

    private isInField(row: number, column: number): boolean {
        return row >= 0 && row <= 7 && column >= 0 && column <= 7;
    }

    //ignoreTypes - array with types of figures that should be ignored 
    private checkDirections({ row, column, allyColor, mainDirection, checkDirections, range = 100, ignoreTypes }:
        {
            row: number; column: number; allyColor: ChessColor; mainDirection: MainDirection; checkDirections?: Array<DiagonalDirection | LinealDirection>;
            range?: number; ignoreTypes?: Array<ChessFigure>;
        }): Array<Cell> {

        const returnArray: Array<Cell> = [];
        const directions = this.directions[mainDirection];

        //Направление диагонали
        for (let directionKey in directions) {
            //if checkDirections is defined and direction key is not in checkDirections then skip cycle
            if (checkDirections && !checkDirections.includes(directionKey as DiagonalDirection | LinealDirection)) continue;

            let tempRange = range;

            const additions = directions[directionKey];

            let tempRow = row + additions[0],
                tempColumn = column + additions[1];


            //Diagonal || Horizontal || Vertical : Check
            while (this.isInField(tempRow, tempColumn) && tempRange > 0) {
                const tempCell = this.cellsArr[tempRow][tempColumn];
                if (!tempCell.isFree() && !ignoreTypes?.includes((tempCell.getFigure() as Figure).getType())) {
                    if (this.isBusyByColor(tempRow, tempColumn, allyColor)) break;

                    returnArray.push(this.cellsArr[tempRow][tempColumn]);
                    break;
                }

                returnArray.push(this.cellsArr[tempRow][tempColumn]);
                tempRange--;
                tempRow += additions[0];
                tempColumn += additions[1];
            }

        }

        return returnArray;
    }


    private checkPawn(row: number, column: number, allyColor: ChessColor): Array<Cell> {
        const returnArray: Array<Cell> = [];
        let addition: number,
            range: number,
            diagonalcheck: Array<DiagonalDirection>;

        if (allyColor === 'white') {
            addition = -1;
            range = row === 6 ? 2 : 1;
            diagonalcheck = ['top-right', 'top-left'];
        }
        else {
            addition = 1;
            range = row === 1 ? 2 : 1;
            diagonalcheck = ['bottom-left', 'bottom-right']
        }

        let tempRow = row + addition;

        while (range > 0 && this.isInField(tempRow, column) && this.cellsArr[tempRow][column].isFree()) {
            returnArray.push(this.cellsArr[tempRow][column]);
            tempRow += addition;
            range--;
        }

        returnArray.push(
            ...this.checkDirections({ row, column, allyColor, mainDirection: 'diagonal', checkDirections: diagonalcheck, range: 1 })
                .filter((cell: Cell) => !cell.isFree())
        );


        return returnArray;
    }

    private checkKnight(row: number, column: number, allyColor: ChessColor): Array<Cell> {
        const returnArray: Array<Cell> = [];
        const knightAdditions = this.directions.knight;

        for (let directionKey in knightAdditions) {
            const additions = knightAdditions[directionKey];

            const checkRow = row + additions[0],
                checkColumn = column + additions[1];

            if (!this.isInField(checkRow, checkColumn) || this.isBusyByColor(checkRow, checkColumn, allyColor)) continue;

            returnArray.push(this.cellsArr[checkRow][checkColumn]);
        }

        return returnArray;
    }

    checkKingTurns(allyColor: ChessColor): Array<Cell> {
        const returnArray: Array<Cell> = [];
        const kingCell = this[`${allyColor}KingCell`] as Cell;
        const [row, column] = kingCell.getCoords() as [number, number];



        returnArray.push(
            ...this.checkDirections({ row, column, allyColor, mainDirection: 'diagonal', range: 1 }),
            ...this.checkDirections({ row, column, allyColor, mainDirection: 'lineal', range: 1 })
        )

        if (!kingCell.getChecked() && !(kingCell.getFigure() as CastlingFigure).isMoved()) {
            const rooksCells: Array<Cell> = this.filterBy(
                this.checkDirections({
                    row,
                    column,
                    allyColor: allyColor === 'white' ? 'black' : 'white',
                    mainDirection: 'lineal',
                    checkDirections: ['left', 'right']
                }), ['rook'], allyColor
            );


            if (rooksCells.length > 0) {
                rooksCells.forEach((rookCell: Cell) => {
                    //return inside foreach
                    if ((rookCell.getFigure() as CastlingFigure).isMoved()) return;

                    const rookCoords = rookCell.getCoords();
                    const rookPossibleTurns: Array<Cell> = this.checkDirections({
                        row: rookCoords[0],
                        column: rookCoords[1],
                        allyColor,
                        mainDirection: 'lineal',
                        checkDirections: [rookCoords[1] === 0 ? 'right' : 'left']
                    })

                    for (const cell of rookPossibleTurns) {
                        const coords = cell.getCoords();
                        if (this.getMenaceCells(coords[0], coords[1], allyColor, 'all').size > 0) return;
                    }

                    returnArray.push(this.cellsArr[row][
                        column + (
                            rookCell.getCoords()[1] === 0 ? -2 : 2
                        )
                    ])
                })
            }
        }


        return returnArray.filter((cell: Cell) => {
            const [row, column] = cell.getCoords();
            return this.getMenaceCells(row, column, allyColor, 'all', true).size === 0;
        })

    }

    private checkTurnsType(row: number, column: number, figureColor: ChessColor, figureType: ChessFigure): Array<Cell> {
        let returnArray: Array<Cell> = [];
        const cell = this.cellsArr[row][column];

        switch (figureType) {
            case 'pawn': {
                returnArray.push(...this.checkPawn(row, column, figureColor));

                //if last turn exist and figure in last turn that moved was pawn and it's row equals current pawn row and last turn pawn did 2 cell turn and current column is left (-1) or right(+1) from last turn pawn colummn 
                //en passant for other figures
                if (this.lastTurn && this.lastTurn.type === 'default' &&
                    (this.lastTurn.figure.getType() === 'pawn' && this.lastTurn.figureTurnType === 'own' || this.lastTurn.figure.getStolenType() === 'pawn' && this.lastTurn.figureTurnType === 'stolen') &&
                    Math.abs(this.lastTurn.toRow - this.lastTurn.fromRow) === 2 &&
                    row === this.lastTurn.toRow && (this.lastTurn.fromColumn + 1 === column || this.lastTurn.fromColumn - 1 === column)
                ) {
                    returnArray.push(this.cellsArr[(this.lastTurn.fromRow + this.lastTurn.toRow) / 2][this.lastTurn.fromColumn]);
                }

                break;
            }
            case 'rook': {
                returnArray.push(
                    ...this.checkDirections({ row, column, allyColor: figureColor, mainDirection: 'lineal' })
                );

                break;
            }
            case 'knight': {
                returnArray.push(
                    ...this.checkKnight(row, column, figureColor)
                );
                break;
            }
            case 'bishop': {
                returnArray.push(
                    ...this.checkDirections({ row, column, allyColor: figureColor, mainDirection: 'diagonal' })
                );
                break;
            }

            case 'queen': {
                returnArray.push(
                    ...this.checkDirections({ row, column, allyColor: figureColor, mainDirection: 'diagonal' }),
                    ...this.checkDirections({ row, column, allyColor: figureColor, mainDirection: 'lineal' })
                );
                break;
            }
            case 'king': {
                returnArray.push(
                    ...this.checkKingTurns(figureColor)
                )
                break;
            }
        }
        const KingDefenceArr: Array<CellAttacked> | null = this[`${figureColor}KingDefence`];

        if (KingDefenceArr && (KingDefenceArr.length > 0)) {
            const attackedCellObj: CellAttacked | undefined = KingDefenceArr?.find((cellAttacked: CellAttacked) =>
                cellAttacked.cell === cell)
            if (attackedCellObj) {
                const possibleTurns = [
                    ...this.checkDirections({
                        row,
                        column,
                        allyColor: figureColor,
                        mainDirection: attackedCellObj.mainDirection,
                        checkDirections: [attackedCellObj.direction]
                    }),
                    ...this.checkDirections({
                        row,
                        column,
                        allyColor: figureColor,
                        mainDirection: attackedCellObj.mainDirection,
                        checkDirections: [this.oppositeDirection(attackedCellObj.direction)]
                    })
                ]
                returnArray = returnArray.filter((possibleTurn: Cell) =>
                    possibleTurns.includes(possibleTurn)
                )
            }

        }

        return returnArray;
    }

    eatFigure(row: number, column: number) {
        this.updateCell(row, column, (this.cellsArr[row][column].getFigure() as Figure)?.getColor());
        this.cellsArr[row][column].setFigure(null);
    }

    checkTurns(row: number, column: number): PossibleTurns {
        const figure = this.cellsArr[row][column].getFigure() as Figure;

        const figureColor: ChessColor = figure.getColor();
        const mainFigureType: ChessFigure = figure.getType();
        const stolenFigureType: ChessFigure | null = figure.getStolenType();




        const turns = {
            own:
                this.checkTurnsType(row, column, figureColor, mainFigureType)
            ,
            stolen: stolenFigureType ?
                this.checkTurnsType(row, column, figureColor, stolenFigureType) :
                []
        };

        if (mainFigureType === 'king') {
            turns.stolen = turns.stolen.filter((possibleTurn: Cell) =>
                this.getMenaceCells(...possibleTurn.getCoords(), figure.getColor(), 'all', true).size === 0);

            if (stolenFigureType === 'pawn') {
                const addition: number = figureColor === 'white' ? -1 : 1;
                if (addition === -1 && row === 6 || addition === 1 && row === 1) {
                    const enPassantKingMenace = [
                        this.cellsArr[row + addition * 2][column - 1],
                        this.cellsArr[row + addition * 2][column + 1]]
                        .filter((cell: Cell) => {
                            const figure: Figure | null = cell.getFigure();
                            return figure?.getType() === 'pawn' && figure.getStolenType() === 'pawn'
                        });

                    turns.stolen = turns.stolen.filter((cell: Cell) => enPassantKingMenace.includes(cell));
                }


            }
        }

        //if current figure is not a king && current player got checked 
        else if (this[`${figureColor}Check`]) {
            turns.own = turns.own.filter((cell: Cell) => this.kingSecureCells.has(cell));
            turns.stolen = turns.stolen.filter((cell: Cell) => this.kingSecureCells.has(cell));
        }

        console.log("TURNS = ", turns);


        return turns;
    }

    getHints(row: number, column: number): PossibleTurns {
        return this.checkTurns(row, column);
    }

    private reloadGame() {

    }

    exportGame() {

    }
}

//done transform figure
//getHint && getTurns


//king check done to check
//menaces check done to check
//en passant check need to check