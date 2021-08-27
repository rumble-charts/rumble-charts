import type {Point, Series} from '../types';

import {isFunction} from './isFunction';
import {random} from './random';
import {range} from './range';

type RandomParams = {
    seriesIndex: number;
    pointIndex: number;
    value: number;
};

type Options = {
    type?: 'number' | 'integer' | 'array' | 'object';
    min?: number;
    max?: number;
    float?: boolean;
    point?: Point | ((params: RandomParams) => Point)
};

export function generateRandomSeries(seriesCount: number, pointsCount: number, options: Options = {}): Series[] {
    options = {
        type: 'number', // number, integer, array, object
        min: 1,
        max: 100,
        float: false,
        ...options,
    };
    const type = options.type ? options.type.toLowerCase() : 'number';

    return range(seriesCount).map(seriesIndex => {
        const _pointsCount = isFunction(pointsCount) ? pointsCount(seriesIndex) : pointsCount;
        return {
            data: range(_pointsCount).map(pointIndex => {
                const value = random(options.min, options.max, options.float);
                if (type === 'array') {
                    return [pointIndex, value];
                } else if (type === 'object') {
                    let {point} = options;
                    if (isFunction(point)) {
                        point = point({seriesIndex, pointIndex, value});
                    }
                    return {
                        x: pointIndex,
                        y: value,
                        ...point
                    };
                } else {
                    return value;
                }
            })
        };
    });

}
