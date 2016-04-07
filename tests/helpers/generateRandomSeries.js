'use strict';

const _ = require('lodash');

const generateRandomSeries = function (seriesCount, pointsCount, options = {}) {
    options = _.defaults({}, options, {
        type: 'number', // number, integer, array, object
        min: 0,
        max: 100,
        float: false // integer or floating-point values
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
                    return {x: pointIndex, y: value};
                } else {
                    return value;
                }
            })
        };
    });

};

module.exports = generateRandomSeries;
