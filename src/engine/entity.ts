import { Mouse } from "./mouse";
import { Vector } from "./vector";

export abstract class Entity {
    public scl = 1;
    public d = 0;

    protected p: Vector;
    protected s: Vector;

    public constructor(x: number, y: number, width: number, height: number) {
        this.p = { x, y };
        this.s = { x: width, y: height };
    }

    public update(tick: number, mouse: Mouse): void {
    }

    public draw(ctx: CanvasRenderingContext2D): void {
    }

    public getCenter(): Vector {
        return {
            x: this.p.x + this.s.x * 0.5,
            y: this.p.y + this.s.y * 0.5
        };
    }

    public getPosition(): Vector {
        return this.p;
    }

    public setPosition(x: number, y: number): void {
        this.p = { x, y };
    }

    public isInside(point: Vector): boolean {
        const c = this.getCenter();
        return point.x > c.x - this.s.x * 0.5 * this.scl && 
            point.x < c.x + this.s.x * 0.5 * this.scl &&
            point.y > c.y - this.s.y * 0.5 * this.scl &&
            point.y < c.y + this.s.y * 0.5 * this.scl;
    }
}

export const sortByDepth = (a: Entity, b: Entity) => a.d - b.d;