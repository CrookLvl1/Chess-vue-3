import type { ChessColor, Timer } from "./chessTypes&Interfaces";

export class Player {
    constructor(id: number, time: number, color: ChessColor) {
        this.id = id;
        this.color = color;

        this.timerInterval = null;
        this.currentTime = time;
    }

    private id: number;
    private timerInterval: ReturnType<typeof setInterval> | null;
    private currentTime: number;
    private color: ChessColor;


    getId(): number {
        return this.id;
    }
    setId(value: number): void {
        this.id = value;
    }
    getName(): string {
        return 'Guest' + this.id;
    }

    getTime(): number {
        return (Math.ceil(this.currentTime));
    }

    getColor(): ChessColor {
        return this.color;
    }

    setColor(color: ChessColor): void {
        this.color = color;
    }

    setTime(time: number): void {
        this.currentTime = time;
    }

    addTime(time: number): void {
        this.currentTime += time;
    }

    start(): void {
        this.timerInterval = setInterval(() => {
            this.currentTime -= 0.1;
        }, 100)
    }
    stop(): void {
        if (this.timerInterval) clearInterval(this.timerInterval as ReturnType<typeof setInterval>);
    }

}