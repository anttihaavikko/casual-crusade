import { Entity } from "./entity";
import { clamp01 } from "./math";
import { Vector, lerp } from "./vector";

export class Tween {
    public time = 0;
    private target: Vector;
    private start: Vector;
    private startTime: number;
    private duration: number;
    private active: boolean;

    constructor(private entity: Entity) {
    }

    public move(target: Vector, duration: number): void {
        const p = this.entity.getPosition();
        this.start = { x: p.x, y: p.y };
        this.target = target;
        this.duration = duration * 1000;
        this.active = true;
        this.startTime = -1;
    }

    public update(tick: number): void {
        if(this.startTime < 0) {
            this.startTime = tick;
            return;
        }
        if(!this.active) return;
        this.time = clamp01((tick - this.startTime) / this.duration);
        const p = lerp(this.start, this.target, this.time);
        this.entity.setPosition(p.x, p.y);
        this.active = this.time < 1;
    }
}