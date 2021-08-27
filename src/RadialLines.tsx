import type {ReactElement} from 'react';
import type {CurveFactory} from 'd3-shape';
import type {GraphicProps, Point, Position, Series, Size, Style} from './types';

import React from 'react';
import {scaleLinear} from 'd3-scale';
import {areaRadial, lineRadial} from 'd3-shape';

import {
    colorFunc,
    curves,
    defaultSchemeName,
    getCoords,
    isNumber,
    isString,
    normalizeNumber,
    value
} from './helpers';

type RadialLineParams = {
    seriesIndex: number;
    series: Series;
    props: RadialLinesProps;
};

export type RadialLinesProps = {
    position?: Position;
    asAreas?: boolean;
    innerRadius?: Size;
    startAngle?: number;
    endAngle?: number;
    interpolation?: keyof typeof curves | CurveFactory,

    seriesVisible?: boolean | ((params: RadialLineParams) => boolean);
    seriesAttributes?: Record<string, any> | ((params: RadialLineParams) => Record<string, any>);
    seriesStyle?: Style | ((params: RadialLineParams) => Style);

    lineVisible?: boolean | ((params: RadialLineParams) => boolean);
    lineAttributes?: Record<string, any> | ((params: RadialLineParams) => Record<string, any>);
    lineStyle?: Style | ((params: RadialLineParams) => Style);

    lineWidth?: Size | ((params: RadialLineParams) => Size);
} & GraphicProps;

/**
 * Renders radial lines for your radar chart
 */
export function RadialLines(props: RadialLinesProps): ReactElement {
    const {
        className, style, asAreas, colors = defaultSchemeName, minX, maxX, minY, maxY,
        position = 'center middle', layerWidth, layerHeight, opacity, series,
        interpolation = 'cardinal-closed', startAngle = 0, endAngle = 2 * Math.PI,
        lineWidth = 3, innerRadius = 0
    } = props;

    const _outerRadius = Math.min(props.layerWidth, props.layerHeight) / 2;
    const _innerRadius = normalizeNumber(innerRadius, _outerRadius);

    const radialScale = scaleLinear()
        .range([_innerRadius, _outerRadius])
        .domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

    const circularScale = scaleLinear()
        .range([startAngle, endAngle])
        .domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

    const _radius0 = radialScale(0);

    const coords = getCoords(position || '', layerWidth, layerHeight, _outerRadius * 2, _outerRadius * 2);

    const color = colorFunc(colors);

    return <g
        className={className}
        style={style}
        transform={'translate(' + (coords.x + _outerRadius) + ' ' + (coords.y + _outerRadius) + ')'}
        opacity={opacity}>

        {series?.map((series, index) => {

            if ('seriesVisible' in props) {
                const seriesVisible = value(props.seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }
            }

            const seriesAttributes = value(props.seriesAttributes, {seriesIndex: index, series, props});
            const seriesStyle = value(props.seriesStyle, {seriesIndex: index, series, props});

            let linePath;
            const lineVisible = !('lineVisible' in props)
                || value(props.lineVisible, {seriesIndex: index, series, props});

            if (lineVisible) {
                const line = asAreas ?
                    areaRadial<Point>()
                        .innerRadius(point => point.y0 ? radialScale(point.y0) : _radius0)
                        .outerRadius(point => radialScale(point.y)) :
                    lineRadial<Point>()
                        .radius(point => radialScale(point.y));

                const lineColor = series.color || color(index);

                const curve = isString(interpolation) ? curves[interpolation] : interpolation;

                line.angle(point => circularScale(point.x))
                    .defined(point => isNumber(point.y))
                    .curve(curve);

                const lineAttributes = value(props.lineAttributes, {seriesIndex: index, series, props});
                const lineStyle = value([series.style, props.lineStyle], {seriesIndex: index, series, props});
                const _lineWidth = value(lineWidth, {seriesIndex: index, series, props});

                linePath = <path
                    style={lineStyle}
                    fill={asAreas ? lineColor : 'transparent'}
                    stroke={asAreas ? 'transparent' : lineColor}
                    strokeWidth={_lineWidth}
                    d={line(series.data as Point[])}
                    {...lineAttributes}
                />;
            }

            return <g
                key={index}
                className={className && (`${className}-series ${className}-series-${index}`)}
                style={seriesStyle}
                opacity={series.opacity}
                {...seriesAttributes}>
                {linePath}
            </g>;
        })}
    </g>;
}
