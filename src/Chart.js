'use strict';

const React = require('react'),
    PropTypes = require('prop-types'),
    d3 = require('d3'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Every chart should start with `<Chart>` component. It serves to set sizes (`width` and `height`)
 * and to wrap all another components:
 * - [Graphics](#Graphics)
 * - [Wrappers](#Wrappers)
 * - [Helpers](#Helpers)
 *
 * Also read more about [hidden props](#Magic&#x20;&&#x20;hidden&#x20;props).
 *
 * @example ../docs/examples/Chart.md
 */
const Chart = React.createClass({

    displayName: 'Chart',

    propTypes: {
        /**
         * Chart width (pixels)
         */
        width: PropTypes.number.isRequired,
        /**
         * Chart height (pixels)
         */
        height: PropTypes.number.isRequired,
        /**
         * An array of series objects. Read more [about series](#Series). (or docs/series.md)
         */
        series: helpers.propTypes.series,
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
        }),

        layerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        layerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    },

    getDefaultProps() {
        return {
            series: [],
            tag: 'svg'
        };
    },

    // render

    render: function () {

        let children = helpers.proxyChildren(
            this.props.children,
            this.props,
            {
                layerWidth: this.props.width,
                layerHeight: this.props.height,
                scaleX: _.defaults({}, this.props.scaleX, {
                    direction: 1,
                    paddingStart: 0.5,
                    paddingEnd: 0.5,
                    paddingLeft: 0,
                    paddingRight: 0,
                    factory(props) {
                        let {paddingStart, paddingEnd, paddingLeft, paddingRight, direction, swap} = props.scaleX;
                        let {layerWidth, layerHeight} = props;
                        if (swap) {
                            layerWidth = layerHeight;
                        }
                        let minX = props.minX - paddingStart;
                        let maxX = props.maxX + paddingEnd;

                        return d3.scale.linear()
                            .range([
                                helpers.normalizeNumber(paddingLeft, layerWidth),
                                layerWidth - helpers.normalizeNumber(paddingRight, layerWidth)
                            ])
                            .domain(direction >= 0 ? [minX, maxX] : [maxX, minX]);
                    }
                }),
                scaleY: _.defaults({}, this.props.scaleY, {
                    direction: 1,
                    paddingStart: 0,
                    paddingEnd: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    factory(props) {
                        let {paddingStart, paddingEnd, paddingBottom, paddingTop, direction, swap} = props.scaleY;
                        let {layerWidth, layerHeight} = props;
                        if (swap) {
                            layerHeight = layerWidth;
                        }
                        let minY = props.minY - paddingStart;
                        let maxY = props.maxY + paddingEnd;

                        return d3.scale.linear()
                            .range([
                                layerHeight - helpers.normalizeNumber(paddingBottom, layerHeight),
                                helpers.normalizeNumber(paddingTop, layerHeight)
                            ])
                            .domain(direction >= 0 ? [minY, maxY] : [maxY, minY]);
                    }
                })
            }
        );

        const Tag = this.props.tag;

        return <Tag {..._.omit(this.props, [
            'series', 'tag', 'children', 'minX', 'maxX', 'minY', 'maxY',
            'scaleX', 'scaleY', 'layerWidth', 'layerHeight'
        ])}>
            {children}
        </Tag>;
    }

});

module.exports = Chart;
