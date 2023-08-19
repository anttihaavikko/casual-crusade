import { Entity } from "./entity";
import { clamp01 } from "./math";
import { Vector, lerp } from "./vector";

enum TweenType {
    None,
    Move,
    Scale
}

export class Tween {
    public time = 0;
    private target: Vector;
    private start: Vector;
    private startTime: number;
    private duration: number;
    private active: boolean;
    private type: TweenType;

    constructor(private entity: Entity) {
    }

    public scale(target: Vector, duration: number): void {
        this.type = TweenType.Scale;
        const p = this.entity.scale;
        this.start = { x: p.x, y: p.y };
        this.startTween(target, duration);
    }

    public move(target: Vector, duration: number): void {
        this.type = TweenType.Move;
        const p = this.entity.getPosition();
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
        if(this.startTime < 0 || this.type == TweenType.None) {
            this.startTime = tick;
            return;
        }
        if(!this.active) return;
        this.time = clamp01((tick - this.startTime) / this.duration);
        const p = lerp(this.start, this.target, this.time);
        
        if(this.type == TweenType.Move) this.entity.setPosition(p.x, p.y);
        if(this.type == TweenType.Scale) this.entity.scale = { x: p.x, y: p.y };

        this.active = this.time < 1;
    }
}