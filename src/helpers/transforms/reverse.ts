import type {NormalizedSeriesProps} from '../../types';

export function reverse(
    {series, seriesNormalized, minX, maxX, maxY, minY}: NormalizedSeriesProps
): NormalizedSeriesProps {
    series = Array.isArray(series) ? [...series].reverse() : series;
    return {
        series,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY
    };
}
