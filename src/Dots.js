import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
    symbol,
    symbolCircle, symbolCross, symbolDiamond, symbolSquare,
    symbolWye, symbolTriangle, symbolStar
} from 'd3-shape';

const symbolsMap = {
    'circle': symbolCircle,
    'cross': symbolCross,
    'diamond': symbolDiamond,
    'square': symbolSquare,
    'triangle-down': symbolWye,
    'triangle-up': symbolTriangle,
    'star': symbolStar
};

import value from './helpers/value';
import colorFunc from './helpers/colorFunc';
import propTypes from './helpers/propTypes';

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
export default class Dots extends Component {

    constructor(props) {
        super(props);

        this.renderDot = this.renderDot.bind(this);
    }

    renderCircle({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {circleRadius, circleAttributes} = props;
        const series = props.series[seriesIndex];

        circleRadius = value(circleRadius, {seriesIndex, pointIndex, point, series, props});
        circleAttributes = value(circleAttributes, {seriesIndex, pointIndex, point, series, props});

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
    }

    renderEllipse({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {ellipseRadiusX, ellipseRadiusY, ellipseAttributes} = props;
        const series = props.series[seriesIndex];

        ellipseRadiusX = value(ellipseRadiusX, {seriesIndex, pointIndex, point, series, props});
        ellipseRadiusY = value(ellipseRadiusY, {seriesIndex, pointIndex, point, series, props});
        ellipseAttributes = value(ellipseAttributes, {seriesIndex, pointIndex, point, series, props});

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
    }

    renderPath({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {path, pathAttributes} = props;
        const series = props.series[seriesIndex];

        path = value(path, {seriesIndex, pointIndex, point, series, props});
        pathAttributes = value(pathAttributes, {seriesIndex, pointIndex, point, series, props});

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
    }

    renderSymbol({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {symbolType, symbolAttributes} = props;
        const series = props.series[seriesIndex];

        symbolType = value(symbolType, {seriesIndex, pointIndex, point, series, props});
        symbolAttributes = value(symbolAttributes, {seriesIndex, pointIndex, point, series, props});

        const type = _.isString(symbolType) ? symbolsMap[symbolType] : symbolType;

        return <path
            key={key}
            className={className && (className + '-symbol ' + className + '-symbol-' + seriesIndex + '-' + pointIndex)}
            d={symbol().type(type)(point, pointIndex)}
            style={dotStyle}
            fill={point.color || series.color || color(seriesIndex)}
            fillOpacity={point.opacity}
            {...dotAttributes}
            {...symbolAttributes}
        />;
    }

    renderLabel({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}) {
        const {className} = props;
        let {label, labelAttributes} = props;
        const series = props.series[seriesIndex];

        label = value(label, {seriesIndex, pointIndex, point, series, props});
        labelAttributes = value(labelAttributes, {seriesIndex, pointIndex, point, series, props});

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
    }

    renderDot(x, y, seriesIndex, pointIndex, point) {
        const {props} = this;
        const {className} = props;
        let {groupStyle, dotVisible, dotAttributes, dotStyle, dotType, dotRender} = props;
        const series = props.series[seriesIndex];

        dotVisible = value(dotVisible, {seriesIndex, pointIndex, point, series, props});
        if (!dotVisible) {
            return;
        }

        groupStyle = value(groupStyle, {seriesIndex, pointIndex, point, series, props});

        dotType = value([dotType], {seriesIndex, pointIndex, point, series, props});
        dotAttributes = value(dotAttributes, {seriesIndex, pointIndex, point, dotType, series, props});
        dotStyle = value([point.style, series.style, dotStyle], {
            seriesIndex,
            pointIndex,
            point,
            dotType,
            series,
            props
        });

        const color = this.color;
        let dot;

        if (_.isFunction(dotRender)) {
            dot = dotRender({seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color});
        } else {
            if (_.isString(dotType)) {
                dot = this[methods[dotType]] &&
                    this[methods[dotType]]({
                        seriesIndex, pointIndex, point,
                        dotStyle, dotAttributes, props, color
                    });

            } else if (_.isArray(dotType)) {
                dot = _.map(dotType, (dotType, key) => {
                    return this[methods[dotType]]({
                        key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color
                    });
                });

            } else {
                dot = null;
            }
        }

        return <g
            key={pointIndex}
            className={className && (className + '-dot ' + className + '-dot-' + pointIndex)}
            transform={'translate(' + x + ' ' + y + ')'}
            style={groupStyle}>
            {dot}
        </g>;
    }

    render() {
        const {props} = this;
        const {className, style, scaleX, scaleY, colors, opacity} = props;

        const x = scaleX.factory(props);
        const y = scaleY.factory(props);
        const rotate = scaleX.swap || scaleY.swap;
        this.color = colorFunc(colors);

        return <g className={className} style={style} opacity={opacity}>
            {_.map(props.series, (series, index) => {

                let {seriesVisible, seriesStyle, seriesAttributes} = props;

                seriesVisible = value(seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = value(seriesAttributes, {seriesIndex: index, series, props});
                seriesStyle = value(seriesStyle, {seriesIndex: index, series, props});

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

}

Dots.displayName = 'Dots';

Dots.propTypes = {
    className: PropTypes.string,
    colors: PropTypes.oneOfType([
        PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']),
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.func
    ]),
    opacity: PropTypes.number,
    style: PropTypes.object,

    /**
     * Possible values: `"dot"`, `"circle"`, `"ellipse"`, `"symbol"`, `"label"`, `"path"`.
     */
    dotType: PropTypes.oneOfType([
        PropTypes.oneOf(_.keys(methods)),
        PropTypes.array,
        PropTypes.func
    ]),
    dotRender: PropTypes.func,

    circleRadius: PropTypes.oneOfType([
        PropTypes.number, PropTypes.string, PropTypes.func
    ]),
    circleAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    ellipseRadiusX: PropTypes.oneOfType([
        PropTypes.number, PropTypes.string, PropTypes.func
    ]),
    ellipseRadiusY: PropTypes.oneOfType([
        PropTypes.number, PropTypes.string, PropTypes.func
    ]),
    ellipseAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    /**
     * Possible values: `"circle"`, `"cross"`, `"diamond"`, `"square"`,
     * `"triangle-down"`, `"triangle-up"`
     */
    symbolType: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
    symbolAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    labelAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    path: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    pathAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    seriesVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    seriesAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    seriesStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    groupStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    dotVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    dotAttributes: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    dotStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    seriesIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array,
        PropTypes.func
    ]),
    series: propTypes.series,
    scaleX: PropTypes.object,
    scaleY: PropTypes.object
};

Dots.defaultProps = {
    colors: 'category20',
    dotType: 'circles',
    circleRadius: 4,
    ellipseRadiusX: 6,
    ellipseRadiusY: 4,
    seriesVisible: true,
    dotVisible: true
};
