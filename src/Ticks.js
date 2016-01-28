'use strict';

var React = require('react'),
    _ = require('lodash'),
    helpers = require('./helpers');

var Ticks = React.createClass({

    displayName: 'Ticks',

    propTypes: {
        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: React.PropTypes.arrayOf(React.PropTypes.object),

        style: React.PropTypes.object,
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
        ])
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
        let { props } = this;
        let { axis, maxX, maxY, minX, minY } = props;
        let { maxTicks, minDistance, distance } = config;

        let max = axis === 'y' ? maxY : maxX;
        let min = axis === 'y' ? minY : minX;
        let length = max - min;

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
        let { props, x, y, position } = this;
        let { axis, className, layerWidth, layerHeight,
            tickStyle, tickAttributes, tickVisible, scaleX, scaleY } = props;

        if (_.isNumber(tick)) {
            tick = {[axis]: tick};
        }

        tickVisible = helpers.value(tickVisible, {index, ticksLength, tick, props});

        if (!tickVisible) {
            return;
        }

        tickAttributes = helpers.value(tickAttributes, {index, ticksLength, tick, props});
        tickStyle = helpers.value(tickStyle, {index, ticksLength, tick, props});

        let pX = axis === 'x' ? x(tick.x) : helpers.normalizeNumber(position, layerWidth);
        let pY = axis === 'y' ? y(tick.y) : helpers.normalizeNumber(position, layerHeight);

        let transform = (scaleX.swap || scaleY.swap) ?
        'translate3d(' + pY + 'px,' + pX + 'px,0px)' :
        'translate3d(' + pX + 'px,' + pY + 'px,0px)';

        let style = _.defaults({
            transform,
            WebkitTransform: transform,
            MozTransform: transform
        }, tickStyle);

        /* jshint ignore:start */
        return <g
            key={index} style={style}
            className={className && (className + '-tick ' + className + '-tick-' + index)}
            {...tickAttributes}>
            {this.renderLabel(ticksLength, tick, index)}
            {this.renderLine(ticksLength, tick, index)}
        </g>;
        /* jshint ignore:end */
    },

    renderLabel(ticksLength, tick, index) {
        let { props } = this;
        let { className, axis } = props;
        let { labelStyle, labelFormat, labelVisible, labelAttributes, label } = props;

        labelVisible = helpers.value(labelVisible, {index, ticksLength, tick, props});
        if (labelVisible) {

            labelAttributes = helpers.value([tick.labelAttributes, labelAttributes], {index, ticksLength, tick, props});
            labelStyle = helpers.value([tick.labelStyle, labelStyle], {index, ticksLength, tick, props});

            label = helpers.value([tick.label, label, tick[axis]], {index, ticksLength, tick, props});
            labelFormat = helpers.value(labelFormat, label) || label;

            if (_.isString(label) || _.isNumber(label)) {
                /* jshint ignore:start */
                label = <text
                    style={labelStyle}
                    className={className && (className + '-label ' + className + '-label-' + index)}
                    {...labelAttributes}>
                    {labelFormat}
                </text>;
                /* jshint ignore:end */
            }
            return label;
        }
    },

    renderLine(ticksLength, tick, index) {
        let { props, horizontal } = this;
        let { layerWidth, layerHeight, className } = props;

        let { lineVisible, lineAttributes, lineStyle, lineLength, lineOffset } = props;
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

            let d = horizontal ?
                ('M' + lineOffset + ',0 h' + lineLength) :
                ('M0,' + lineOffset + ' v' + lineLength);

            /* jshint ignore:start */
            line = <path
                style={lineStyle}
                className={className && (className + '-line ' + className + '-line-' + index)}
                d={d}
                {...lineAttributes}/>;
            /* jshint ignore:end */
        }
        return line;
    },

    render: function () {
        let { props } = this;
        let { className, position, ticks, scaleX, scaleY, axis, style } = props;

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

        /* jshint ignore:start */
        return <g className={className} style={style}>
            {_.map(ticks, this.renderTick.bind(this, ticks.length))}
        </g>;
        /* jshint ignore:end */
    }

});

module.exports = Ticks;
