import _ from 'lodash';

export default function stack(props, options) {
    const {normalize} = options || {};

    let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

    const stackedY = [], lowestY = [];
    series = _.map(series, series => {

        const newSeries = {
            data: _.map(series.data, (point, pointIndex) => {
                stackedY[pointIndex] = stackedY[pointIndex] || 0;
                if (_.isUndefined(lowestY[pointIndex])) {
                    lowestY[pointIndex] = stackedY[pointIndex];
                }
                const newPoint = {
                    y0: stackedY[pointIndex],
                    y: stackedY[pointIndex] + point.y
                };
                stackedY[pointIndex] = newPoint.y;

                return _.defaults(newPoint, point);
            })
        };

        return _.defaults(newSeries, series);
    });

    minY = _.min(lowestY);
    const stackedMaxY = _.max(stackedY);
    maxY = Math.max(stackedMaxY, maxY);

    if (normalize) {

        const ratios = _.map(stackedY, y => stackedMaxY / y);
        series = _.map(series, series => {
            const newSeries = {
                data: _.map(series.data, (point, pointIndex) => {
                    const newPoint = {
                        y0: point.y0 * ratios[pointIndex],
                        y: point.y * ratios[pointIndex]
                    };
                    return _.defaults(newPoint, point);
                })
            };
            return _.defaults(newSeries, series);
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
