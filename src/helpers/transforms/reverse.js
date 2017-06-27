import { cloneDeep, isArray } from 'lodash';

export default function reverse({series, seriesNormalized, minX, maxX, maxY, minY}) {
    series = isArray(series) ? cloneDeep(series).reverse() : series;
    return {
        series,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY
    };
}
