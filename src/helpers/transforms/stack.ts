import type {NormalizedSeriesProps} from '../../types';

import {isUndefined} from '../isUndefined';

type Options = {
    normalize?: boolean
}

export function stack(props: NormalizedSeriesProps, options: Options = {}): NormalizedSeriesProps {
    const {normalize} = options || {};

    let {series, maxY, minY} = props;
    const {seriesNormalized, maxX, minX} = props;

    const stackedY: number[] = [],
        lowestY: number[] = [];

    series = series?.map(series => {

        const newSeries = {
            data: series.data?.map((point, pointIndex) => {
                stackedY[pointIndex] = stackedY[pointIndex] || 0;
                if (isUndefined(lowestY[pointIndex])) {
                    lowestY[pointIndex] = stackedY[pointIndex];
                }
                const newPoint = {
                    y0: stackedY[pointIndex],
                    y: stackedY[pointIndex] + point.y
                };
                stackedY[pointIndex] = newPoint.y;

                return {
                    ...point,
                    ...newPoint
                };
            })
        };

        return {
            ...series,
            ...newSeries,
        };
    });

    minY = Math.min(minY || 0, ...lowestY);
    const stackedMaxY = Math.max(...stackedY);
    maxY = Math.max(stackedMaxY, maxY || 0);

    if (normalize) {

        const ratios = stackedY.map(y => stackedMaxY / y);
        series = series?.map(series => {
            const newSeries = {
                data: series.data?.map((point, pointIndex) => {
                    const newPoint = {
                        y0: (point.y0 || 0) * ratios[pointIndex],
                        y: point.y * ratios[pointIndex]
                    };

                    return {
                        ...point,
                        ...newPoint
                    };
                })
            };
            return {
                ...series,
                ...newSeries
            };
        });

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
