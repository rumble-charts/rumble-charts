import {
    defaults,
    forEach,
    isArray,
    isFunction,
    isNull,
    isPlainObject,
    isUndefined,
} from 'lodash';

export default function value(attribute, args) {
    if (isArray(attribute)) {
        let result;
        forEach(attribute, attr => {
            attr = isFunction(attr) ? attr(args) : attr;
            if (isPlainObject(attr) && isUndefined(attr._owner) && isUndefined(attr.props)) {
                result = defaults(result || {}, attr);
            } else if (!isUndefined(attr) && !isNull(attr)) {
                result = attr;
                return false;
            } else {
                return true;
            }
        });
        return result;
    } else {
        return isFunction(attribute) ? attribute(args) : attribute;
    }
}
