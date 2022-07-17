import {isFunction} from './isFunction';
import {isObject} from './isObject';
import {isUndefined} from './isUndefined';

type Attr<T, R> = R | ((args?: T) => R);

export function value<R = any, T = Record<string, any>>(attribute: Attr<T, R> | Attr<T, R>[], args?: T): R {
    if (Array.isArray(attribute)) {
        let result;
        for (let attr of attribute) {
            attr = isFunction(attr) ? attr(args) : attr;
            if (isObject(attr) && !Array.isArray(attr) && !('_owner' in attr) && !('props' in attr)) {
                result = {
                    ...attr,
                    ...(result || {})
                };
            } else if (!isUndefined(attr) && attr !== null) {
                result = attr;
                break;
            }
        }
        return result;
    } else {
        return isFunction(attribute) ? attribute(args) : attribute;
    }
}
