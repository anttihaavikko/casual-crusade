import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";

export class Tooltip extends Entity {
    public visible = false;

    private title = "";
    private content = "";
    private titleColor: string;

    constructor(x: number, y: number, width: number, height: number) {
        super(x - width * 0.5, y - height * 0.5, width, height);
        this.depth = 150;
    }

    public show(title: string, content: string, pos: Vector, color: string): void {
        this.title = title;
        this.content = content;
        this.position = { x: pos.x - this.size.x * 0.5, y: pos.y - this.size.y };
        this.visible = true;
        this.titleColor = color;
    }

    public update(tick: number, mouse: Mouse): void {
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(!this.visible) return;
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        ctx.font = "30px arial black";
        ctx.textAlign = "left";
        const c = this.getPosition();
        ctx.fillStyle = "#000";
        ctx.fillText(this.title, c.x + 5 + 15, c.y + 5 + 40);
        ctx.fillStyle = this.titleColor;
        ctx.fillText(this.title, c.x + 15, c.y + 40);
        ctx.font = "20px arial black";
        ctx.fillStyle = "#000";
        ctx.fillText(this.content, c.x + 4 + 15, c.y + 4 + 40 + 30);
        ctx.fillStyle = "#fff";
        ctx.fillText(this.content, c.x + 15, c.y + 40 + 30);
    }
}