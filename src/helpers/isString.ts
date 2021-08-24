const TYPE_STRING = 'string';

export function isString(value: unknown): value is string {
    return typeof value === TYPE_STRING || value instanceof String;
}
