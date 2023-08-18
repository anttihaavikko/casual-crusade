import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";

export class Tooltip extends Entity {
    public visible = false;

    private title = "";
    private content = "";
    private colors: string[];

    constructor(x: number, y: number, width: number, height: number) {
        super(x - width * 0.5, y - height * 0.5, width, height);
        this.d = 150;
    }

    public show(title: string, content: string, pos: Vector, colors: string[]): void {
        this.title = title;
        this.content = content;
        this.p = { x: pos.x - this.s.x * 0.5, y: pos.y - this.s.y };
        this.visible = true;
        this.colors = colors;
    }

    public update(tick: number, mouse: Mouse): void {
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(!this.visible) return;
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.p.x, this.p.y, this.s.x, this.s.y);
        ctx.font = "30px arial black";
        ctx.textAlign = "left";
        const c = this.getPosition();
        ctx.fillStyle = "#000";
        ctx.fillText(this.title, c.x + 5 + 15, c.y + 5 + 40);
        ctx.fillStyle = this.colors[0];
        ctx.fillText(this.title, c.x + 15, c.y + 40);
        ctx.font = "20px arial black";
        ctx.fillStyle = "#000";
        ctx.fillText(this.content, c.x + 4 + 15, c.y + 4 + 40 + 30);

        const parts = this.content.split('|');
        let color = false;
        let pos = 0;
        let n = 0;
        parts.forEach(p => {
            ctx.fillStyle = color ? this.colors[n] : "#fff";
            if(color) n = (n + 1) % this.colors.length;
            ctx.fillText(p, c.x + 15 + pos, c.y + 40 + 30);
            color = !color;
            pos += ctx.measureText(p).width;
        });
    }
}