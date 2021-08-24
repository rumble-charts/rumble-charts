export function range(count: number): number[] {
    return Array.from({length: count}).map((v, index) => index);
}
