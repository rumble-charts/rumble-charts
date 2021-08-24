const TYPE_OBJECT = 'object';

export function isObject(value: unknown): value is Record<any, any> {
    return typeof value === TYPE_OBJECT;
}
