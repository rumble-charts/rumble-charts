import type {NormalizedSeriesProps, Point, SeriesProps} from '../types';

import {isNumber} from './isNumber';
import {isUndefined} from './isUndefined';
import {omitBy} from './omitBy';

const isInvalidLimit = (value: any): boolean => {
    return isUndefined(value) || value === Infinity || value === -Infinity;
};

export function normalizeSeries(props: SeriesProps): NormalizedSeriesProps {
    let maxX = -Infinity,
        maxY = -Infinity,
        minX = Infinity,
        minY = Infinity;

    let series = props?.series?.map(series => {

        const data = series.data?.map((item, index) => {

            let d: Point;
            if (!props.seriesNormalized) {
                d = {} as Point;
                if (isNumber(item)) {
                    d.x = index;
                    d.y = item;
                } else if (Array.isArray(item)) {
                    d.x = item[0];
                    d.y = item[1];
                } else {
                    d = item || ({} as Point);
                    if (isUndefined(d.x)) {
                        d.x = index;
                    }
                }
            } else {
                d = item as Point;
            }
            if (isUndefined(props.maxX)) {
                maxX = Math.max(maxX, d.x || 0);
            }
            if (isUndefined(props.maxY)) {
                maxY = Math.max(maxY, d.y || 0);
            }
            if (isUndefined(props.minX)) {
                minX = Math.min(minX, d.x || 0);
            }
            if (isUndefined(props.minY)) {
                minY = Math.min(minY, d.y || 0);
            }

            return d;
        });

        return {
            ...series,
            data
        };
    });

    if (series && series.length === 0) {
        series = undefined;
    }

    if (!isUndefined(props.maxX)) {
        maxX = props.maxX;
    }
    if (!isUndefined(props.maxY)) {
        maxY = props.maxY;
    }
    if (!isUndefined(props.minX)) {
        minX = props.minX;
    }
    if (!isUndefined(props.minY)) {
        minY = props.minY;
    }

    return omitBy({
        seriesNormalized: true,
        series,
        maxX,
        maxY,
        minX,
        minY
    }, isInvalidLimit);
}
