'use strict';

const React = require('react'),
    PropTypes = require('prop-types'),
    helpers = require('./helpers'),
    _isUndefined = require('lodash/isUndefined'),
    _range = require('lodash/range'),
    _isNumber = require('lodash/isNumber'),
    _isString = require('lodash/isString'),
    _isPlainObject = require('lodash/isPlainObject'),
    _map = require('lodash/map');

/**
 * Renders ticks (labels and lines) for axis (x and y).
 *
 * @example ../docs/examples/Ticks.md
 */
class Ticks extends React.Component {

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

        if (_isUndefined(minDistance)) {
            minDistance = Math.min(1, length);
        }

        if (_isUndefined(maxTicks)) {
            maxTicks = Math.min((length + minDistance) / minDistance, 5);
        }

        if (_isUndefined(distance)) {
            distance = Math.max(minDistance, length / maxTicks);
            distance = Math.ceil(distance / minDistance) * minDistance;
        }

        return _range(min, max + minDistance, distance);
    }

    // render

    renderTick(ticksLength, tick, index) {
        const {props, x, y, position} = this;
        const {axis, className, layerWidth, layerHeight, scaleX, scaleY} = props;
        let {tickStyle, tickAttributes, tickVisible} = props;

        if (_isNumber(tick)) {
            tick = {[axis]: tick};
        }

        tickVisible = helpers.value(tickVisible, {index, ticksLength, tick, props});

        if (!tickVisible) {
            return;
        }

        tickAttributes = helpers.value(tickAttributes, {index, ticksLength, tick, props});
        tickStyle = helpers.value(tickStyle, {index, ticksLength, tick, props});

        const pX = axis === 'x' ? x(tick.x) : helpers.normalizeNumber(position, layerWidth);
        const pY = axis === 'y' ? y(tick.y) : helpers.normalizeNumber(position, layerHeight);

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

        labelVisible = helpers.value(labelVisible, {index, ticksLength, tick, props});
        if (labelVisible) {

            labelAttributes = helpers.value([tick.labelAttributes, labelAttributes], {index, ticksLength, tick, props});
            labelStyle = helpers.value([tick.labelStyle, labelStyle], {index, ticksLength, tick, props});

            label = helpers.value([tick.label, label, tick[axis]], {index, ticksLength, tick, props});
            labelFormat = helpers.value(labelFormat, label) || label;

            if (_isString(label) || _isNumber(label)) {
                label = <text
                    style={labelStyle}
                    className={className && (className + '-label ' + className + '-label-' + index)}
                    {...labelAttributes}>
                    {labelFormat}
                </text>;
            }
            return label;
        }
    }

    renderLine(ticksLength, tick, index) {
        const {props, horizontal} = this;
        const {layerWidth, layerHeight, className} = props;

        let {lineVisible, lineAttributes, lineStyle, lineLength, lineOffset} = props;
        let line;
        lineVisible = helpers.value(lineVisible, {index, ticksLength, tick, props});
        if (lineVisible) {

            lineAttributes = helpers.value([tick.lineAttributes, lineAttributes], {index, ticksLength, tick, props});
            lineStyle = helpers.value([tick.lineStyle, lineStyle], {index, ticksLength, tick, props});

            lineLength = helpers.normalizeNumber(
                helpers.value([tick.lineLength, lineLength], {index, ticksLength, tick, props}),
                horizontal ? layerWidth : layerHeight
            );
            lineOffset = helpers.normalizeNumber(
                helpers.value([tick.lineOffset, lineOffset], {index, ticksLength, tick, props}),
                horizontal ? layerWidth : layerHeight
            );

            const d = horizontal ?
                ('M' + lineOffset + ',0 h' + lineLength) :
                ('M0,' + lineOffset + ' v' + lineLength);

            line = <path
                style={lineStyle}
                className={className && (className + '-line ' + className + '-line-' + index)}
                d={d}
                {...lineAttributes}/>;
        }
        return line;
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

        ticks = helpers.value([ticks], props);
        if (_isNumber(ticks)) {
            ticks = {maxTicks: ticks};
        }
        ticks = ticks || {};
        if (_isPlainObject(ticks)) {
            ticks = this.generateTicks(ticks);
        }

        return <g className={className} style={style} opacity={props.opacity}>
            {_map(ticks, this.renderTick.bind(this, ticks.length))}
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

module.exports = Ticks;
