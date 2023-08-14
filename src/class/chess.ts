import type {
    ChessFigure, ChessColor, GameSave, Turn, TurnType, CellAttacked,
    DiagonalDirection, LinealDirection, LineDirectionsKey, GameState, MainDirection,
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
    switchHint() {
        this.hint = !this.hint;
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

export class Figure {
    constructor(color: ChessColor, type: ChessFigure, stolenType: ChessFigure | null = null) {
        this.color = color;
        this.type = type;

        this.stolenType = stolenType;
    }

    private color: ChessColor;
    private type: ChessFigure;
    private stolenType: ChessFigure | null;

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
    setStolenType(value: ChessFigure): void {
        this.stolenType = value;
    }
}

export class King extends Figure {
    constructor(...args: [ChessColor, ChessFigure]) {
        super(...args)
    }

    private moved: boolean = false;
    isMoved(): boolean {
        return this.moved;
    }
    switchMoved() {
        this.moved = true;
    }
}

export class Rook extends Figure {

    constructor(...args: [ChessColor, ChessFigure]) {
        super(...args);
    }

    private moved: boolean = false;

    isMoved(): boolean {
        return this.moved;
    }

    switchMove() {
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
        this.lastTurns = [];
        this.turnInt = 0;
        this.kingSecureCells = null;

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
                            new King(color, figureType), i, j
                        ));

                        this[`${color}KingCell`] = this.cellsArr[i][j];
                    }
                    else if (figureType === 'rook') {
                        this.cellsArr[i].push(new Cell(
                            new Rook(color, figureType), i, j
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
    private lastTurns: Array<Turn>;
    private whiteKingCell: Cell | null;
    private blackKingCell: Cell | null;
    private whiteFiguresCells: Array<Cell>;
    private blackFiguresCells: Array<Cell>;

    private whiteKingDefence: Array<CellAttacked> | null;
    private blackKingDefence: Array<CellAttacked> | null;
    private kingSecureCells: Array<Cell> | null;
    private whiteCheck: boolean = false;
    private blackCheck: boolean = false;


    private directions: { [key: string]: { [key: string]: [number, number] } };
    private turnInt: number;

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


    private filterBy(arr: Array<Cell>, includeTypes: Array<ChessFigure>): Array<Cell> {
        return arr.filter((cell: Cell) =>
            includeTypes.includes(cell.getFigure()?.getType() as ChessFigure)
        )
    }

    calcKingSecure(color: ChessColor) {
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
                ['queen', cell.mainDirection === 'diagonal' ? 'bishop' : 'rook']);

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
        if (this.checkKingTurns(color).length > 0) return 'default';


        for (const cell of this[`${color}FiguresCells`]) {

            const turns: Array<Cell> = this.checkTurns(...cell.getCoords());
            for (const turnCell of turns) {
                if (this.kingSecureCells?.includes(turnCell)) return 'default';
            }
        }
        return 'checkmate';
    }

    isDraw(color: ChessColor): GameState {
        if (this.turnInt >= 50) return 'draw';
        if (this.checkKingTurns(color).length > 0) return 'default';

        for (const cell of this[`${color}FiguresCells`]) {
            const coords = cell.getCoords();
            if (this.checkTurns(...coords).length > 0) return 'default';
        }

        return 'draw';
    }

    private getMenaceCells(row: number, column: number, color: ChessColor, cellsCheck: 'line' | 'knight' | 'all', ESPECIALLYFORKING: boolean = false): Array<Cell> {
        const pawnCheckDirections: Array<DiagonalDirection> = color === 'white' ? ['top-left', 'top-right'] : ['bottom-left', 'bottom-right'];
        if (ESPECIALLYFORKING) return [
            ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', ignoreTypes: ['king'] }), ['bishop', 'queen']),
            ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: pawnCheckDirections, range: 1 }), ['pawn']),
            ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal', ignoreTypes: ['king'] }), ['queen', 'rook']),
            ...this.filterBy(this.checkKnight(row, column, color), ['knight']),
            ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal', checkDirections: undefined, range: 1 }), ['king']),
            ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: undefined, range: 1 }), ['king'])
        ];

        const returnArray: Array<Cell> = [];

        switch (cellsCheck) {
            case 'line': {
                returnArray.push(
                    //Проверка диагональных шахов
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal' }), ['bishop', 'queen']),
                    //Проверка пешечных шахов
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: pawnCheckDirections, range: 1 }), ['pawn']),
                    //Проверка вертикальных и горизонтальных шахов
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal' }), ['queen', 'rook']),
                    //Проверка ходов короля
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal', checkDirections: undefined, range: 1 }), ['king']),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: undefined, range: 1 }), ['king'])
                );

                break;
            }
            case 'knight': {
                returnArray.push(
                    //Проверка шахов конём
                    ...this.filterBy(this.checkKnight(row, column, color), ['knight'])
                )
                break;
            }
            case 'all': {
                returnArray.push(
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal' }), ['bishop', 'queen']),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: pawnCheckDirections, range: 1 }), ['pawn']),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal' }), ['queen', 'rook']),
                    ...this.filterBy(this.checkKnight(row, column, color), ['knight']),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'lineal', checkDirections: undefined, range: 1 }), ['king']),
                    ...this.filterBy(this.checkDirections({ row, column, allyColor: color, mainDirection: 'diagonal', checkDirections: undefined, range: 1 }), ['king'])
                );
            }

        }

        return returnArray;
    }

    checkKingMenaces(color: ChessColor): boolean {
        const coords: [number, number] = (this[`${color}KingCell`] as Cell).getCoords();
        const row = coords[0], column = coords[1];
        let result: boolean = false;

        const kingMenaceCellsLine: Array<Cell> = this.getMenaceCells(row, column, color, 'line');
        const kingMenaceCellsKnight: Array<Cell> = this.getMenaceCells(row, column, color, 'knight')
        const enemyColor: ChessColor = color === 'white' ? 'black' : 'white';
        
        this[`${enemyColor}Check`] = false;
        this[`${enemyColor}KingCell`]?.setChecked(false);

        if (kingMenaceCellsKnight.length + kingMenaceCellsLine.length > 1) {
            result = true;
            this.kingSecureCells = [];

            this[`${color}Check`] = true;
            this[`${color}KingCell`]?.setChecked(true);
            return true;
        }

        if (kingMenaceCellsLine.length > 0 || kingMenaceCellsKnight.length > 0) {
            result = true;
            this.kingSecureCells = [];

            this[`${color}Check`] = true;
            this[`${color}KingCell`]?.setChecked(true);

            //bgColor of color king cell

            if (kingMenaceCellsLine.length > 0) {
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

                    this.kingSecureCells.push(
                        ...this.checkDirections({ row, column, allyColor: color, mainDirection: direction, checkDirections: [checkDirection] })
                    )

                }
            }

            if (kingMenaceCellsKnight.length > 0) {
                for (const cell of kingMenaceCellsKnight) {
                    this.kingSecureCells.push(cell);
                }
            }

        }

        else {
            this.kingSecureCells = null;

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

    private pushTurns(turn: Turn) {
        this.lastTurns.push(turn);
        if (this.lastTurns.length > 3) this.lastTurns.splice(0, 1);
    }

    switchTurn() {
        this.turn = this.turn === 'white' ? 'black' : 'white';
    }

    private getTurnType(fromRow: number, fromColumn: number, toRow: number, toColumn: number): TurnType {
        const fromCell: Cell = this.cellsArr[fromRow][fromColumn];
        const toCell: Cell = this.cellsArr[toRow][toColumn];

        const fromFigureType = fromCell.getFigure()?.getType() as ChessFigure;
        if (fromFigureType === 'king' && Math.abs(toColumn - fromColumn) === 2)
            return 'castling';

        else if (fromFigureType === 'pawn' && !(fromColumn === toColumn) && toCell.isFree())
            return 'en passant';


        return 'default';
    }

    private updateCell(fromRow: number, fromColumn: number, color: ChessColor, newCell?: Cell) {
        const arr: Array<Cell> = this[`${color}FiguresCells`];
        arr.splice(
            arr.findIndex((cell: Cell) => {
                const [checkRow, checkColumn] = cell.getCoords();
                return (checkRow === fromRow && checkColumn === fromColumn);
            }), 1
        )
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



    //Взятие на проходе как то сделать ащ ас иду спать )0
    moveFigure(fromRow: number, fromColumn: number, toRow: number, toColumn: number, updateLastTurn: boolean = true): boolean {
        const tmpFrom: Cell = this.cellsArr[fromRow][fromColumn];
        console.log('move Figure = ', fromRow, fromColumn, toRow, toColumn, this.cellsArr[fromRow][fromColumn], this.cellsArr[toRow][toColumn]);
        const figure = tmpFrom.getFigure() as Figure;
        const color: ChessColor = figure.getColor();
        const enemyColor: ChessColor = color === 'white' ? 'black' : 'white';


        const turnType: TurnType = this.getTurnType(fromRow, fromColumn, toRow, toColumn);



        const toCellCoords: null | [number, number] = this.cellsArr[toRow][toColumn].isFree() ? null : this.cellsArr[toRow][toColumn].getCoords();


        this.cellsArr[toRow][toColumn].setFigure(tmpFrom.getFigure());
        this.cellsArr[fromRow][fromColumn].setFigure(null);

        switch (turnType) {
            case 'castling': {
                const rookColumn: number = toColumn > fromColumn ? 7 : 0;
                this.moveFigure(fromRow, rookColumn, fromRow, rookColumn === 0 ? 3 : 5, false);
                break;
            }

            case 'en passant': {
                this.cellsArr[fromRow][toColumn].setFigure(null);
                this.updateCell(fromRow, toColumn, enemyColor);
                break;
            }
        }


        if (figure.getType() === 'king') {
            this.cellsArr[fromRow][fromColumn].setChecked(false);
            this[`${color}Check`] = false;

            this[`${color}KingCell`] = this.cellsArr[toRow][toColumn];
            (this[`${color}KingCell`]?.getFigure() as King).switchMoved();

        }
        else
            this.updateCell(fromRow, fromColumn, color, this.cellsArr[toRow][toColumn]);


        if (figure.getType() === 'rook')
            (figure as Rook).switchMove();

        if (toCellCoords)
            this.updateCell(toCellCoords[0], toCellCoords[1], enemyColor)


        if (updateLastTurn) {
            this.lastTurn = {
                fromRow,
                fromColumn,
                toRow,
                toColumn,
                type: turnType,
                figure: figure as Figure | King | Rook,
            }
            this.turnInt++;
        }
        if (figure.getType() === 'pawn' || toCellCoords)
            this.turnInt = 0;


        if (figure.getType() === 'pawn' && toRow === (color === 'white' ? 0 : 7) && (this.soloPlay || this.turn === this.colorDown)) return true;

        return false;
    }

    transformFigure(row: number, column: number, color: ChessColor, type: ChessFigure) {
        this.cellsArr[row][column].setFigure(
            new Figure(color, type)
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
            //if checkDirections is not undefined and direction key is not in checkDirections then skip cycle
            if (checkDirections && !checkDirections.includes(directionKey as DiagonalDirection | LinealDirection)) continue;

            let tempRange = range;

            const additions = directions[directionKey];

            let tempRow = row + additions[0],
                tempColumn = column + additions[1];


            //Diagonal || Horizontal || Vertical : Check
            while (this.isInField(tempRow, tempColumn) && tempRange > 0) {

                if (!this.cellsArr[tempRow][tempColumn].isFree() && !ignoreTypes?.includes((this.cellsArr[tempRow][tempColumn].getFigure() as Figure).getType())) {
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
            ...this.checkDirections({ row, column, allyColor, mainDirection: 'diagonal', checkDirections: undefined, range: 1 }),
            ...this.checkDirections({ row, column, allyColor, mainDirection: 'lineal', checkDirections: undefined, range: 1 })
        )

        if (!kingCell.getChecked() && !(kingCell.getFigure() as King).isMoved()) {
            const rooksCells: Array<Cell> = this.filterBy(
                this.checkDirections({
                    row,
                    column,
                    allyColor: allyColor === 'white' ? 'black' : 'white',
                    mainDirection: 'lineal',
                    checkDirections: ['left', 'right']
                }), ['rook']
            );


            if (rooksCells.length > 0) {
                rooksCells.forEach((rookCell: Cell) => {
                    //return inside foreach
                    if ((rookCell.getFigure() as Rook).isMoved()) return;

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
                        if (this.getMenaceCells(coords[0], coords[1], allyColor, 'all').length > 0) return;
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
            return this.getMenaceCells(row, column, allyColor, 'all', true).length === 0;
        })

    }

    checkTurns(row: number, column: number): Array<Cell> {
        let returnArray: Array<Cell> = [];
        const cell = this.cellsArr[row][column];

        const figure = cell.getFigure() as Figure;
        const figureColor = figure.getColor();
        const figureType = figure.getType();
        //force remove cells

        switch (figureType) {
            case 'pawn': {
                returnArray.push(...this.checkPawn(row, column, figureColor));

                //if last turn exist and figure in last turn that moved was pawn and it's row equals current pawn row and last turn pawn did 2 cell turn and current column is left (-1) or right(+1) from last turn pawn colummn 
                if (this.lastTurn && this.lastTurn.type === 'default' && this.lastTurn.figure.getType() === 'pawn' && Math.abs(this.lastTurn.toRow - this.lastTurn.fromRow) === 2 &&
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
                console.log(possibleTurns);
                returnArray = returnArray.filter((possibleTurn: Cell) =>
                    possibleTurns.includes(possibleTurn)
                )
            }

        }


        //if current figure is not a king && current player got checked 
        if (figureType !== 'king' && this[`${figureColor}Check`]) {
            returnArray = returnArray.filter((cell: Cell) =>
                this.kingSecureCells?.includes(cell))
        }


        return returnArray;
    }

    getHints(row: number, column: number): Array<Cell> {
        return this.checkTurns(row, column);
    }

    private reloadGame() {

    }

    exportGame() {

    }
}