const TYPE_NUMBER = 'number';

export function isNumber(value: unknown): value is number {
    return typeof value === TYPE_NUMBER || value instanceof Number;
}
