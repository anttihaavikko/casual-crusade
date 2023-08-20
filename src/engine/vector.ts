export interface Vector {
    x: number;
    y: number;
}

export const ZERO = { x: 0, y: 0 };

export const normalize = (v: Vector): Vector => {
    const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
    if(magnitude == 0) return ZERO;
    return { x: v.x / magnitude, y: v.y / magnitude };
}

export const distance = (a: Vector, b: Vector): number => {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return Math.sqrt(dx * dx + dy * dy);
}

export const lerp = (a: Vector, b: Vector, t: number): Vector => {
    const ease = bounce(t);
    return {
        x: a.x + ease * (b.x - a.x),
        y: a.y + ease * (b.y - a.y)
    };
}

export const bounce = (p: number): number => {
    if(p < 4/11.0)
    {
        return (121 * p * p)/16.0;
    }
    else if(p < 8/11.0)
    {
        return (363/40.0 * p * p) - (99/10.0 * p) + 17/5.0;
    }
    else if(p < 9/10.0)
    {
        return (4356/361.0 * p * p) - (35442/1805.0 * p) + 16061/1805.0;
    }
    else
    {
        return (54/5.0 * p * p) - (513/25.0 * p) + 268/25.0;
    }
}

export const offset = (v: Vector, x: number, y: number): Vector => {
    return {
        x: v.x + x,
        y: v.y + y
    }
}