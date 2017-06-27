import {
    defaults,
    isArray,
    isFunction,
    isObject,
    isString,
    reduce,
} from 'lodash';

import transforms from './transforms';

export default function transform(props, method, options = null) {
    if (!isArray(method)) {
        method = [method];
    }

    return reduce(method, (props, method) => {
        if (isString(method)) {
            if (isFunction(transforms[method])) {
                return defaults(transforms[method](props, options), props);
            } else {
                return props;
            }
        } else if (isFunction(method)) {
            return defaults(method(props, options), props);
        } else if (isObject(method)) {
            return transform(props, method.method, method.options);
        } else {
            return props;
        }
    }, props);
}
