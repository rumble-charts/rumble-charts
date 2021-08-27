import type {ReactElement, ReactNode} from 'react';
import type {ScaleContinuousNumeric} from 'd3-scale';
import type {SymbolType} from 'd3-shape';
import type {ColorScale, GraphicProps, Point, Series, Style} from './types';

import React from 'react';
import {
    symbol,
    symbolCircle, symbolCross, symbolDiamond, symbolSquare,
    symbolWye, symbolTriangle, symbolStar,
} from 'd3-shape';

import {colorFunc, defaultSchemeName, isFunction, isString, value} from './helpers';

const symbolsMap = {
    'circle': symbolCircle,
    'cross': symbolCross,
    'diamond': symbolDiamond,
    'square': symbolSquare,
    'triangle-down': symbolWye,
    'triangle-up': symbolTriangle,
    'star': symbolStar
};

const methods = {
    dots: renderCircle,
    dot: renderCircle,
    circles: renderCircle,
    circle: renderCircle,
    ellipses: renderEllipse,
    ellipse: renderEllipse,
    symbols: renderSymbol,
    symbol: renderSymbol,
    labels: renderLabel,
    label: renderLabel,
    path: renderPath
};

type DotType = keyof typeof methods;
type DotSymbolType = keyof typeof symbolsMap | SymbolType;

export type DotParams = {
    seriesIndex: number;
    pointIndex: number;
    point: Point;
    series: Series;
    props: DotsProps;
};

export type DotSeriesParams = {
    seriesIndex: number;
    series: Series;
    props: DotsProps;
};

export type DotTypeParams = DotParams & {
    dotType: DotType | DotType[]
};

export type DotRenderProps = {
    key?: string | number;
    seriesIndex: number;
    pointIndex: number;
    point: Point;
    dotStyle: Style;
    dotAttributes: Record<string, any>;
    props: DotsProps;
    color: ColorScale;
};

export type DotsProps = {
    /**
     * Possible values: `"dot"`, `"circle"`, `"ellipse"`, `"symbol"`, `"label"`, `"path"`.
     */
    dotType?: DotType | DotType[] | ((params: DotParams) => DotType | DotType[]);
    dotRender?: (props: DotRenderProps) => ReactNode;

    circleRadius?: number | string | ((params: DotParams) => number | string);
    circleAttributes?: Record<string, any> | ((params: DotParams) => Record<string, any>);

    ellipseRadiusX?: number | string | ((params: DotParams) => number | string);
    ellipseRadiusY?: number | string | ((params: DotParams) => number | string);
    ellipseAttributes?: Record<string, any> | ((params: DotParams) => Record<string, any>);

    /**
     * Possible values: `"circle"`, `"cross"`, `"diamond"`, `"square"`,
     * `"triangle-down"`, `"triangle-up"`
     */
    symbolType?: DotSymbolType | ((params: DotParams) => DotSymbolType);
    symbolAttributes?: Record<string, any> | ((params: DotParams) => Record<string, any>);

    label?: ReactNode | ((params: DotParams) => ReactNode);
    labelAttributes?: Record<string, any> | ((params: DotParams) => Record<string, any>);

    path?: string | ((params: DotParams) => string);
    pathAttributes?: Record<string, any> | ((params: DotParams) => Record<string, any>);

    seriesVisible?: boolean | ((params: DotSeriesParams) => boolean);
    seriesAttributes?: Record<string, any> | ((params: DotSeriesParams) => Record<string, any>);
    seriesStyle?: Style | ((params: DotSeriesParams) => Style);

    groupStyle?: Style | ((params: DotParams) => Style);

    dotVisible?: boolean | ((params: DotParams) => boolean);
    dotAttributes?: Record<string, any> | ((params: DotTypeParams) => Record<string, any>);
    dotStyle?: Style | ((params: DotTypeParams) => Style);
} & GraphicProps;

/**
 * Renders dots for your scatter plot.
 */
export function Dots(props: DotsProps): ReactElement {
    const {className, scaleX, scaleY, colors = defaultSchemeName} = props;

    const x = scaleX.factory(props);
    const y = scaleY.factory(props);
    const rotate = scaleX.swap || scaleY.swap;
    const color = colorFunc(colors);

    return <g className={className} style={props.style} opacity={props.opacity}>
        {props.series?.map((series, index) => {

            if ('seriesVisible' in props) {
                const seriesVisible = value(props.seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }
            }

            const seriesAttributes = value(props.seriesAttributes, {seriesIndex: index, series, props});
            const seriesStyle = value(props.seriesStyle, {seriesIndex: index, series, props});

            return <g
                key={index}
                className={className && (className + '-series ' + className + '-series-' + index)}
                style={seriesStyle}
                opacity={series.opacity}
                {...seriesAttributes}>

                {series.data.map((point: Point, pointIndex) => {
                    if (rotate) {
                        return renderDot(props, color, y(point.y), x(point.x), index, pointIndex, point);
                    } else {
                        return renderDot(props, color, x(point.x), y(point.y), index, pointIndex, point);
                    }
                })}

            </g>;
        })}
    </g>;
}

function renderDot(
    props: DotsProps,
    color: ColorScale,
    x: ScaleContinuousNumeric<any, any>,
    y: ScaleContinuousNumeric<any, any>,
    seriesIndex: number,
    pointIndex: number,
    point: Point
): ReactNode {
    const {className, dotType = 'circles'} = props;
    const series = props.series[seriesIndex];

    if ('dotVisible' in props) {
        const dotVisible = value(props.dotVisible, {seriesIndex, pointIndex, point, series, props});
        if (!dotVisible) {
            return;
        }
    }

    const groupStyle = value(props.groupStyle, {seriesIndex, pointIndex, point, series, props});

    const _dotType: DotType | DotType[] = value([dotType], {
        seriesIndex,
        pointIndex,
        point,
        series,
        props
    });
    const dotAttributes = value(props.dotAttributes, {
        seriesIndex,
        pointIndex,
        point,
        dotType: _dotType,
        series,
        props
    });
    const dotStyle = value([point.style, series.style, props.dotStyle], {
        seriesIndex,
        pointIndex,
        point,
        dotType: _dotType,
        series,
        props
    });

    let dot: ReactNode;

    if (isFunction(props.dotRender)) {
        dot = props.dotRender({seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color});
    } else {
        if (isString(_dotType)) {
            dot = methods[_dotType] &&
                methods[_dotType]({
                    seriesIndex, pointIndex, point,
                    dotStyle, dotAttributes, props, color
                });

        } else if (Array.isArray(_dotType)) {
            dot = _dotType.map((_dotType, key) => {
                return methods[_dotType]({
                    key,
                    seriesIndex, pointIndex, point,
                    dotStyle, dotAttributes, props, color
                });
            });

        } else {
            dot = null;
        }
    }

    return <g
        key={pointIndex}
        className={className && (`${className}-dot ${className}-dot-${pointIndex}`)}
        transform={`translate(${x} ${y})`}
        style={groupStyle}>
        {dot}
    </g>;
}

function renderCircle({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}: DotRenderProps) {
    const {className} = props;
    const series = props.series[seriesIndex];

    const {circleRadius = 4} = props;

    const _circleRadius = value(circleRadius, {seriesIndex, pointIndex, point, series, props});
    const circleAttributes = value(props.circleAttributes, {seriesIndex, pointIndex, point, series, props});

    return <circle
        key={key}
        className={className && (`${className}-circle ${className}-circle-${seriesIndex}-${pointIndex}`)}
        cx={0} cy={0} r={_circleRadius}
        style={dotStyle}
        fill={point.color || series.color || color(seriesIndex)}
        fillOpacity={point.opacity}
        {...dotAttributes}
        {...circleAttributes}
    />;
}

function renderEllipse({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}: DotRenderProps) {
    const {className} = props;
    const series = props.series[seriesIndex];

    const {ellipseRadiusX = 6, ellipseRadiusY = 4} = props;

    const _ellipseRadiusX = value(ellipseRadiusX, {seriesIndex, pointIndex, point, series, props});
    const _ellipseRadiusY = value(ellipseRadiusY, {seriesIndex, pointIndex, point, series, props});
    const ellipseAttributes = value(props.ellipseAttributes, {seriesIndex, pointIndex, point, series, props});

    return <ellipse
        key={key}
        className={className && (className + '-ellipse ' +
            className + '-ellipse-' + seriesIndex + '-' + pointIndex)}
        cx={0}
        cy={0}
        rx={_ellipseRadiusX}
        ry={_ellipseRadiusY}
        style={dotStyle}
        fill={point.color || series.color || color(seriesIndex)}
        fillOpacity={point.opacity}
        {...dotAttributes}
        {...ellipseAttributes}
    />;
}

function renderPath({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}: DotRenderProps) {
    const {className} = props;
    const series = props.series[seriesIndex];

    const path = value(props.path, {seriesIndex, pointIndex, point, series, props});
    const pathAttributes = value(props.pathAttributes, {seriesIndex, pointIndex, point, series, props});

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

function renderSymbol({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}: DotRenderProps) {
    const {className} = props;
    const series = props.series[seriesIndex];

    const symbolType = value(props.symbolType, {seriesIndex, pointIndex, point, series, props});
    const symbolAttributes = value(props.symbolAttributes, {seriesIndex, pointIndex, point, series, props});

    const type = isString(symbolType) ? symbolsMap[symbolType] : symbolType;

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

function renderLabel({key, seriesIndex, pointIndex, point, dotStyle, dotAttributes, props, color}: DotRenderProps) {
    const {className} = props;
    const series = props.series[seriesIndex];

    const label = value(props.label, {seriesIndex, pointIndex, point, series, props});
    const labelAttributes = value(props.labelAttributes, {seriesIndex, pointIndex, point, series, props});

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
