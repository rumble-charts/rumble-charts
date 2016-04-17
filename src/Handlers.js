'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    helpers = require('./helpers');

/**
 * Helps to use mouse events. For now supports only "`onMouseMove`" and "`onMouseLeave`".
 * 
 * This component will be improved and simplified in the future.
 *
 * @example ../docs/examples/Handlers.md
 */
var Handlers = React.createClass({

    displayName: 'Handlers',

    propTypes: {
        className: React.PropTypes.string,
        series: React.PropTypes.array,
        sensitivity: React.PropTypes.number,
        optimized: React.PropTypes.bool,
        onMouseMove: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool]),
        onMouseLeave: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool])
    },

    // init

    getDefaultProps() {
        return {
            sensitivity: Infinity,
            optimized: true
        };
    },

    // helpers

    updatePoint0() {
        let target = ReactDOM.findDOMNode(this.rect);
        let rect = target.getBoundingClientRect();
        this.left = rect.left;
        this.top = rect.top;
    },

    updateScales() {
        let {props} = this;
        let {scaleX, scaleY} = props;
        this.x = scaleX.factory(props);
        this.y = scaleY.factory(props);
        this.scaleX = scaleX.factory(props);
        this.scaleY = scaleY.factory(props);

        let xDomain = this.x.domain();
        let xRange = this.x.range();
        this.x.domain(xRange);
        this.x.range(xDomain);

        let yDomain = this.y.domain();
        let yRange = this.y.range();
        this.y.domain(yRange);
        this.y.range(yDomain);

        this.ratio = Math.abs((this.y(1) - this.y(0)) / (this.x(1) - this.x(0)));
    },

    // handlers

    handleMouseMove(event) {
        this.updatePoint0();

        let {clientX, clientY} = event;
        let {left, top, props} = this;
        let {onMouseMove, series, sensitivity, optimized} = props;
        let realX = clientX - left;
        let realY = clientY - top;
        let x = this.x(realX);
        let y = this.y(realY);

        var closestPoints = [];
        var minDistance = sensitivity;
        _.each(series, (series, seriesIndex) => {
            _.each(series.data, (point, pointIndex) => {
                let distance = Math.sqrt(
                    Math.pow(Math.abs(point.x - x) * (this.ratio || 1), 2) +
                    Math.pow(Math.abs(point.y - y), 2)
                );
                if (!optimized || distance <= minDistance) {
                    minDistance = distance;
                    closestPoints.push({
                        seriesIndex,
                        pointIndex,
                        point,
                        distance
                    });
                }
            });
        });
        closestPoints = _.sortBy(closestPoints, 'distance');

        onMouseMove({
            clientX: realX,
            clientY: realY,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            x,
            y,
            closestPoints,
            originalEvent: event
        });
    },

    // render

    render() {
        let {props} = this;
        let {className, scaleX, scaleY, layerWidth, layerHeight} = props;
        let {onMouseMove, onMouseLeave} = props;

        this.updateScales();

        let children = helpers.proxyChildren(
            props.children,
            props,
            {
                layerWidth,
                layerHeight,
                scaleX,
                scaleY
            }
        );


        return <g
            className={className}
            onMouseMove={onMouseMove && this.handleMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <rect
                ref={ref => this.rect = ref}
                x={0} y={0} width={layerWidth} height={layerHeight}
                fill='transparent' stroke='transparent'/>
            {children}
        </g>;

    }

});

module.exports = Handlers;
