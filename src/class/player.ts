import type { ChessColor, Timer } from "./chessTypes&Interfaces";

export class Player {
    constructor(id: number, time: number, color: ChessColor) {
        this.id = id;
        this.color = color;
        this.initTime = -1;

        this.started = false;
        this.syncTime = null;
        this.timerInterval = null;
        this.currentTime = time;
        this.turnStart = new Date().getTime();


        this.name = '';
        this.imgSrc = '';
        this.borderColor = '';
    }

    private id: number;

    private timerInterval: ReturnType<typeof setInterval> | null;
    private syncTime: ReturnType<typeof setTimeout> | null;
    private currentTime: number;
    private color: ChessColor;
    private turnStart: number;
    private initTime: number;
    private started: boolean;

    private name: string;
    private imgSrc: string;
    private borderColor: string;

    fillUserProfileInfo({ name, imgSrc, borderColor }: { name: string, imgSrc: string, borderColor: string }) {
        this.name = name;
        this.imgSrc = imgSrc;
        this.borderColor = borderColor;
    }

    fillPlayerInfo({ id, color, time }: { id: number, color: ChessColor, time: number }) {
        this.id = id;
        this.color = color;
        this.currentTime = this.initTime = time;
    }

    getId(): number {
        return this.id;
    }

    getImgBorder(): string {
        return this.borderColor;
    }

    getTime(): number {
        return this.currentTime;
    }

    getColor(): ChessColor {
        return this.color;
    }

    getName(): string {
        return this.name;
    }

    getImgSrc(): string {
        return this.imgSrc;
    }

    addTime(time: number): void {
        this.currentTime += time;
        this.initTime += time;
    }

    getStarted(): boolean {
        return this.started;
    }

    start(): void {
        this.timerInterval = setInterval(() => {
            this.currentTime -= 1;
        }, 1000);
        this.started = true;
        this.turnStart = new Date().getTime();

        this.syncTime = setTimeout(() => {
            this.currentTime = 0;
        }, this.currentTime * 1000);
    }
    stop(): void {
        clearInterval(this.timerInterval as ReturnType<typeof setInterval>);

        this.started = false;
        this.initTime -= (new Date().getTime() - this.turnStart) / 1000;
        this.currentTime = this.initTime;

        clearTimeout(this.syncTime as ReturnType<typeof setTimeout>);
    }

}