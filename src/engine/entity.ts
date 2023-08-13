import { Mouse } from "./mouse";
import { Vector } from "./vector";

export abstract class Entity {
    public depth: number = 0;

    protected position: Vector;
    protected size: Vector;

    public constructor(x: number, y: number, width: number, height: number) {
        this.position = { x, y };
        this.size = { x: width, y: height };
    }

    public abstract update(tick: number, mouse: Mouse): void;
    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public getPosition(): Vector {
        return this.position;
    }
}