import {
    defaults,
    isUndefined,
    map,
    max,
    min,
} from 'lodash';

export default function stack(props, options) {
    const {normalize} = options || {};

    let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

    const stackedY = [], lowestY = [];
    series = map(series, series => {

        const newSeries = {
            data: map(series.data, (point, pointIndex) => {
                stackedY[pointIndex] = stackedY[pointIndex] || 0;
                if (isUndefined(lowestY[pointIndex])) {
                    lowestY[pointIndex] = stackedY[pointIndex];
                }
                const newPoint = {
                    y0: stackedY[pointIndex],
                    y: stackedY[pointIndex] + point.y
                };
                stackedY[pointIndex] = newPoint.y;

                return defaults(newPoint, point);
            })
        };

        return defaults(newSeries, series);
    });

    minY = min(lowestY);
    const stackedMaxY = max(stackedY);
    maxY = Math.max(stackedMaxY, maxY);

    if (normalize) {

        const ratios = map(stackedY, y => stackedMaxY / y);
        series = map(series, series => {
            const newSeries = {
                data: map(series.data, (point, pointIndex) => {
                    const newPoint = {
                        y0: point.y0 * ratios[pointIndex],
                        y: point.y * ratios[pointIndex]
                    };
                    return defaults(newPoint, point);
                })
            };
            return defaults(newSeries, series);
        });

    }

    return {
        series,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY
    };
}
