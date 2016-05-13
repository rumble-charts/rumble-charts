'use strict';

const React = require('react'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Renders ticks (labels and lines) for axis (x and y).
 *
 * @example ../docs/examples/Ticks.md
 */
const Ticks = React.createClass({

    displayName: 'Ticks',

    propTypes: {
        style: React.PropTypes.object,
        opacity: React.PropTypes.number,
        className: React.PropTypes.string,

        axis: React.PropTypes.string,
        position: React.PropTypes.string,

        tickVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        tickAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        tickStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.node, React.PropTypes.func]),
        labelVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        labelAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        labelStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        labelFormat: React.PropTypes.func,

        lineVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        lineAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        lineStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        lineLength: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),
        lineOffset: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),

        ticks: React.PropTypes.oneOfType([
            // ticks factory
            React.PropTypes.func,
            // how many ticks to show
            React.PropTypes.number,
            // settings
            React.PropTypes.shape({
                maxTicks: React.PropTypes.number,
                minDistance: React.PropTypes.number,
                distance: React.PropTypes.number
            }),
            // ticks themselves
            React.PropTypes.arrayOf(React.PropTypes.oneOfType([
                React.PropTypes.number,
                React.PropTypes.shape({
                    x: React.PropTypes.number,
                    y: React.PropTypes.number,
                    label: React.PropTypes.oneOfType([
                        React.PropTypes.func,
                        React.PropTypes.string,
                        React.PropTypes.node
                    ]),
                    labelStyle: React.PropTypes.object,
                    labelAttributes: React.PropTypes.object,
                    lineStyle: React.PropTypes.object,
                    lineAttributes: React.PropTypes.object,
                    lineLength: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
                    lineOffset: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
                })
            ]))
        ]),

        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number
    },

    // init

    getDefaultProps() {
        return {
            axis: 'x',
            tickVisible: true,
            labelVisible: true,
            lineVisible: true,
            lineLength: 5,
            lineOffset: 0
        };
    },

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
    },

    // render

    renderTick(ticksLength, tick, index) {
        const {props, x, y, position} = this;
        const {axis, className, layerWidth, layerHeight, scaleX, scaleY} = props;
        let {tickStyle, tickAttributes, tickVisible} = props;

        if (_.isNumber(tick)) {
            tick = {[axis]: tick};
        }

        tickVisible = helpers.value(tickVisible, {index, ticksLength, tick, props});

        if (!tickVisible) {
            return;
        }

        const pX = axis === 'x' ? x(tick.x) : helpers.normalizeNumber(position, layerWidth);
        const pY = axis === 'y' ? y(tick.y) : helpers.normalizeNumber(position, layerHeight);

        const transform = (scaleX.swap || scaleY.swap) ?
            ('translate(' + pY + ',' + pX + ')') :
            ('translate(' + pX + ',' + pY + ')');
        let {labelAttributes} = props;

        tickAttributes = helpers.value(tickAttributes, {index, ticksLength, tick, props});
        tickStyle = helpers.value(tickStyle, {index, ticksLength, tick, props});

        return <g
            key={index} style={tickStyle}
            className={className && (className + '-tick ' + className + '-tick-' + index)}
            transform={transform}
            {...tickAttributes}>
            {this.renderLabel(ticksLength, tick, index)}
            {this.renderLine(ticksLength, tick, index)}
        </g>;
    },

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

            if (_.isString(label) || _.isNumber(label)) {
                label = <text
                    style={labelStyle}
                    className={className && (className + '-label ' + className + '-label-' + index)}
                    {...labelAttributes}>
                    {labelFormat}
                </text>;
            }
            return label;
        }
    },

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
    },

    render: function () {
        const {props} = this;
        const {className, position, scaleX, scaleY, axis, style} = props;
        let {ticks} = props;

        this.x = scaleX.factory(props);
        this.y = scaleY.factory(props);
        this.horizontal = (axis === 'y' && !scaleX.swap && !scaleY.swap) ||
            (axis === 'x' && (scaleX.swap || scaleY.swap));
        this.position = position || (axis === 'x' ?
                (scaleX.swap || scaleY.swap ? 'top' : 'bottom') :
                'left');

        ticks = helpers.value([ticks], props);
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

});

module.exports = Ticks;
