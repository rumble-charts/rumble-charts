import { defaults, forEach } from 'lodash';

export default function transpose(props) {

    const {series, seriesNormalized, minX, maxY, minY} = props;

    let maxX = 0;
    const newSeries = [];
    forEach(series, (series, seriesIndex) => {
        forEach(series.data, (point, pointIndex) => {
            newSeries[pointIndex] = newSeries[pointIndex] || {data: []};
            maxX = Math.max(maxX, seriesIndex);
            newSeries[pointIndex].data[seriesIndex] = defaults({
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
