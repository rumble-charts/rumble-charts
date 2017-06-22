import _ from 'lodash';

export default function unstack(props) {

    let {series, seriesNormalized, maxX, maxY, minX, minY} = props;

    series = _.map(series, series => {
        var newSeries = {};
        newSeries.data = _.map(series.data, point => {
            var newPoint = {
                y0: 0
            };
            return _.defaults(newPoint, point);
        });
        return _.defaults(newSeries, series);
    });

    return {
        series,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY
    };
}
