import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import { defaults, map, omit } from 'lodash';

import proxyChildren from './helpers/proxyChildren';
import normalizeNumber from './helpers/normalizeNumber';
import propTypes from './helpers/propTypes';

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
export default function Chart(props) {
    const {viewBox} = props;
    let {width, height, layerWidth, layerHeight} = props;
    width = width || layerWidth;
    height = height || layerHeight;

    if (viewBox) {
        let viewBoxTotal = map(viewBox.split(' '), value => parseInt(value));
        width = width || viewBoxTotal[2];
        height = height || viewBoxTotal[3];
    }

    const children = proxyChildren(
        props.children,
        props,
        {
            layerWidth: width,
            layerHeight: height,
            scaleX: defaults({}, props.scaleX, {
                direction: 1,
                paddingStart: 0.5,
                paddingEnd: 0.5,
                paddingLeft: 0,
                paddingRight: 0,
                factory(props) {
                    const {paddingStart, paddingEnd, paddingLeft, paddingRight, direction, swap} = props.scaleX;
                    let {layerWidth, layerHeight} = props;
                    if (swap) {
                        layerWidth = layerHeight;
                    }
                    const minX = props.minX - paddingStart;
                    const maxX = props.maxX + paddingEnd;

                    return d3.scale.linear()
                        .range([
                            normalizeNumber(paddingLeft, layerWidth),
                            layerWidth - normalizeNumber(paddingRight, layerWidth)
                        ])
                        .domain(direction >= 0 ? [minX, maxX] : [maxX, minX]);
                }
            }),
            scaleY: defaults({}, props.scaleY, {
                direction: 1,
                paddingStart: 0,
                paddingEnd: 0,
                paddingTop: 0,
                paddingBottom: 0,
                factory(props) {
                    const {paddingStart, paddingEnd, paddingBottom, paddingTop, direction, swap} = props.scaleY;
                    let {layerWidth, layerHeight} = props;
                    if (swap) {
                        layerHeight = layerWidth;
                    }
                    const minY = props.minY - paddingStart;
                    const maxY = props.maxY + paddingEnd;

                    return d3.scale.linear()
                        .range([
                            layerHeight - normalizeNumber(paddingBottom, layerHeight),
                            normalizeNumber(paddingTop, layerHeight)
                        ])
                        .domain(direction >= 0 ? [minY, maxY] : [maxY, minY]);
                }
            })
        }
    );

    const Tag = props.tag;

    return <Tag
        {...omit(props, [
            'series', 'tag', 'children', 'minX', 'maxX', 'minY', 'maxY',
            'scaleX', 'scaleY', 'layerWidth', 'layerHeight'
        ])}
        viewBox={viewBox || `0 0 ${width} ${height}`}>
        {children}
    </Tag>;
}

Chart.displayName = 'Chart';

Chart.propTypes = {
    /**
     * Chart width (pixels)
     */
    width: PropTypes.number,
    /**
     * Chart height (pixels)
     */
    height: PropTypes.number,
    /**
     * Chart SVG viewBox.
     * Using that property user can make the chart responsive using CSS
     * Example: svg { width: 100%; height: auto; }
     */
    viewBox: PropTypes.string,
    /**
     * Layer width (pixels). Useful when you want to make a responsive chart using viewBox prop, but
     * don't want to specify width of svg tag.
     */
    layerWidth: PropTypes.number,
    /**
     * Layer height (pixels). Useful when you want to make a responsive chart using viewBox prop, but
     * don't want to specify height of svg tag.
     */
    layerHeight: PropTypes.number,
    /**
     * An array of series objects. Read more [about series](#series). (or docs/series.md)
     */
    series: propTypes.series,
    /**
     * It can be change to `"g"`, if you want to include your chart inside another svg graphic.
     */
    tag: PropTypes.string,
    /**
     * Rumble-charts components (one or more) or any other valid svg tag
     * (i.e. `<defs>`, `<g>`, `<rect>`, `<circle>` etc)
     */
    children: PropTypes.node,
    /**
     * Optional limit, affects on how graphics will be drawn. It's calculated automatically based on
     * `series` you've supplied, but sometimes you will need to define it by yourself.
     * Especially it relates to `minY` property. Very often you have to set it as `minY={0}`.
     */
    minX: PropTypes.number,
    /**
     * See above
     */
    maxX: PropTypes.number,
    /**
     * See above
     */
    minY: PropTypes.number,
    /**
     * See above
     */
    maxY: PropTypes.number,
    /**
     * X-scale (horizontal) attributes. For better understanding see examples below.
     */
    scaleX: PropTypes.shape({
        /**
         * 1 or -1, default value is 1
         */
        direction: PropTypes.number,
        /**
         * Padding at the start of the scale domain, default value is 0.5
         */
        paddingStart: PropTypes.number,
        /**
         * Padding at the end of the scale domain, default value is 0.5
         */
        paddingEnd: PropTypes.number,
        /**
         * Left padding in pixels, default value is 0
         */
        paddingLeft: PropTypes.number,
        /**
         * Right padding in pixels, default value is 0
         */
        paddingRight: PropTypes.number,
        factory: PropTypes.func,
        swap: PropTypes.boolean
    }),
    /**
     * Y-scale (vertical) attributes. For better understanding see examples below.
     */
    scaleY: PropTypes.shape({
        /**
         * 1 or -1, default value is 1
         */
        direction: PropTypes.number,
        /**
         * Padding at the start of the scale domain, default value is 0
         */
        paddingStart: PropTypes.number,
        /**
         * Padding at the end of the scale domain, default value is 0
         */
        paddingEnd: PropTypes.number,
        /**
         * Top padding in pixels, default value is 0
         */
        paddingTop: PropTypes.number,
        /**
         * Bottom padding in pixels, default value is 0
         */
        paddingBottom: PropTypes.number,
        factory: PropTypes.func,
        swap: PropTypes.boolean
    })
};

Chart.defaultProps = {
    series: [],
    tag: 'svg'
};
