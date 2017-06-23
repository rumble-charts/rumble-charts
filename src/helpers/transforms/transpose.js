import _ from 'lodash';

export default function transpose(props) {

    const {series, seriesNormalized, minX, maxY, minY} = props;

    let maxX = 0;
    const newSeries = [];
    _.forEach(series, (series, seriesIndex) => {
        _.forEach(series.data, (point, pointIndex) => {
            newSeries[pointIndex] = newSeries[pointIndex] || {data: []};
            maxX = Math.max(maxX, seriesIndex);
            newSeries[pointIndex].data[seriesIndex] = _.defaults({
                realX: point.x,
                x: seriesIndex
            }, point);
        });
    });

    return {
        series: newSeries, seriesNormalized,
        maxX, maxY, minX, minY
    };
}
