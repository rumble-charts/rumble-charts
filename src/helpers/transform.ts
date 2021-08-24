import * as transforms from './transforms';
import type {NormalizedSeriesProps, TransformMethod} from '../types';
import {isString} from './isString';
import {isFunction} from './isFunction';
import {isObject} from './isObject';

export function transform(
    props: NormalizedSeriesProps,
    method: TransformMethod | TransformMethod[],
    options: any = undefined
): NormalizedSeriesProps {
    if (!Array.isArray(method)) {
        method = [method];
    }

    return method.reduce((props, method) => {
        if (isString(method)) {
            if (isFunction(transforms[method])) {
                return {
                    ...props,
                    // @ts-ignore
                    ...transforms[method](props, options)
                };
            } else {
                return props;
            }
        } else if (isFunction(method)) {
            return {
                ...props,
                ...method(props, options)
            };
        } else if (isObject(method)) {
            return transform(props, method.method, method.options);
        } else {
            return props;
        }
    }, props);
}
