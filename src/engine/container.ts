import { Entity } from "./entity";
import { Mouse } from "./mouse";
import { Particle } from "./particle";

export class Container {
    private children: Particle[] = [];

    public update(tick: number, mouse: Mouse): void {
        this.children.forEach(c => c.update(tick, mouse));
        if(this.children.some(c => c.dead)) {
            this.children = this.children.filter(c => !c.dead);
        }
    }

    public getChildren(): Entity[] {
        return this.children;
    }

    public add(entity: Particle): void {
        this.children.push(entity);
    }
}