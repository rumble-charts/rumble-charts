'use strict';

const React = require('react'),
    _ = require('./_'),
    d3 = require('d3'),
    helpers = require('./helpers');

const methods = {
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

/**
 * Renders dots for your scatter plot.
 *
 * @example ../docs/examples/Dots.md
 */
const Dots = React.createClass({

    displayName: 'Dots',

    propTypes: {
        className: React.PropTypes.string,
        colors: React.PropTypes.oneOfType([
            React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
            React.PropTypes.arrayOf(React.PropTypes.string),
            React.PropTypes.func
        ]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,

        /**
         * Possible values: `"dot"`, `"circle"`, `"ellipse"`, `"symbol"`, `"label"`, `"path"`.
         */
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

        /**
         * Possible values: `"circle"`, `"cross"`, `"diamond"`, `"square"`,
         * `"triangle-down"`, `"triangle-up"`
         */
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
        dotStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesIndex: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.array,
            React.PropTypes.func
        ]),
        series: helpers.propTypes.series,
        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object
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
        const {className} = props;
        let {circleRadius, circleAttributes} = props;
        const series = props.series[seriesIndex];

        circleRadius = helpers.value(circleRadius, {seriesIndex, pointIndex, point, series, props});
        circleAttributes = helpers.value(circleAttributes, {seriesIndex, pointIndex, point, series, props});

        return <circle
            key={key}
            className={className && (className + '-circle ' + className + '-circle-' + seriesIndex + '-' + pointIndex)}
            cx={0} cy={0} r={circleRadius}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={point.opacity}
            {...dotAttributes}
            {...circleAttributes}
        />;
    },

    renderEllipse({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {ellipseRadiusX, ellipseRadiusY, ellipseAttributes} = props;
        const series = props.series[seriesIndex];

        ellipseRadiusX = helpers.value(ellipseRadiusX, {seriesIndex, pointIndex, point, series, props});
        ellipseRadiusY = helpers.value(ellipseRadiusY, {seriesIndex, pointIndex, point, series, props});
        ellipseAttributes = helpers.value(ellipseAttributes, {seriesIndex, pointIndex, point, series, props});

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
            fillOpacity={point.opacity}
            {...dotAttributes}
            {...ellipseAttributes}
        />;
    },

    renderPath({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {path, pathAttributes} = props;
        const series = props.series[seriesIndex];

        path = helpers.value(path, {seriesIndex, pointIndex, point, series, props});
        pathAttributes = helpers.value(pathAttributes, {seriesIndex, pointIndex, point, series, props});

        return <path
            key={key}
            className={className && (className + '-path ' + className + '-path-' + seriesIndex + '-' + pointIndex)}
            d={path}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={point.opacity}
            {...dotAttributes}
            {...pathAttributes}
        />;
    },

    renderSymbol({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {symbolType, symbolAttributes} = props;
        const series = props.series[seriesIndex];

        symbolType = helpers.value(symbolType, {seriesIndex, pointIndex, point, series, props});
        symbolAttributes = helpers.value(symbolAttributes, {seriesIndex, pointIndex, point, series, props});

        return <path
            key={key}
            className={className && (className + '-symbol ' + className + '-symbol-' + seriesIndex + '-' + pointIndex)}
            d={d3.svg.symbol().type(symbolType)(point, pointIndex)}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={point.opacity}
            {...dotAttributes}
            {...symbolAttributes}
        />;
    },

    renderLabel({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {label, labelAttributes} = props;
        const series = props.series[seriesIndex];

        label = helpers.value(label, {seriesIndex, pointIndex, point, series, props});
        labelAttributes = helpers.value(labelAttributes, {seriesIndex, pointIndex, point, series, props});

        return <text
            key={key}
            className={className && (className + '-label ' + className + '-label-' + seriesIndex + '-' + pointIndex)}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={point.opacity}
            {...dotAttributes}
            {...labelAttributes}>
            {label}
        </text>;
    },

    renderDot(x, y, seriesIndex, pointIndex, point) {
        const {props} = this;
        const {className} = props;
        let {groupStyle, dotVisible, dotAttributes, dotStyle, dotType, dotRender} = props;
        const series = props.series[seriesIndex];

        dotVisible = helpers.value(dotVisible, {seriesIndex, pointIndex, point, series, props});
        if (!dotVisible) {
            return;
        }

        groupStyle = helpers.value(groupStyle, {seriesIndex, pointIndex, point, series, props});

        const transform = 'translate(' + x + ',' + y + ')';

        dotType = helpers.value([dotType], {seriesIndex, pointIndex, point, series, props});
        dotAttributes = helpers.value(dotAttributes, {seriesIndex, pointIndex, point, dotType, series, props});
        dotStyle = helpers.value([point.style, series.style, dotStyle], {
            seriesIndex,
            pointIndex,
            point,
            dotType,
            series,
            props
        });

        const color = this.color;
        let dot;

        if (_.isString(dotType)) {
            dot = this[methods[dotType]]({seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color});

        } else if (_.isArray(dotType)) {
            dot = _.map(dotType, (dotType, key) => {
                return this[methods[dotType]]({
                    key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color
                });
            });

        } else {
            dotRender({seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color});
        }

        return <g
            key={pointIndex}
            className={className && (className + '-dot ' + className + '-dot-' + pointIndex)}
            style={groupStyle}
            transform={transform}>
            {dot}
        </g>;
    },

    render: function () {
        const {props} = this;
        const {className, style, scaleX, scaleY, colors, opacity} = props;

        const x = scaleX.factory(props);
        const y = scaleY.factory(props);
        const rotate = scaleX.swap || scaleY.swap;
        this.color = helpers.colorFunc(colors);

        return <g className={className} style={style} opacity={opacity}>
            {_.map(props.series, (series, index) => {

                let {seriesVisible, seriesStyle, seriesAttributes} = props;

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
                    opacity={series.opacity}
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
    }

});

module.exports = Dots;
