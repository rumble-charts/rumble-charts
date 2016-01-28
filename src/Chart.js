'use strict';

var React = require('react'),
    _ = require('lodash'),
    d3 = require('d3'),
    helpers = require('./helpers');

var Chart = React.createClass({

    displayName: 'Chart',

    propTypes: {
        tag: React.PropTypes.string,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        series: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
                React.PropTypes.number,
                React.PropTypes.arrayOf(React.PropTypes.number),
                React.PropTypes.shape({
                    x: React.PropTypes.number,
                    y: React.PropTypes.number
                })
            ]))
        }))
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
                scaleX: {
                    direction: 1,
                    paddingStart: 0.5,
                    paddingEnd: 0.5,
                    paddingLeft: 0,
                    paddingRight: 0,
                    factory(props) {
                        let { paddingStart, paddingEnd, paddingLeft, paddingRight, direction, swap } = props.scaleX;
                        let { layerWidth, layerHeight } = props;
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
                },
                scaleY: {
                    direction: 1,
                    paddingStart: 0,
                    paddingEnd: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    factory(props) {
                        let { paddingStart, paddingEnd, paddingBottom, paddingTop, direction, swap } = props.scaleY;
                        let { layerWidth, layerHeight } = props;
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
                }
            }
        );

        var Tag = this.props.tag;

        /* jshint ignore:start */
        return <Tag {...this.props}>
            {children}
        </Tag>;
        /* jshint ignore:end */
    }

});

module.exports = Chart;
