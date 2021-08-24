const TYPE_UNDEFINED = 'undefined';

export function isUndefined(value: unknown): value is undefined {
    return typeof value === TYPE_UNDEFINED;
}
