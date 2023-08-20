import { drawColoredText } from "./engine/drawing";
import { Entity } from "./engine/entity";
import { Mouse } from "./engine/mouse";
import { Vector } from "./engine/vector";

export class Tooltip extends Entity {
    public visible = false;

    private title = "";
    private content = "";
    private colors: string[];
    private flipped: boolean;
    private phase = 0;

    constructor(x: number, y: number, width: number, height: number) {
        super(x - width * 0.5, y - height * 0.5, width, height);
        this.d = 150;
    }

    public show(title: string, content: string, pos: Vector, colors: string[], flipped = false): void {
        this.title = title;
        this.content = content;
        this.p = { x: pos.x - this.s.x * 0.5, y: pos.y - this.s.y };
        this.visible = true;
        this.colors = colors;
        this.flipped = flipped;
    }

    public update(tick: number, mouse: Mouse): void {
        this.phase = Math.abs(Math.sin(tick * 0.0025));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if(!this.visible) return;
        ctx.save();
        ctx.translate(0, this.phase * (this.flipped ? -7 : -7));
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

        ctx.beginPath();
        const dx = this.flipped ? 25 : 250;
        const dy = this.flipped ? 5 : 85;
        ctx.moveTo(c.x - 15 + dx, c.y + dy);
        ctx.lineTo(c.x + 15 + dx, c.y + dy);
        ctx.lineTo(c.x + dx, c.y + dy + (this.flipped ? -15 : 15));
        ctx.fill();

        drawColoredText(ctx, this.content, c.x + 15, c.y + 40 + 30, this.colors);
        ctx.restore();
    }
}