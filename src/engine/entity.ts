import { Mouse } from "./mouse";
import { Vector } from "./vector";

export abstract class Entity {
    public scale = 1;
    public depth = 0;

    protected position: Vector;
    protected size: Vector;

    public constructor(x: number, y: number, width: number, height: number) {
        this.position = { x, y };
        this.size = { x: width, y: height };
    }

    public abstract update(tick: number, mouse: Mouse): void;
    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public preDraw(ctx: CanvasRenderingContext2D): void {
    }

    public getCenter(): Vector {
        return {
            x: this.position.x + this.size.x * 0.5,
            y: this.position.y + this.size.y * 0.5
        };
    }

    public getPosition(): Vector {
        return this.position;
    }

    public setPosition(x: number, y: number): void {
        this.position = { x, y };
    }

    public isInside(point: Vector): boolean {
        const c = this.getCenter();
        return point.x > c.x - this.size.x * 0.5 * this.scale && 
            point.x < c.x + this.size.x * 0.5 * this.scale &&
            point.y > c.y - this.size.y * 0.5 * this.scale &&
            point.y < c.y + this.size.y * 0.5 * this.scale;
    }
}

export const sortByDepth = (a: Entity, b: Entity) => a.depth - b.depth;