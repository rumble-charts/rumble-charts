import _ from 'lodash';

export default function sort(props, options) {
    let {direction} = options || {};
    direction = _.isString(direction) ? direction.trim().toLowerCase() : 'asc';

    let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

    series = _.map(series, series => {

        const newSeries = {};

        newSeries.data = _.sortBy(series.data, 'y');

        if (direction === 'desc') {
            newSeries.data.reverse();
        }

        newSeries.data = _.map(newSeries.data, (point, pointIndex) => {
            const newPoint = {
                realX: point.x,
                x: pointIndex
            };
            return _.defaults(newPoint, point);
        });

        newSeries.data = _.sortBy(newSeries.data, 'realX');

        return _.defaults(newSeries, series);

    });

    return {
        series, seriesNormalized,
        maxX, maxY, minX, minY
    };
}
