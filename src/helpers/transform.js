import _ from 'lodash';

import transforms from './transforms';

export default function transform(props, method, options = null) {
    if (!_.isArray(method)) {
        method = [method];
    }

    return _.reduce(method, (props, method) => {
        if (_.isString(method)) {
            if (_.isFunction(transforms[method])) {
                return _.defaults(transforms[method](props, options), props);
            } else {
                return props;
            }
        } else if (_.isFunction(method)) {
            return _.defaults(method(props, options), props);
        } else if (_.isObject(method)) {
            return transform(props, method.method, method.options);
        } else {
            return props;
        }
    }, props);
}
