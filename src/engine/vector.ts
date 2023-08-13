export interface Vector {
    x: number;
    y: number;
}

export function distance(a: Vector, b: Vector): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return Math.sqrt(dx * dx + dy * dy);
}