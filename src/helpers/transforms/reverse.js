import _ from 'lodash';

export default function reverse({series, seriesNormalized, minX, maxX, maxY, minY}) {
    if (_.isArray(series)) {
        series = _.cloneDeep(series).reverse();
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
