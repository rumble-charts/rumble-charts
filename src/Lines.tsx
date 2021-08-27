import type {ReactElement} from 'react';
import type {CurveFactory} from 'd3-shape';
import type {GraphicProps, Point, Series, Size, Style} from './types';

import React from 'react';
import {area as d3Area, line as d3Line} from 'd3-shape';

import {colorFunc, curves, defaultSchemeName, isNumber, isString, value} from './helpers';

export type LineSeriesParams = {
    seriesIndex: number;
    series: Series;
    props: LinesProps;
}

export type LinesProps = {
    asAreas?: boolean;
    interpolation?: keyof typeof curves | CurveFactory,

    seriesVisible?: boolean | ((params: LineSeriesParams) => boolean);
    seriesAttributes?: Record<string, any> | ((params: LineSeriesParams) => Record<string, any>);
    seriesStyle?: Style | ((params: LineSeriesParams) => Style);

    lineVisible?: boolean | ((params: LineSeriesParams) => boolean);
    lineAttributes?: Record<string, any> | ((params: LineSeriesParams) => Record<string, any>);
    lineStyle?: Style | ((params: LineSeriesParams) => Style);

    lineWidth?: Size | ((params: LineSeriesParams) => Size);
} & GraphicProps;

/**
 * Renders lines for your line chart.
 */
export function Lines(props: LinesProps): ReactElement {
    const {
        className, style,
        scaleX, scaleY, minY, asAreas, colors = defaultSchemeName,
        series, opacity, interpolation = 'monotone', lineWidth = 3,
    } = props;

    const rotate = scaleX.swap || scaleY.swap;

    const x = scaleX.factory(props);
    const y = scaleY.factory(props);

    const _y0 = y(minY || 0);
    const color = colorFunc(colors);

    return <g className={className} style={style} opacity={opacity}>
        {series?.map((series, index) => {

            if ('seriesVisible' in props) {
                const seriesVisible = value(props.seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }
            }

            const seriesAttributes = value(props.seriesAttributes, {seriesIndex: index, series, props});
            const seriesStyle = value(props.seriesStyle, {seriesIndex: index, series, props});

            const lineVisible = !('lineVisible' in props)
                || value(props.lineVisible, {seriesIndex: index, series, props});

            let linePath;

            if (lineVisible) {

                let line;
                if (rotate) {
                    line = asAreas ?
                        d3Area<Point>()
                            .x0(point => point.y0 ? y(point.y0) : _y0)
                            .x1(point => y(point.y)) :
                        d3Line<Point>()
                            .x(point => y(point.y));

                    line.y(point => x(point.x));
                } else {
                    line = asAreas ?
                        d3Area<Point>()
                            .y0(point => point.y0 ? y(point.y0) : _y0)
                            .y1(point => y(point.y)) :
                        d3Line<Point>()
                            .y(point => y(point.y));

                    line.x(point => x(point.x));
                }

                const lineColor = series.color || color(index);

                const curve = isString(interpolation) ? curves[interpolation] : interpolation;

                line.defined(point => isNumber(point.y)).curve(curve);

                const lineAttributes = value(props.lineAttributes, {seriesIndex: index, series, props});
                const lineStyle = value([series.style, props.lineStyle], {seriesIndex: index, series, props});
                const _lineWidth = value(lineWidth, {seriesIndex: index, series, props});

                linePath = <path
                    style={lineStyle}
                    fill={asAreas ? lineColor : 'transparent'}
                    stroke={asAreas ? 'transparent' : lineColor}
                    strokeWidth={_lineWidth}
                    d={line(series.data)}
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
