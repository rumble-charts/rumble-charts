import type {NormalizedSeries, NormalizedSeriesProps} from '../../types';

export function transpose(props: NormalizedSeriesProps): NormalizedSeriesProps {

    const {series, seriesNormalized, minX, maxY, minY} = props;

    let maxX = 0;
    const newSeries: NormalizedSeries[] = [];
    series?.forEach((series, seriesIndex) => {
        series.data?.forEach((point, pointIndex) => {
            newSeries[pointIndex] = newSeries[pointIndex] || {data: []};
            maxX = Math.max(maxX, seriesIndex);
            newSeries[pointIndex].data[seriesIndex] = {
                ...point,
                realX: point.x,
                x: seriesIndex
            };
        });
    });

    return {
        series: newSeries, seriesNormalized,
        maxX, maxY, minX, minY
    };
}
