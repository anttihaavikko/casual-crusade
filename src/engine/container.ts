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

    public hide(): void {
        this.tween.scale({ x: 0, y: 0 }, 0.3);
    }

    public show(): void {
        this.tween.scale({ x: 1, y: 1 }, 0.3);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const p = this.getPosition();
        ctx.translate(p.x, p.y);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.translate(-p.x, -p.y);
        this.children.forEach(c => c.draw(ctx));
        ctx.restore();
    }

    public getChildren(): Entity[] {
        return this.children;
    }

    public add(entity: Entity): void {
        this.children.push(entity);
    }
}