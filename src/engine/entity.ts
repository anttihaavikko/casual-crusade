import { Mouse } from "./mouse";
import { Tween } from "./tween";
import { Vector } from "./vector";

export abstract class Entity {
    public scale: Vector = { x: 1, y: 1};
    public d = 0;
    public dead: boolean;
    public p: Vector;
    
    protected s: Vector;

    protected tween: Tween;

    public constructor(x: number, y: number, width: number, height: number) {
        this.p = { x, y };
        this.s = { x: width, y: height };
        this.tween = new Tween(this);
    }

    public update(tick: number, mouse: Mouse): void {
        this.tween.update(tick);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
    }

    public getCenter(): Vector {
        return {
            x: this.p.x + this.s.x * 0.5,
            y: this.p.y + this.s.y * 0.5
        };
    }

    public setPosition(x: number, y: number): void {
        this.p = { x, y };
    }

    public isInside(point: Vector): boolean {
        const c = this.getCenter();
        return point.x > c.x - this.s.x * 0.5 * this.scale.x && 
            point.x < c.x + this.s.x * 0.5 * this.scale.x &&
            point.y > c.y - this.s.y * 0.5 * this.scale.y &&
            point.y < c.y + this.s.y * 0.5 * this.scale.y;
    }
}

export const sortByDepth = (a: Entity, b: Entity) => a.d - b.d;