import { transformTo } from "./transformer";
import { Entity } from "./entity";
import { Mouse } from "./mouse";

export class Container extends Entity {
    private children: Entity[] = [];

    constructor(x: number = 0, y: number = 0, entities: Entity[] = []) {
        super(x, y, 0, 0);
        this.children.push(...entities);
    }

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        this.children.forEach(c => c.update(tick, mouse));
        if(this.children.some(c => c.dead)) {
            this.children = this.children.filter(c => !c.dead);
        }
    }

    public hide(duration = 0.3): void {
        this.tween.scale({ x: 0, y: 0 }, duration);
    }

    public show(duration = 0.3): void {
        this.tween.scale({ x: 1, y: 1 }, duration);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const p = this.p;
        transformTo(ctx, p.x, p.y, 0, this.scale.x, this.scale.y);
        this.children.forEach(c => c.draw(ctx));
        ctx.restore();
    }

    public getChild(index: number): Entity {
        return this.children[index];
    }

    public getChildren(): Entity[] {
        return this.children;
    }

    public add(entity: Entity): void {
        this.children.push(entity);
    }
}