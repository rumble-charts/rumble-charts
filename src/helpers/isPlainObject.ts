import {isObject} from './isObject';
import {isFunction} from './isFunction';

export function isPlainObject(value: unknown): value is Record<string, any> {
    return isObject(value) && !Array.isArray(value) && !isFunction(value) && value !== null;
}
