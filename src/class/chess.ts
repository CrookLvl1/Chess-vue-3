export type ChessColor = 'white' | 'black';
export type ChessFigure = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn';
export type LinealDirection = 'top' | 'left' | 'bottom' | 'right';
export type DiagonalDirection = 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right';
export type KnightDirection = 'top-right-top' | 'top-right-bottom' | 'top-left-top' | 'top-left-bottom' | 'bottom-right-top' | 'bottom-right-bottom' | 'bottom-left-top' | 'bottom-left-bottom';
export type CellColor = '#7c573e' | '#908782';
export type Turn = {
    fromRow: number,
    fromColumn: number,
    toRow: number,
    toColumn: number,
    figure: Figure
}

export type GameSave = {
    downColor: ChessColor,
    lastTurn: Turn,
    turn: ChessColor,
    figures: {
        [key: string]: Figure
    },
}


const chooseFigureType = (row: number, column: number): ChessFigure => {
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


export class Cell {
    constructor(figure: null | Figure, row: number, column: number) {
        this.figure = figure;
        this.row = row;
        this.column = column;

    }

    private figure: Figure | null;
    private row: number;
    private column: number;
    private hint: boolean = false;
    private selected: boolean = false;


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

    getSelected(): boolean {
        return this.selected;
    }
    switchSelected() {
        this.selected = !this.selected;
    }

}

export class Figure {
    constructor(src: string, color: ChessColor, type: ChessFigure) {
        this.src = src;
        this.color = color;
        this.type = type;
    }

    private src: string;
    private color: ChessColor;
    private type: ChessFigure;

    getSrc(): string {
        return this.src;
    }
    getColor(): ChessColor {
        return this.color;
    }
    getType(): ChessFigure {
        return this.type;
    }
}

export class ChessField {
    constructor(soloPlay: boolean, colorDown: ChessColor, cellsWidth: number, loadGame?: GameSave) {
        this.soloPlay = soloPlay;
        this.colorDown = colorDown;
        this.cellsWidth = cellsWidth;


        this.cellsArr = [];
        this.turn = 'white';
        this.lastTurn = null;
        this.kingDefence = [];
        this.check = false;
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
                    const figureType: ChessFigure = chooseFigureType(i, j);
                    const color: ChessColor = i < 2 ? 'black' : 'white';
                    this.cellsArr[i].push(new Cell(
                        new Figure(figureType + color + '.png', color, figureType), i, j
                    ));
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
    private cellsWidth: number;
    private turn: ChessColor;
    private lastTurn: Turn | null;
    private kingDefence: Array<Cell>;
    private check: boolean;
    private directions: { [key: string]: { [key: string]: [number, number] } };

    getLastTurn(): Turn | null {
        return this.lastTurn;
    }

    getCellsWidth(): number {
        return this.cellsWidth;
    }

    moveFigure(fromRow: number, fromColumn: number, toRow: number, toColumn: number) {
        const tmpFrom = this.cellsArr[fromRow][fromColumn];

        this.cellsArr[toRow][toColumn].setFigure(null);
        setTimeout(() => {
            this.cellsArr[toRow][toColumn].setFigure(tmpFrom.getFigure());
            this.cellsArr[fromRow][fromColumn].setFigure(null);
            this.lastTurn = {
                fromRow,
                fromColumn,
                toRow,
                toColumn,
                figure: this.cellsArr[toRow][toColumn].getFigure() as Figure
            }
        })
    }

    private isBusyByColor(row: number, column: number, color: ChessColor) {
        return !this.cellsArr[row][column].isFree() && this.cellsArr[row][column].getFigure()?.getColor() === color;
    }

    private isInField(row: number, column: number): boolean {
        return row >= 0 && row <= 7 && column >= 0 && column <= 7;
    }

    private checkDiagonal(row: number, column: number, allyColor: ChessColor, checkDirections?: Array<DiagonalDirection>, range: number = 100): Array<Cell> {
        const returnArray: Array<Cell> = [];

        const diaglnalAdditions = this.directions.diagonal;

        for (let directionKey in diaglnalAdditions) {
            //Если указан массив checkDirections и направление не в массиве то пропускаем напрваление; 
            if (checkDirections && !checkDirections.find((dir: DiagonalDirection) => dir === directionKey)) continue;
            let tempRange = range;
            const additions = diaglnalAdditions[directionKey];

            let tempRow = row + additions[0],
                tempColumn = column + additions[1];


            while (this.isInField(tempRow, tempColumn) && tempRange > 0) {

                if (!this.cellsArr[tempRow][tempColumn].isFree()) {
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

    private checkLineal(row: number, column: number, allyColor: ChessColor, checkDirections?: Array<LinealDirection>, range: number = 100): Array<Cell> {
        const returnArray: Array<Cell> = [];

        const linealDirection = this.directions.lineal;

        for (let directionKey in linealDirection) {
            //Если указан массив checkDirections и направление не в массиве то пропускаем напрваление; 
            if (checkDirections && !checkDirections.find((dir: LinealDirection) => dir === directionKey)) continue;
            let tempRange = range;
            const additions = linealDirection[directionKey];

            let tempRow = row + additions[0],
                tempColumn = column + additions[1];


            while (this.isInField(tempRow, tempColumn) && tempRange > 0) {

                if (!this.cellsArr[tempRow][tempColumn].isFree()) {
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
        console.log('pawn check')
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
            ...this.checkDiagonal(row, column, allyColor, diagonalcheck, 1)
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

    private checkKingDefence() {

    }

    getHints(row: number, column: number): Array<Cell> {
        const returnArray: Array<Cell> = [];
        const cell = this.cellsArr[row][column];

        const figure = cell.getFigure() as Figure;
        const figureColor = figure.getColor();
        const figureType = figure.getType();


        switch (figureType) {
            case 'pawn': {
                returnArray.push(...this.checkPawn(row, column, figureColor));

                break;
            }
            case 'rook': {
                returnArray.push(...this.checkLineal(row, column, figureColor,))

                break;
            }
            case 'knight': {
                returnArray.push(...this.checkKnight(row, column, figureColor))
                break;
            }
            case 'bishop': {
                returnArray.push(...this.checkDiagonal(row, column, figureColor));
                break;
            }

            case 'queen': {
                returnArray.push(
                    ...this.checkDiagonal(row, column, figureColor),
                    ...this.checkLineal(row, column, figureColor)
                );
                break;
            }
            case 'king': {
                returnArray.push(
                    ...this.checkDiagonal(row, column, figureColor, undefined, 1),
                    ...this.checkLineal(row, column, figureColor, undefined, 1)
                )
                break;
            }

        }

        return returnArray;
    }


    getCell(row: number, column: number): Cell {
        return this.cellsArr[row][column];
    }

    getCells(): Array<Array<Cell>> {
        return this.cellsArr;
    }

    getBusyCells(): Array<Cell> {
        const returnArray: Array<Cell> = [];

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!this.cellsArr[i][j].isFree())
                    returnArray.push(this.cellsArr[i][j]);
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

    exportGame() {

    }
}