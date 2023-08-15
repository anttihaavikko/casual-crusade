import { Entity } from "./entity";
import { Mouse } from "./mouse";
import { Vector } from "./vector";

export abstract class Draggable extends Entity {
    protected hovered: boolean;
    protected dragging: boolean;
    protected locked: boolean;
    protected selectable: boolean;

    private offset: Vector = { x: 0, y: 0 };
    private start: Vector;
    private pressed: boolean;

    public update(tick: number, mouse: Mouse): void {
        this.hovered = !mouse.dragging && this.isInside(mouse);
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
                x: this.position.x,
                y: this.position.y
            };
            this.dragging = true;
            this.offset = {
                x: mouse.x - this.position.x,
                y: mouse.y - this.position.y
            };
            mouse.dragging = true;
            this.depth = 100;
        }
        if(this.dragging) {
            this.position.x = mouse.x - this.offset.x;
            this.position.y = mouse.y - this.offset.y;

            if(!mouse.pressing) {
                this.dragging = false;
                mouse.dragging = false;
                this.depth = 0;
                this.drop();
            }
        }
    }

    protected getStartPosition(): Vector {
        return this.start;
    }

    protected abstract pick(): void;

    protected abstract click(): void;

    protected abstract drop(): void;

    private isInside(point: Vector): boolean {
        return point.x > this.position.x && 
            point.x < this.position.x + this.size.x &&
            point.y > this.position.y &&
            point.y < this.position.y + this.size.y;
    }
}