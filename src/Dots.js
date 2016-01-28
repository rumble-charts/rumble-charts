'use strict';

var React = require('react'),
    _ = require('lodash'),
    d3 = require('d3'),
    helpers = require('./helpers');

var methods = {
    dots: 'renderCircle',
    dot: 'renderCircle',
    circles: 'renderCircle',
    circle: 'renderCircle',
    ellipses: 'renderEllipse',
    ellipse: 'renderEllipse',
    symbols: 'renderSymbol',
    symbol: 'renderSymbol',
    labels: 'renderLabel',
    label: 'renderLabel',
    path: 'renderPath'
};

var Dots = React.createClass({

    displayName: 'Dots',

    propTypes: {
        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string,
            opacity: React.PropTypes.number,
            style: React.PropTypes.object,
            data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
                React.PropTypes.number,
                React.PropTypes.arrayOf(React.PropTypes.number),
                React.PropTypes.shape({
                    x: React.PropTypes.number,
                    y: React.PropTypes.number,
                    color: React.PropTypes.string,
                    opacity: React.PropTypes.number,
                    style: React.PropTypes.object
                })
            ]))
        })),
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
        style: React.PropTypes.object,
        className: React.PropTypes.string,

        dotType: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(_.keys(methods)),
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        dotRender: React.PropTypes.func,

        circleRadius: React.PropTypes.oneOfType([
            React.PropTypes.number, React.PropTypes.string, React.PropTypes.func
        ]),
        circleAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        ellipseRadiusX: React.PropTypes.oneOfType([
            React.PropTypes.number, React.PropTypes.string, React.PropTypes.func
        ]),
        ellipseRadiusY: React.PropTypes.oneOfType([
            React.PropTypes.number, React.PropTypes.string, React.PropTypes.func
        ]),
        ellipseAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        symbolType: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        symbolAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        labelFormat: React.PropTypes.func,
        labelAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        path: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        pathAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        groupStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        dotVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        dotAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        dotStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func])
    },

    // init

    getDefaultProps() {
        return {
            colors: 'category20',
            dotType: 'circles',
            circleRadius: 4,
            ellipseRadiusX: 6,
            ellipseRadiusY: 4,
            seriesVisible: true,
            dotVisible: true
        };
    },

    // render

    renderCircle({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        let { circleRadius, circleAttributes, className } = props;
        let series = props.series[seriesIndex];

        circleRadius = helpers.value(circleRadius, {seriesIndex, pointIndex, point, props});
        circleAttributes = helpers.value(circleAttributes, {seriesIndex, pointIndex, point, props});

        /* jshint ignore:start */
        return <circle
            key={key}
            className={className && (className + '-circle ' + className + '-circle-' + seriesIndex + '-' + pointIndex)}
            cx={0}
            cy={0}
            r={circleRadius}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={_.isUndefined(point.opacity) ? series.opacity : point.opacity}
            {...dotAttributes}
            {...circleAttributes}
        />;
        /* jshint ignore:end */
    },

    renderEllipse({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        let { ellipseRadiusX, ellipseRadiusY, ellipseAttributes, className } = props;
        let series = props.series[seriesIndex];

        ellipseRadiusX = helpers.value(ellipseRadiusX, {seriesIndex, pointIndex, point, props});
        ellipseRadiusY = helpers.value(ellipseRadiusY, {seriesIndex, pointIndex, point, props});
        ellipseAttributes = helpers.value(ellipseAttributes, {seriesIndex, pointIndex, point, props});

        /* jshint ignore:start */
        return <ellipse
            key={key}
            className={className && (className + '-ellipse ' +
            className + '-ellipse-' + seriesIndex + '-' + pointIndex)}
            cx={0}
            cy={0}
            rx={ellipseRadiusX}
            ry={ellipseRadiusY}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={_.isUndefined(point.opacity) ? series.opacity : point.opacity}
            {...dotAttributes}
            {...ellipseAttributes}
        />;
        /* jshint ignore:end */
    },

    renderPath({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        let { path, pathAttributes, className } = props;
        let series = props.series[seriesIndex];

        path = helpers.value(path, {seriesIndex, pointIndex, point, props});
        pathAttributes = helpers.value(pathAttributes, {seriesIndex, pointIndex, point, props});

        /* jshint ignore:start */
        return <path
            key={key}
            className={className && (className + '-path ' + className + '-path-' + seriesIndex + '-' + pointIndex)}
            d={path}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={_.isUndefined(point.opacity) ? series.opacity : point.opacity}
            {...dotAttributes}
            {...pathAttributes}
        />;
        /* jshint ignore:end */
    },

    renderSymbol({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        let { symbolType, symbolAttributes, className } = props;
        let series = props.series[seriesIndex];

        symbolType = helpers.value(symbolType, {seriesIndex, pointIndex, point, props});
        symbolAttributes = helpers.value(symbolAttributes, {seriesIndex, pointIndex, point, props});

        /* jshint ignore:start */
        return <path
            key={key}
            className={className && (className + '-symbol ' + className + '-symbol-' + seriesIndex + '-' + pointIndex)}
            d={d3.svg.symbol().type(symbolType)(point, pointIndex)}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={_.isUndefined(point.opacity) ? series.opacity : point.opacity}
            {...dotAttributes}
            {...symbolAttributes}
        />;
        /* jshint ignore:end */
    },

    renderLabel({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        let { label, labelAttributes, className } = props;
        let series = props.series[seriesIndex];

        label = helpers.value(label, {seriesIndex, pointIndex, point, props});
        labelAttributes = helpers.value(labelAttributes, {seriesIndex, pointIndex, point, props});

        /* jshint ignore:start */
        return <text
            key={key}
            className={className && (className + '-label ' + className + '-label-' + seriesIndex + '-' + pointIndex)}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={_.isUndefined(point.opacity) ? series.opacity : point.opacity}
            {...dotAttributes}
            {...labelAttributes}>
            {label}
        </text>;
        /* jshint ignore:end */
    },

    renderDot(x, y, seriesIndex, pointIndex, point) {
        let { props } = this;
        let { className, groupStyle, dotVisible, dotAttributes, dotStyle, dotType, dotRender } = props;
        let series = props.series[seriesIndex];

        dotVisible = helpers.value(dotVisible, {seriesIndex, pointIndex, point, props});
        if (!dotVisible) {
            return;
        }

        groupStyle = helpers.value([series.style, groupStyle], {seriesIndex, pointIndex, point, props});

        let transform = 'translate3d(' + x + 'px,' + y + 'px,0px)';
        let style = _.defaults({
            transform,
            WebkitTransform: transform,
            MozTransform: transform
        }, groupStyle);

        dotType = helpers.value([dotType], {seriesIndex, pointIndex, point, props});
        dotAttributes = helpers.value(dotAttributes, {seriesIndex, pointIndex, point, dotType, props});
        dotStyle = helpers.value([point.style, dotStyle], {seriesIndex, pointIndex, point, dotType, props});

        let color = this.color;
        let dot;

        if (_.isString(dotType)) {
            dot = this[methods[dotType]]({seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color});

        } else if (_.isArray(dotType)) {
            dot = _.map(dotType, (dotType, key) => {
                return this[methods[dotType]]({
                    key,
                    seriesIndex,
                    pointIndex,
                    point,
                    dotStyle,
                    dotAttributes,
                    props,
                    color
                });
            });

        } else {
            dotRender({seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color});
        }

        /* jshint ignore:start */
        return <g
            key={pointIndex}
            className={className && (className + '-dot ' + className + '-dot-' + pointIndex)}
            style={style}>
            {dot}
        </g>;
        /* jshint ignore:end */
    },

    render: function () {
        let { props } = this;
        let { className, style, scaleX, scaleY, colors } = props;

        let x = scaleX.factory(props);
        let y = scaleY.factory(props);
        let rotate = scaleX.swap || scaleY.swap;
        this.color = helpers.colorFunc(colors);

        /* jshint ignore:start */
        return <g className={className} style={style}>
            {_.map(props.series, (series, index) => {

                let { seriesVisible, seriesStyle, seriesAttributes } = props;

                seriesVisible = helpers.value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = helpers.value(seriesStyle, {seriesIndex: index, series, props});

                return <g
                    key={index}
                    className={className && (className + '-series ' + className + '-series-' + index)}
                    style={seriesStyle}
                    {...seriesAttributes}>

                    {_.map(series.data, (point, pointIndex) => {
                        let y1 = y(point.y);
                        let x1 = x(point.x);

                        if (rotate) {
                            return this.renderDot(y1, x1, index, pointIndex, point);
                        } else {
                            return this.renderDot(x1, y1, index, pointIndex, point);
                        }
                    })}

                </g>;
            })}
        </g>;
        /* jshint ignore:end */
    }

});

module.exports = Dots;
