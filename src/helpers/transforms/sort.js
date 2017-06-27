import {
    defaults,
    isString,
    map,
    sortBy,
} from 'lodash';

export default function sort(props, options) {
    let {direction} = options || {};
    direction = isString(direction) ? direction.trim().toLowerCase() : 'asc';

    let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

    series = map(series, series => {

        const newSeries = {};

        newSeries.data = sortBy(series.data, 'y');

        if (direction === 'desc') {
            newSeries.data.reverse();
        }

        newSeries.data = map(newSeries.data, (point, pointIndex) => {
            const newPoint = {
                realX: point.x,
                x: pointIndex
            };
            return defaults(newPoint, point);
        });

        newSeries.data = sortBy(newSeries.data, 'realX');

        return defaults(newSeries, series);

    });

    return {
        series, seriesNormalized,
        maxX, maxY, minX, minY
    };
}
