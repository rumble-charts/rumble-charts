import _ from 'lodash';

export default function unstack(props) {

    const {series, seriesNormalized, maxX, maxY, minX, minY} = props;

    const newSeries = _.map(series, series => {
        const newSeries = {
            data: _.map(series.data, point => {
                const newPoint = _.omit(point, ['y0', 'y']);
                newPoint.y = point.y - point.y0;
                return newPoint;
            })
        };
        return _.defaults(newSeries, series);
    }, []);

    return {
        series: newSeries,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY
    };
}
