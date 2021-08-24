import type {ReactElement, ReactNode} from 'react';
import type {ScaleX, ScaleY, Series, Size} from './types';

import React from 'react';
import {scaleLinear} from 'd3-scale';

import {isNumber, isUndefined, normalizeNumber, omitBy, proxyChildren} from './helpers';

export type ChartProps = {
    /**
     * Chart width
     */
    width?: Size,
    /**
     * Chart height
     */
    height?: Size,
    /**
     * Chart SVG viewBox.
     * Using that property user can make the chart responsive using CSS
     * Example: svg { width: 100%; height: auto; }
     */
    viewBox?: string,
    /**
     * Layer width (pixels). Useful when you want to make a responsive chart using viewBox prop, but
     * don't want to specify width of svg tag.
     */
    layerWidth?: number,
    /**
     * Layer height (pixels). Useful when you want to make a responsive chart using viewBox prop, but
     * don't want to specify height of svg tag.
     */
    layerHeight?: number,
    /**
     * An array of series objects. Read more [about series](#series). (or docs/series.md)
     */
    series?: Series[],
    /**
     * It can be change to `"g"`, if you want to include your chart inside another svg graphic.
     */
    tag?: string,
    /**
     * Rumble-charts components (one or more) or any other valid svg tag
     * (i.e. `<defs>`, `<g>`, `<rect>`, `<circle>` etc)
     */
    children: ReactNode,
    /**
     * Optional limit, affects on how graphics will be drawn. It's calculated automatically based on
     * `series` you've supplied, but sometimes you will need to define it by yourself.
     * Especially it relates to `minY` property. Very often you have to set it as `minY={0}`.
     */
    minX?: number,
    /**
     * See above
     */
    maxX?: number,
    /**
     * See above
     */
    minY?: number,
    /**
     * See above
     */
    maxY?: number,
    /**
     * X-scale (horizontal) attributes. For better understanding see examples below.
     */
    scaleX?: ScaleX;
    /**
     * Y-scale (vertical) attributes. For better understanding see examples below.
     */
    scaleY?: ScaleY;
} & Record<string, any>;

/**
 * Every chart should start with `<Chart>` component. It serves to set sizes (`width` and `height`)
 * and to wrap all another components:
 * - [Graphics](#graphics)
 * - [Wrappers](#wrappers)
 * - [Helpers](#helpers)
 *
 * Also read more about [hidden props](#magic--hidden-props).
 *
 * @example ../docs/examples/Chart.md
 */
export function Chart(
    allProps: ChartProps
): ReactElement {
    const {
        series = [], tag = 'svg',
        width, height,
        layerWidth = width, layerHeight = height,
        viewBox = `0 0 ${layerWidth} ${layerHeight}`,
        scaleX = {}, scaleY = {}, minX, minY, maxX, maxY, children,
        ...props
    } = allProps;

    let _layerWidth = layerWidth;
    let _layerHeight = layerHeight;

    if (viewBox) {
        const viewBoxTotal = viewBox.split(' ').map(value => parseInt(value));
        _layerWidth = _layerWidth || Number(viewBoxTotal[2]);
        _layerHeight = _layerHeight || Number(viewBoxTotal[3]);
    }
    if (!isNumber(_layerWidth)) {
        throw `Props "width" (as number), "layerWidth" or "viewBox" expected for <Chart> component. ${JSON.stringify(_layerWidth)} received instead.`;
    }
    if (!isNumber(_layerHeight)) {
        throw `Props "height" (as number), "layerHeight" or "viewBox" expected for <Chart> component. ${JSON.stringify(_layerHeight)} received instead.`;
    }

    const newChildren = proxyChildren(
        children,
        omitBy({series, minX, minY, maxX, maxY}, isUndefined),
        {
            layerWidth: _layerWidth,
            layerHeight: _layerHeight,
            scaleX: {
                direction: 1,
                paddingStart: 0.5,
                paddingEnd: 0.5,
                paddingLeft: 0,
                paddingRight: 0,
                factory({layerWidth = 0, layerHeight = 0, scaleX = {}, minX = 0, maxX = 0}) {
                    const {
                        paddingStart = 0.5,
                        paddingEnd = 0.5,
                        paddingLeft = 0,
                        paddingRight = 0,
                        direction = 1,
                        swap
                    } = scaleX;
                    if (swap) {
                        layerWidth = layerHeight;
                    }
                    minX = minX - paddingStart;
                    maxX = maxX + paddingEnd;

                    return scaleLinear()
                        .range([
                            normalizeNumber(paddingLeft, layerWidth),
                            layerWidth - normalizeNumber(paddingRight, layerWidth)
                        ])
                        .domain(direction >= 0 ? [minX, maxX] : [maxX, minX]);
                },
                ...scaleX
            } as ScaleX,
            scaleY: {
                direction: 1,
                paddingStart: 0,
                paddingEnd: 0,
                paddingTop: 0,
                paddingBottom: 0,
                factory({layerWidth = 0, layerHeight = 0, scaleY = {}, minY = 0, maxY = 0}) {
                    const {
                        paddingStart = 0,
                        paddingEnd = 0,
                        paddingBottom = 0,
                        paddingTop = 0,
                        direction = 1,
                        swap
                    } = scaleY;
                    if (swap) {
                        layerHeight = layerWidth;
                    }
                    minY = minY - paddingStart;
                    maxY = maxY + paddingEnd;

                    return scaleLinear()
                        .range([
                            layerHeight - normalizeNumber(paddingBottom, layerHeight),
                            normalizeNumber(paddingTop, layerHeight)
                        ])
                        .domain(direction >= 0 ? [minY, maxY] : [maxY, minY]);
                },
                ...scaleY
            } as ScaleY
        }
    );

    return React.createElement(tag, {
        ...props,
        width, height, viewBox,
    }, newChildren);
}
