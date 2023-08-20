import { Entity } from "./entity";
import { Mouse } from "./mouse";
import { Vector, offset } from "./vector";

export abstract class Draggable extends Entity {
    protected hovered: boolean;
    protected dragging: boolean;
    protected locked: boolean;
    protected selectable: boolean;
    protected start: Vector;

    private offset: Vector = { x: 0, y: 0 };
    private pressed: boolean;

    public update(tick: number, mouse: Mouse): void {
        super.update(tick, mouse);
        const wasHovered = this.hovered;
        this.hovered = !mouse.dragging && this.isInside(mouse);
        if(wasHovered && !this.hovered) this.exit();
        if(!wasHovered && this.hovered && (!this.locked || this.selectable)) this.hover();
        if(!mouse.pressing) {
            if(this.pressed && !mouse.dragging && this.hovered) {
                this.click();
            }
            this.pressed = false;
        }
        
        if(this.hovered && this.selectable && mouse.pressing && !this.pressed && !mouse.dragging) {
            this.pressed = true;
            return;
        }
        if(this.locked) return;
        if(this.hovered && mouse.pressing && !mouse.dragging && !this.dragging) {
            this.pick();
            this.start = {
                x: this.p.x,
                y: this.p.y
            };
            this.dragging = true;
            this.offset = offset(mouse, -this.p.x, -this.p.y);
            mouse.dragging = true;
            this.d = 100;
        }
        if(this.dragging) {
            this.p = offset(mouse, -this.offset.x, -this.offset.y);

            if(!mouse.pressing) {
                this.dragging = false;
                mouse.dragging = false;
                this.d = 0;
                this.drop();
            }
        }
    }

    protected abstract hover(): void;

    protected abstract exit(): void;

    protected abstract pick(): void;

    protected abstract click(): void;

    protected abstract drop(): void;
}