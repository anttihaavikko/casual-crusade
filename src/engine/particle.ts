import { Entity } from "./entity";
import { Mouse } from "./mouse";
import { Vector } from "./vector";

export abstract class Particle extends Entity {
    public dead: boolean;
    public ratio = 1;

    private start = -1;

    constructor(x: number, y: number, width: number, height: number, protected life: number, protected velocity: Vector) {
        super(x, y, width, height);
    }

    public update(tick: number, mouse: Mouse): void {
        if(this.dead || this.life < 0) return;
        this.position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y + this.velocity.y
        };
        this.ratio = 1 - (tick - this.start) / (this.life * 1000);
        if(this.start < 0) this.start = tick;
        if(tick - this.start > this.life * 1000) {
            this.dead = true;
        };
    }
}