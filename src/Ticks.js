import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import normalizeNumber from './helpers/normalizeNumber';
import value from './helpers/value';

/**
 * Renders ticks (labels and lines) for axis (x and y).
 *
 * @example ../docs/examples/Ticks.md
 */
export default class Ticks extends Component {

    constructor(props) {
        super(props);

        this.generateTicks = this.generateTicks.bind(this);

        this.renderTick = this.renderTick.bind(this);
        this.renderLabel = this.renderLabel.bind(this);
        this.renderLine = this.renderLine.bind(this);
    }

    // helpers

    generateTicks(config) {
        const {props} = this;
        const {axis, maxX, maxY, minX, minY} = props;
        let {maxTicks, minDistance, distance} = config;

        const max = axis === 'y' ? maxY : maxX;
        const min = axis === 'y' ? minY : minX;
        const length = max - min;

        if (_.isUndefined(minDistance)) {
            minDistance = Math.min(1, length);
        }

        if (_.isUndefined(maxTicks)) {
            maxTicks = Math.min((length + minDistance) / minDistance, 5);
        }

        if (_.isUndefined(distance)) {
            distance = Math.max(minDistance, length / maxTicks);
            distance = Math.ceil(distance / minDistance) * minDistance;
        }

        return _.range(min, max + minDistance, distance);
    }

    // render

    renderTick(ticksLength, tick, index) {
        const {props, x, y, position} = this;
        const {axis, className, layerWidth, layerHeight, scaleX, scaleY} = props;
        let {tickStyle, tickAttributes, tickVisible} = props;

        if (_.isNumber(tick)) {
            tick = {[axis]: tick};
        }

        tickVisible = value(tickVisible, {index, ticksLength, tick, props});

        if (!tickVisible) {
            return;
        }

        tickAttributes = value(tickAttributes, {index, ticksLength, tick, props});
        tickStyle = value(tickStyle, {index, ticksLength, tick, props});

        const pX = axis === 'x' ? x(tick.x) : normalizeNumber(position, layerWidth);
        const pY = axis === 'y' ? y(tick.y) : normalizeNumber(position, layerHeight);

        const transform = (scaleX.swap || scaleY.swap) ?
            ('translate(' + pY + ' ' + pX + ')') :
            ('translate(' + pX + ' ' + pY + ')');

        return <g
            key={index} style={tickStyle}
            transform={transform}
            className={className && (className + '-tick ' + className + '-tick-' + index)}
            {...tickAttributes}>
            {this.renderLabel(ticksLength, tick, index)}
            {this.renderLine(ticksLength, tick, index)}
        </g>;
    }

    renderLabel(ticksLength, tick, index) {
        const {props} = this;
        const {className, axis} = props;
        let {labelStyle, labelFormat, labelVisible, labelAttributes, label} = props;

        labelVisible = value(labelVisible, {index, ticksLength, tick, props});
        if (labelVisible) {

            labelAttributes = value([tick.labelAttributes, labelAttributes], {index, ticksLength, tick, props});
            labelStyle = value([tick.labelStyle, labelStyle], {index, ticksLength, tick, props});

            label = value([tick.label, label, tick[axis]], {index, ticksLength, tick, props});

            if (_.isString(label) || _.isNumber(label)) {
                return <text
                    style={labelStyle}
                    className={className && (className + '-label ' + className + '-label-' + index)}
                    {...labelAttributes}>
                    {value(labelFormat, label + '') || label}
                </text>;
            } else {
                return label;
            }
        }
    }

    renderLine(ticksLength, tick, index) {
        const {props, horizontal} = this;
        const {layerWidth, layerHeight, className} = props;

        let {lineVisible, lineAttributes, lineStyle, lineLength, lineOffset} = props;

        lineVisible = value(lineVisible, {index, ticksLength, tick, props});

        if (!lineVisible) {
            return null;
        }

        lineAttributes = value([tick.lineAttributes, lineAttributes], {index, ticksLength, tick, props});
        lineStyle = value([tick.lineStyle, lineStyle], {index, ticksLength, tick, props});

        lineLength = normalizeNumber(
            value([tick.lineLength, lineLength], {index, ticksLength, tick, props}),
            horizontal ? layerWidth : layerHeight
        );
        lineOffset = normalizeNumber(
            value([tick.lineOffset, lineOffset], {index, ticksLength, tick, props}),
            horizontal ? layerWidth : layerHeight
        );

        const d = horizontal ?
            ('M' + lineOffset + ',0 h' + lineLength) :
            ('M0,' + lineOffset + ' v' + lineLength);

        return <path
            style={lineStyle}
            className={className && (className + '-line ' + className + '-line-' + index)}
            d={d}
            {...lineAttributes} />;
    }

    render() {
        const {props} = this;
        const {className, position, scaleX, scaleY, axis, style} = props;
        let {ticks} = props;

        this.x = scaleX.factory(props);
        this.y = scaleY.factory(props);
        this.horizontal = (axis === 'y' && !scaleX.swap && !scaleY.swap) ||
            (axis === 'x' && (scaleX.swap || scaleY.swap));
        this.position = position ||
            (axis === 'x' ?
                (scaleX.swap || scaleY.swap ? 'top' : 'bottom') :
                'left');

        ticks = value([ticks], props);
        if (_.isNumber(ticks)) {
            ticks = {maxTicks: ticks};
        }
        ticks = ticks || {};
        if (_.isPlainObject(ticks)) {
            ticks = this.generateTicks(ticks);
        }

        return <g className={className} style={style} opacity={props.opacity}>
            {_.map(ticks, this.renderTick.bind(this, ticks.length))}
        </g>;
    }

}

Ticks.displayName = 'Ticks';

Ticks.propTypes = {
    style: PropTypes.object,
    opacity: PropTypes.number,
    className: PropTypes.string,

    axis: PropTypes.string,
    position: PropTypes.string,

    tickVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    tickAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    tickStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.func]),
    labelVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    labelAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    labelFormat: PropTypes.func,

    lineVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    lineAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    lineStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    lineLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),
    lineOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),

    ticks: PropTypes.oneOfType([
        // ticks factory
        PropTypes.func,
        // how many ticks to show
        PropTypes.number,
        // settings
        PropTypes.shape({
            maxTicks: PropTypes.number,
            minDistance: PropTypes.number,
            distance: PropTypes.number
        }),
        // ticks themselves
        PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.shape({
                x: PropTypes.number,
                y: PropTypes.number,
                label: PropTypes.oneOfType([
                    PropTypes.func,
                    PropTypes.string,
                    PropTypes.node
                ]),
                labelStyle: PropTypes.object,
                labelAttributes: PropTypes.object,
                lineStyle: PropTypes.object,
                lineAttributes: PropTypes.object,
                lineLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
                lineOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            })
        ]))
    ]),

    scaleX: PropTypes.object,
    scaleY: PropTypes.object,
    layerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    layerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number
};


Ticks.defaultProps = {
    axis: 'x',
    tickVisible: true,
    labelVisible: true,
    lineVisible: true,
    lineLength: 5,
    lineOffset: 0
};
