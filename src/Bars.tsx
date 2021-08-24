import type {ReactElement} from 'react';
import type {Colors, Point, Series, SharedProps, Size, Style} from './types';

import React, {useMemo} from 'react';

import {colorFunc, defaultSchemeName, normalizeNumber, value} from './helpers';

export type BarParams = {
    seriesIndex: number;
    pointIndex: number;
    point: Point;
    series: Series;
    props: BarsProps;
}

export type BarSeriesParams = {
    seriesIndex: number;
    series: Series;
    props: BarsProps;
}

export type BarsProps = SharedProps & {
    className?: string;
    /**
     * Colors
     */
    colors?: Colors;
    opacity?: number;
    style?: Style;

    combined?: boolean;
    groupPadding?: Size | ((props: BarsProps) => Size);
    innerPadding?: Size | ((props: BarsProps) => Size);

    seriesVisible?: boolean | ((params: BarSeriesParams) => boolean);
    seriesAttributes?: Record<string, any> | ((params: BarSeriesParams) => Record<string, any>);
    seriesStyle?: Style | ((params: BarSeriesParams) => Style);

    groupStyle?: Style | ((params: BarParams) => Style);

    barVisible?: boolean | ((params: BarParams) => boolean);
    barAttributes?: Record<string, any> | ((params: BarParams) => Record<string, any>);
    barStyle?: Style | ((params: BarParams) => Style);

    barWidth?: Size | ((props: BarsProps) => Size);
};

/**
 * 123Renders bars for your bar chart.
 *
 * @example ../docs/examples/Bars.md
 */
export function Bars(props: BarsProps): ReactElement {
    const {className, style, colors = defaultSchemeName, opacity} = props;

    const x = props.scaleX.factory(props);
    const y = props.scaleY.factory(props);

    let domainX = x.domain();
    const naturalDirection = domainX[1] > domainX[0];

    if (domainX[0] === props.minX || domainX[0] === props.maxX) {
        x.domain([domainX[0] + (naturalDirection ? -0.5 : 0.5), domainX[1]]);
        domainX = x.domain();
    }
    if (domainX[1] === props.minX || domainX[1] === props.maxX) {
        x.domain([domainX[0], domainX[1] + (naturalDirection ? 0.5 : -0.5)]);
    }

    const baseWidth = Math.abs(x(1) - x(0));
    const _y0 = y(0);
    const color = colorFunc(colors);

    const {
        innerPadding,
        groupPadding
    } = useMemo(() => {
        const {innerPadding = 0, groupPadding = 0} = props;
        return {
            innerPadding: normalizeNumber(value(innerPadding, props), props.layerWidth),
            groupPadding: normalizeNumber(value(groupPadding, props), props.layerWidth)
        };
    }, [props.innerPadding, props.groupPadding, props.layerWidth]);

    const barWidth = useMemo(() => {

        if (props.barWidth) {
            return normalizeNumber(value(props.barWidth, props), props.layerWidth);
        } else {
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                return (baseWidth - groupPadding) / (props.series || []).length - innerPadding;
            }
        }

    }, [
        props.barWidth, props.layerWidth, innerPadding, groupPadding,
        props.combined, (props.series || []).length, baseWidth
    ]);

    const renderBar = (x, y, width, height, seriesIndex, pointIndex, point) => {
        const series = props.series[seriesIndex];

        if ('barVisible' in props) {
            const barVisible = value(props.barVisible, {seriesIndex, pointIndex, point, series, props});
            if (!barVisible) {
                return;
            }
        }

        const groupStyle = value(props.groupStyle, {seriesIndex, pointIndex, point, series, props});

        const d = (props.scaleX.swap || props.scaleY.swap) ?
            ('M0,' + (-height / 2) + ' h' + (width) + ' v' + height + ' h' + (-width) + ' Z') :
            ('M' + (-width / 2) + ',0 v' + height + ' h' + width + ' v' + (-height) + ' Z');

        const barAttributes = value(props.barAttributes, {seriesIndex, pointIndex, point, series, props});
        const barStyle = value([point.style, series.style, props.barStyle], {
            seriesIndex, pointIndex, point, series, props
        });

        return <g
            key={pointIndex}
            className={className && (className + '-bar ' + className + '-bar-' + pointIndex)}
            transform={'translate(' + x + ' ' + y + ')'}
            style={groupStyle}>
            <path
                style={barStyle}
                fill={point.color || series.color || color(seriesIndex)}
                fillOpacity={point.opacity}
                d={d}
                {...barAttributes} />
        </g>;
    };

    const renderSeries = (series, index) => {

        if ('seriesVisible' in props) {
            const seriesVisible = value(props.seriesVisible, {seriesIndex: index, series, props});
            if (!seriesVisible) {
                return;
            }
        }

        const seriesAttributes = value(props.seriesAttributes, {seriesIndex: index, series, props});
        const seriesStyle = value(props.seriesStyle, {seriesIndex: index, series, props});

        let deltaX = 0;
        if (!props.combined) {
            deltaX = barWidth * index -
                (props.series.length - 1) * 0.5 * barWidth +
                (index - (props.series.length - 1) / 2) * innerPadding;
        }


        return <g
            key={index}
            className={className && (className + '-series ' + className + '-series-' + index)}
            opacity={series.opacity}
            style={seriesStyle}
            {...seriesAttributes}>

            {series && series.data.map((point, pointIndex) => {
                const y0 = point.y0 ? y(point.y0) : _y0;
                const y1 = y(point.y);
                const x1 = x(point.x) + deltaX * (props.scaleX.direction || 1);

                if (props.scaleX.swap || props.scaleY.swap) {
                    return renderBar(y1, x1, y0 - y1, barWidth, index, pointIndex, point);
                } else {
                    return renderBar(x1, y1, barWidth, y0 - y1, index, pointIndex, point);
                }
            })}

        </g>;
    };

    return (
        <g
            className={className}
            style={style}
            opacity={opacity}>
            {props.series?.map(renderSeries)}
        </g>
    );
}
