import { Entity } from "./entity";
import { Vector, lerp } from "./vector";

export class Tween {
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
        const t = Math.min((tick - this.startTime) / this.duration, 1);
        const p = lerp(this.start, this.target, t);
        this.entity.setPosition(p.x, p.y);
        this.active = t < 1;
    }
}