import _  from 'lodash';

/**
 * @returns {Array}
 */
export default function generateRandomSeries(seriesCount, pointsCount, options = {}) {
    options = _.defaults({}, options, {
        type: 'number', // number, integer, array, object
        min: 1,
        max: 100,
        float: false,
        point: null // integer or floating-point values
    });
    const type = options.type.toLowerCase();

    return _.map(_.range(seriesCount), seriesIndex => {
        const _pointsCount = _.isFunction(pointsCount) ? pointsCount(seriesIndex) : pointsCount;
        return {
            data: _.map(_.range(_pointsCount), pointIndex => {
                const value = _.random(options.min, options.max, options.float);
                if (type === 'array') {
                    return [pointIndex, value];
                } else if (type === 'object') {
                    let point = options.point;
                    if (_.isFunction(point)) {
                        point = point({seriesIndex, pointIndex, value});
                    }
                    return _.extend({x: pointIndex, y: value}, point);
                } else {
                    return value;
                }
            })
        };
    });

}
