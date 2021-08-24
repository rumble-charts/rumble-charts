import type {NormalizedSeries, NormalizedSeriesProps} from '../../types';

import {isString} from '../isString';
import {sortBy} from '../sortBy';

type Options = {
    direction?: 'asc' | 'desc';
};

export function sort(props: NormalizedSeriesProps, {direction}: Options = {}): NormalizedSeriesProps {
    direction = (isString(direction) ? direction.trim().toLowerCase() : 'asc') as Options['direction'];

    const {seriesNormalized, maxX, maxY, minX, minY} = props;
    let {series} = props;

    series = series?.map(series => {

        const newSeries: NormalizedSeries = {data: []};

        newSeries.data = sortBy(series.data, 'y');

        if (direction === 'desc') {
            newSeries.data.reverse();
        }

        newSeries.data = newSeries.data?.map((point, pointIndex) => {
            const newPoint = {
                realX: point.x,
                x: pointIndex
            };
            return {
                ...point,
                ...newPoint,
            };
        });

        newSeries.data = sortBy(newSeries.data, 'realX');

        return {
            ...series,
            ...newSeries
        };
    });

    return {
        series, seriesNormalized,
        maxX, maxY, minX, minY
    };
}
