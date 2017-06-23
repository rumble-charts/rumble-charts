import _ from 'lodash';

export default function reverse({series, seriesNormalized, minX, maxX, maxY, minY}) {
    series = _.isArray(series) ? _.cloneDeep(series).reverse() : series;
    return {
        series,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY
    };
}
