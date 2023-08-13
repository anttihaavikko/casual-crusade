export interface Vector {
    x: number;
    y: number;
}

export function distance(a: Vector, b: Vector): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return Math.sqrt(dx * dx + dy * dy);
}

export function lerp(a: Vector, b: Vector, t: number): Vector {
    const ease = bounce(t);
    return {
        x: a.x + ease * (b.x - a.x),
        y: a.y + ease * (b.y - a.y)
    };
}

export function bounce(p: number): number
{
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