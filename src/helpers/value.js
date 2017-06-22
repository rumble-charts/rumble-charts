import _ from 'lodash';

export default function value(attribute, args) {
    if (_.isArray(attribute)) {
        var result;
        _.forEach(attribute, attr => {
            attr = _.isFunction(attr) ? attr(args) : attr;
            if (_.isPlainObject(attr) && _.isUndefined(attr._owner) && _.isUndefined(attr.props)) {
                result = _.defaults(result || {}, attr);
            } else if (!_.isUndefined(attr)) {
                result = attr;
                return false;
            }
        });
        return result;
    } else {
        return _.isFunction(attribute) ? attribute(args) : attribute;
    }
}
