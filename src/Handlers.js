'use strict';

const React = require('react'),
    _ = require('lodash'),
    helpers = require('./helpers');

/**
 * Helps to use mouse events. For now supports only "`onClick`", "`onMouseMove`" and "`onMouseLeave`".
 *
 * This component will be improved and simplified in the future.
 *
 * @example ../docs/examples/Handlers.md
 */
const Handlers = React.createClass({

    displayName: 'Handlers',

    propTypes: {
        className: React.PropTypes.string,
        series: React.PropTypes.array,
        sensitivity: React.PropTypes.number,
        optimized: React.PropTypes.bool,
        distance: React.PropTypes.oneOf(['x', 'y']),
        onClick: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool]),
        onMouseMove: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool]),
        onMouseLeave: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool]),
        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
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
        let rect = this.rect.getBoundingClientRect();
        this.left = rect.left;
        this.top = rect.top;
        this.width = rect.width;
        this.height = rect.height;
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

    handleMouseEvent(event, handler) {
        this.updatePoint0();

        let {clientX, clientY} = event;
        let {left, top, props} = this;
        let {series, sensitivity, optimized, layerWidth, layerHeight} = props;
        let realX = (clientX - left) * layerWidth / this.width;
        let realY = (clientY - top) * layerHeight / this.height;
        let x = this.x(realX);
        let y = this.y(realY);

        let closestPoints = [];
        let minDistance = sensitivity;
        _.forEach(series, (series, seriesIndex) => {
            _.forEach(series.data, (point, pointIndex) => {
                let distance;
                switch (props.distance) {
                case 'x':
                    distance = Math.abs(point.x - x);
                    break;
                case 'y':
                    distance = Math.abs(point.y - y);
                    break;
                default:
                    distance = Math.sqrt(
                        Math.pow(Math.abs(point.x - x) * (this.ratio || 1), 2) +
                        Math.pow(Math.abs(point.y - y), 2)
                    );
                    break;
                }

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

        handler({
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

    handleMouseMove(event) {
        this.handleMouseEvent(event, this.props.onMouseMove);
    },

    handleClick(event) {
        this.handleMouseEvent(event, this.props.onClick);
    },

    // render

    render() {
        let {props} = this;
        let {className, scaleX, scaleY, layerWidth, layerHeight} = props;
        let {onClick, onMouseMove, onMouseLeave} = props;

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
            onClick={onClick && this.handleClick}
            onMouseMove={onMouseMove && this.handleMouseMove}
            onMouseLeave={onMouseLeave}>
            <rect
                ref={ref => this.rect = ref}
                x={0} y={0} width={layerWidth} height={layerHeight}
                fill='transparent' stroke='transparent'/>
            {children}
        </g>;
    }

});

module.exports = Handlers;
