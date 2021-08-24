import type {NormalizedSeries, NormalizedSeriesProps, Point} from '../../types';

import {omit} from '../omit';

export function unstack(props: NormalizedSeriesProps): NormalizedSeriesProps {

    const {series, seriesNormalized, maxX, maxY, minX, minY} = props;

    const newSeries: NormalizedSeries[] = series
        ? series.map(series => {
            const newSeries = {
                data: series.data?.map(point => {
                    const newPoint = omit(point, ['y0', 'y']);
                    newPoint.y = point.y - point.y0;
                    return newPoint as Point;
                })
            };
            return {
                ...series,
                ...newSeries
            };
        }, [])
        : [];

    return {
        series: newSeries,
        seriesNormalized,
        maxX,
        maxY,
        minX,
        minY
    };
}
