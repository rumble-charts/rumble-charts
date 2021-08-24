const TYPE_FUNCTION = 'function';

export function isFunction(value: unknown): value is (...args: any) => any {
    return typeof value === TYPE_FUNCTION || value instanceof Function;
}
