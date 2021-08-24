import type {ReactElement, ReactNode} from 'react';
import type {Arc} from 'd3-shape';
import type {Colors, ColorScale, Point, Position, Series, SharedProps, Size, Style} from './types';

import React from 'react';
import {scaleLinear} from 'd3-scale';
import {arc as d3Arc} from 'd3-shape';
import {interpolate} from 'd3-interpolate';

import {colorFunc, defaultSchemeName, getCoords, normalizeNumber, value} from './helpers';

const maxAngle = 2 * Math.PI;

export type PieSeriesParams = {
    seriesIndex: number;
    series: Series;
    props: PiesProps;
};

export type PieParams = {
    seriesIndex: number;
    pointIndex: number;
    point: Point;
    series: Series;
    props: PiesProps
};

export type PiesProps = SharedProps & {
    colors?: Colors;
    opacity?: number;
    style?: Style;
    className?: string;
    position?: Position;

    innerRadius?: Size;
    cornerRadius?: Size | ((params: PieParams) => Size);
    innerPadding?: Size;
    groupPadding?: Size;
    combined?: boolean;
    startAngle?: number;
    endAngle?: number;
    padAngle?: number;
    gradientStep?: number;

    seriesVisible?: boolean | ((params: PieSeriesParams) => boolean);
    seriesAttributes?: Record<string, any> | ((params: PieSeriesParams) => Record<string, any>);
    seriesStyle?: Style | ((params: PieSeriesParams) => Style);

    groupStyle?: Style | ((params: PieParams) => Style);

    pieVisible?: boolean | ((params: PieParams) => boolean);
    pieAttributes?: Record<string, any> | ((params: PieParams) => Record<string, any>);
    pieStyle?: Style | ((params: PieParams) => Style);

    pieWidth?: Size;
};

/**
 * Renders pies for you pie chart or donut chart
 *
 * @example ../docs/examples/Pies.md
 */
export function Pies(props: PiesProps): ReactElement {
    const {
        className, style, minX, maxX, minY, maxY,
        position = 'center middle', layerWidth, layerHeight, colors = defaultSchemeName, opacity,
        startAngle = 0, endAngle = maxAngle, padAngle = 0
    } = props;

    const outerRadius = Math.min(props.layerWidth, props.layerHeight) / 2;
    const innerRadius = normalizeNumber(props.innerRadius, outerRadius);
    const innerPadding = normalizeNumber(props.innerPadding, outerRadius);
    const groupPadding = normalizeNumber(props.groupPadding, outerRadius);

    const radialScale = scaleLinear()
        .range([outerRadius, innerRadius])
        .domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

    const circularScale = scaleLinear()
        .range([startAngle, endAngle])
        .domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

    const baseWidth = Math.abs(radialScale(1) - radialScale(0));

    const pieWidth = (() => {
        if (props.pieWidth) {
            return normalizeNumber(props.pieWidth, outerRadius);
        } else {
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                const seriesCount = !props?.series ? 1 : props.series.length;
                return (baseWidth - groupPadding) / seriesCount - innerPadding;
            }
        }
    })();

    const _startAngle = circularScale(0);
    const color = colorFunc(colors);

    const coords = getCoords(position || '', layerWidth, layerHeight, outerRadius * 2, outerRadius * 2);

    const halfPadAngle = padAngle / 2 || 0;

    return <g
        className={className}
        style={style}
        transform={`translate(${(coords.x + outerRadius)} ${(coords.y + outerRadius)})`}
        opacity={opacity}>
        {props.series?.map((series, index) => {

            if ('seriesVisible' in props) {
                const seriesVisible = value(props.seriesVisible, {seriesIndex: index, series, props});
                if (!seriesVisible) {
                    return;
                }
            }

            const seriesAttributes = value(props.seriesAttributes, {seriesIndex: index, series, props});
            const seriesStyle = value(props.seriesStyle, {seriesIndex: index, series, props});

            let deltaRadial = 0;
            if (!props.combined) {
                deltaRadial = pieWidth * index - (props.series.length - 1) * 0.5 * pieWidth +
                    (index - (props.series.length - 1) / 2) * innerPadding;
            }

            return <g
                key={index}
                className={className && (className + '-series ' + className + '-series-' + index)}
                style={seriesStyle}
                opacity={series.opacity}
                {...seriesAttributes}>

                {series.data?.map((point: Point, pointIndex) => {
                    const startAngle = (point.y0 ? circularScale(point.y0) : _startAngle) + halfPadAngle;
                    const endAngle = circularScale(point.y) - halfPadAngle;
                    const radius = radialScale(point.x) - deltaRadial * (props.scaleX.direction || 1);

                    return renderArc({
                        startAngle,
                        endAngle,
                        radius,
                        pieWidth,
                        seriesIndex: index,
                        pointIndex,
                        point,
                        props,
                        color
                    });
                })}
            </g>;
        })}
    </g>;

}

type RenderArcParams = {
    startAngle: number;
    endAngle: number;
    radius: number;
    pieWidth: number;
    seriesIndex: number;
    pointIndex: number;
    point: Point;
    props: PiesProps;
    color: ColorScale;
}

function renderArc(
    {startAngle, endAngle, radius, pieWidth, seriesIndex, pointIndex, point, props, color}: RenderArcParams
): ReactNode {
    const {className, gradientStep = 0.01} = props;
    const series = props.series[seriesIndex];

    if ('pieVisible' in props) {
        const pieVisible = value(props.pieVisible, {seriesIndex, pointIndex, point, series, props});
        if (!pieVisible) {
            return;
        }
    }

    const halfWidth = pieWidth / 2;

    const cornerRadius = value(props.cornerRadius, {seriesIndex, pointIndex, point, series, props});

    const arc = d3Arc()
        .cornerRadius(normalizeNumber(cornerRadius, pieWidth))
        .padRadius(10)
        .innerRadius(radius - halfWidth)
        .outerRadius(radius + halfWidth);

    let fillColor = point.color || series.color || color(seriesIndex);
    if (Array.isArray(fillColor) && Array.from(new Set(fillColor)).length === 1) {
        fillColor = fillColor[0];
    }

    const pieStyle = value([point.style, series.style, props.pieStyle], {
        seriesIndex,
        pointIndex,
        point,
        series,
        props
    });
    const pieAttributes = value(props.pieAttributes, {seriesIndex, pointIndex, point, series, props});

    const pathProps = {
        style: pieStyle,
        fill: fillColor,
        fillOpacity: point.opacity,
        ...pieAttributes
    };

    let pathList = [];
    // fill color interpolation
    if (Array.isArray(fillColor)) {

        const interpolateAngle = interpolate(startAngle, endAngle);
        fillColor.forEach((color, index) => {

            if (index === fillColor.length - 1) {
                return;
            }

            const interpolateFillColor = interpolate(color, fillColor[index + 1]);
            const step = 1 / ((endAngle - startAngle) / gradientStep);

            for (let i = 0; i < 1; i += step) {

                pathProps.fill = interpolateFillColor(i);
                const angleIndex = (index + i) / (fillColor.length - 1);
                pathList = pathList.concat(renderArcPart({
                    startAngle: interpolateAngle(angleIndex),
                    endAngle: interpolateAngle(angleIndex + step),
                    maxAngle,
                    pathProps,
                    arc,
                    key: i
                }));

            }

        });

    } else {

        pathList = renderArcPart({
            startAngle,
            endAngle,
            maxAngle,
            pathProps,
            arc,
            key: pointIndex
        });

    }

    const groupStyle = value(props.groupStyle, {seriesIndex, pointIndex, point, series, props});

    return <g
        key={pointIndex}
        className={className && (className + '-pie ' + className + '-pie-' + pointIndex)}
        style={groupStyle}>
        {pathList}
    </g>;
}

type RenderArcPartParams = {
    startAngle: number;
    endAngle: number;
    maxAngle: number;
    pathProps: Record<string, any>;
    arc: Arc<any, any>;
    key: number;
}

function renderArcPart({startAngle, endAngle, maxAngle, pathProps, arc, key}: RenderArcPartParams): ReactNode[] {
    const pathList = [];
    while (endAngle >= 4 * Math.PI) {
        endAngle -= 2 * Math.PI;
        if (endAngle < startAngle) {
            startAngle -= 2 * Math.PI;
        }
    }
    const lapsCount = Math.abs((endAngle - startAngle) / maxAngle);

    let lapIndex = 0;
    while (lapIndex < lapsCount) {

        const d = arc({
            startAngle: startAngle,
            endAngle: Math.min(startAngle + maxAngle, endAngle)
        });
        startAngle += maxAngle;

        pathList.push(<path
            key={'' + key + lapIndex}
            {...pathProps}
            d={d}
        />);

        lapIndex++;
    }
    return pathList;
}
