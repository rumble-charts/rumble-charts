import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import proxyChildren from './helpers/proxyChildren';

/**
 * Helps to use mouse events. For now supports only "`onClick`", "`onMouseMove`" and "`onMouseLeave`".
 *
 * This component will be improved and simplified in the future.
 *
 * @example ../docs/examples/Handlers.md
 */
export default class Handlers extends Component {

    constructor(props) {
        super(props);

        this.updatePoint0 = this.updatePoint0.bind(this);
        this.updateScales = this.updateScales.bind(this);

        this.handleMouseEvent = this.handleMouseEvent.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    // helpers

    updatePoint0() {
        const rect = this.rect.getBoundingClientRect();
        this.left = rect.left;
        this.top = rect.top;
        this.width = rect.width;
        this.height = rect.height;
    }

    updateScales() {
        const {props} = this;
        const {scaleX, scaleY} = props;
        this.x = scaleX.factory(props);
        this.y = scaleY.factory(props);
        this.scaleX = scaleX.factory(props);
        this.scaleY = scaleY.factory(props);

        const xDomain = this.x.domain();
        const xRange = this.x.range();
        this.x.domain(xRange);
        this.x.range(xDomain);

        const yDomain = this.y.domain();
        const yRange = this.y.range();
        this.y.domain(yRange);
        this.y.range(yDomain);

        this.ratio = Math.abs((this.y(1) - this.y(0)) / (this.x(1) - this.x(0)));
    }

    // handlers

    handleMouseEvent(event, handler) {
        this.updatePoint0();

        const {clientX, clientY} = event;
        const {left, top, props} = this;
        const {series, sensitivity, optimized, layerWidth, layerHeight} = props;
        const realX = (clientX - left) * layerWidth / this.width;
        const realY = (clientY - top) * layerHeight / this.height;
        const x = this.x(realX);
        const y = this.y(realY);

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
    }

    handleMouseMove(event) {
        this.handleMouseEvent(event, this.props.onMouseMove);
    }

    handleClick(event) {
        this.handleMouseEvent(event, this.props.onClick);
    }

    // render

    render() {
        const {props} = this;
        const {className, scaleX, scaleY, layerWidth, layerHeight} = props;
        const {onClick, onMouseMove, onMouseLeave} = props;

        this.updateScales();

        const children = proxyChildren(
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

}

Handlers.displayName = 'Handlers';

Handlers.propTypes = {
    className: PropTypes.string,
    series: PropTypes.array,
    sensitivity: PropTypes.number,
    optimized: PropTypes.bool,
    distance: PropTypes.oneOf(['x', 'y']),
    onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onMouseMove: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onMouseLeave: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    scaleX: PropTypes.object,
    scaleY: PropTypes.object,
    layerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    layerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

Handlers.defaultProps = {
    sensitivity: Infinity,
    optimized: true
};
