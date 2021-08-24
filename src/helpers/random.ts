export function random(lower = 0, upper = 1, floating = false): number {
    let value = lower + Math.random() * upper;
    if (!floating) {
        value = Math.trunc(value);
    }
    return value;
}
