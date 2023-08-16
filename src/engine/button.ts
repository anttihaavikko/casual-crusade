import { Entity } from "./entity"
import { Mouse } from "./mouse";

const BORDER_THICKNESS = 7;

export class ButtonEntity extends Entity {
    private pressed: boolean;
    private hovered: boolean;

    constructor(private content: string, x: number, y: number, width: number, height: number, private onClick: () => void) {
        super(x, y, width, height);
    }

    public update(tick: number, mouse: Mouse): void {
        const wasHovered = this.hovered;
        this.hovered = !mouse.dragging && this.isInside(mouse);
        if(!wasHovered && this.hovered) this.hover();
        if(!mouse.pressing) {
            if(this.pressed && !mouse.dragging && this.hovered) {
                this.onClick();
            }
            this.pressed = false;
        }
        
        if(this.hovered && mouse.pressing && !this.pressed && !mouse.dragging) {
            this.pressed = true;
            return;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // ctx.save();
        // ctx.translate(0, this.hovered ? -5 : 0);
        ctx.fillStyle = "#000";
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        ctx.fillStyle = this.hovered ? "red" : "#fff";
        ctx.fillRect(this.position.x + BORDER_THICKNESS, this.position.y + BORDER_THICKNESS, this.size.x - BORDER_THICKNESS * 2, this.size.y - BORDER_THICKNESS * 2);

        ctx.font =`25px arial black`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillText(this.content, this.position.x + this.size.x * 0.5, this.position.y + this.size.y * 0.5 + 10);

        // ctx.restore();
    }

    private hover(): void {

    }
}