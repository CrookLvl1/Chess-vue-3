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
        this.imgBorder = '';
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
    private imgBorder: string;

    getId(): number {
        return this.id;
    }
    setId(value: number): void {
        this.id = value;
    }

    getImgBorder(): string {
        return this.imgBorder;
    }
    setImgBorder(value: string) {
        this.imgBorder = value;
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
    setName(value: string) {
        this.name = value;
    }

    getImgSrc(): string {
        return this.imgSrc;
    }

    setImgSrc(value: string) {
        this.imgSrc = value;
    }



    setColor(color: ChessColor): void {
        this.color = color;
    }

    setTime(time: number): void {
        console.log('setTime', time);
        this.currentTime = time;
    }

    addTime(time: number): void {
        this.currentTime += time;
    }

    initTimeSync() {
        this.initTime = this.currentTime;
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
        console.log('started', this.color);



        const time = this.currentTime;
        this.syncTime = setTimeout(() => {
            this.currentTime = 0;
            console.log(this.color, 'end with timeout');
        }, time * 1000);
    }
    stop(): void {
        if (this.timerInterval) clearInterval(this.timerInterval as ReturnType<typeof setInterval>);
        this.started = false;
        this.initTime -= (new Date().getTime() - this.turnStart) / 1000;
        this.currentTime = this.initTime;

        clearTimeout(this.syncTime as ReturnType<typeof setTimeout>);
        console.log('cleared')
    }

}