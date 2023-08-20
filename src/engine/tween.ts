import { Entity } from "./entity";
import { clamp01 } from "./math";
import { Vector, lerp } from "./vector";

type TweenType = "none" | "move" | "scale";

export class Tween {
    public time = 0;
    private target: Vector;
    private start: Vector;
    private startTime: number;
    private duration: number;
    private active: boolean;
    private type: TweenType = "none";

    constructor(private entity: Entity) {
    }

    public scale(target: Vector, duration: number): void {
        this.type = "scale";
        const p = this.entity.scale;
        this.start = { x: p.x, y: p.y };
        this.startTween(target, duration);
    }

    public move(target: Vector, duration: number): void {
        this.type = "move";
        const p = this.entity.p;
        this.start = { x: p.x, y: p.y };
        this.startTween(target, duration);
    }

    private startTween(target: Vector, duration: number): void {
        this.target = target;
        this.duration = duration * 1000;
        this.active = true;
        this.startTime = -1;
    }

    public update(tick: number): void {
        if(this.startTime < 0 || this.type == "none") {
            this.startTime = tick;
            return;
        }
        if(!this.active) return;
        this.time = clamp01((tick - this.startTime) / this.duration);
        if(!this.start || !this.target) return;
        const p = lerp(this.start, this.target, this.time);
        
        if(this.type == "move") this.entity.p = { x: p.x, y: p.y };
        if(this.type == "scale") this.entity.scale = { x: p.x, y: p.y };

        this.active = this.time < 1;
    }
}