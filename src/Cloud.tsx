import type {ReactElement} from 'react';
import type {GraphicProps, Point, Series, Style} from './types';

import React, {useEffect, useState} from 'react';
import {scaleLinear} from 'd3-scale';
import cloud from 'd3-cloud';

import {colorFunc, defaultSchemeName, isUndefined, value} from './helpers';

export type FontStyle = 'normal' | 'italic' | 'oblique' | 'inherit';
export type FontWeight =
    'normal' | 'bold' | 'bolder' | 'lighter' |
    '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

type CloudState = {
    labels: Record<number, Record<number, CloudLabel>>,
    series: Series[]
}

export type CloudLabel = Point & {
    text: string;
    size: number;
    seriesIndex: number,
    pointIndex: number;
};

export type CloudSeriesParams = {
    seriesIndex: number;
    series: Series;
    props: CloudProps;
};

export type CloudLabelParams = {
    seriesIndex: number;
    pointIndex: number;
    point: Point;
    label: CloudLabel;
    series: Series;
    props: CloudProps;
};

export type CloudProps = {
    font?: string | ((params: CloudLabel, index: number) => string);
    minFontSize?: number;
    maxFontSize?: number;
    timeInterval?: number;
    fontStyle?: FontStyle | ((params: CloudLabel, index: number) => FontStyle);
    fontWeight?: FontWeight | ((params: CloudLabel, index: number) => FontWeight);
    /**
     * Angle in degrees
     */
    rotate?: number | ((params: CloudLabel, index: number) => number);
    /**
     * Type of spiral used for positioning words. This can either be one of the two
     * built-in spirals, "archimedean" and "rectangular", or an arbitrary spiral
     * generator can be used, of the following form
     */
    spiral?: 'archimedean' | 'rectangular' | ((size: [number, number]) => (t: number) => [number, number]);
    padding?: number | ((params: CloudLabel, index: number) => number);
    random?: () => number;

    labelVisible?: boolean | ((params: CloudLabelParams) => boolean);
    labelAttributes?: Record<string, unknown> | ((params: CloudLabelParams) => Record<string, unknown>);
    labelStyle?: Style | ((params: CloudLabelParams) => Style);

    seriesVisible?: boolean | ((params: CloudSeriesParams) => boolean);
    seriesAttributes?: Record<string, unknown> | ((params: CloudSeriesParams) => Record<string, unknown>);
    seriesStyle?: Style | ((params: CloudSeriesParams) => Style);
} & GraphicProps;

/**
 * Renders cloud of tags/keywords. Uses [d3-cloud](https://www.npmjs.com/package/d3-cloud) for calculations.
 * Please notice, `series` data points should have `label` attribute. See example below.
 */
export function Cloud(props: CloudProps): ReactElement {
    const {className, layerWidth, layerHeight, colors = defaultSchemeName} = props;

    const [state, setState] = useState<CloudState>({
        labels: [],
        series: [],
    });

    useEffect(() => {
        const {
            layerWidth, layerHeight, series,
            minY, maxY, canvas,
            font = 'serif',
            minFontSize = 10,
            maxFontSize = 100,
            timeInterval = 15,
            fontStyle = 'normal',
            fontWeight = 'normal',
            rotate,
            spiral = 'archimedean',
            padding = 1,
            random,
        } = props;

        const scale = scaleLinear()
            .range([minFontSize, maxFontSize])
            .domain([minY, maxY]);

        const words = series?.reduce((words, {data}, seriesIndex) => {
            data.forEach((point: Point, pointIndex) => {
                words.push({
                    ...point,
                    text: point.label,
                    size: point.y,
                    seriesIndex,
                    pointIndex
                });
            });
            return words;
        }, [] as CloudLabel[]) || [];

        const cl = cloud()
            .size([layerWidth, layerHeight])
            .words(words)
            .font(font)
            .fontStyle(fontStyle)
            .fontWeight(fontWeight)
            .spiral(spiral)
            .padding(padding)
            .timeInterval(timeInterval)
            .fontSize(p => scale(p.size));

        if (!isUndefined(rotate)) {
            cl.rotate(rotate);
        }
        if (random) {
            cl.random(random);
        }
        if (canvas) {
            cl.canvas(canvas);
        }

        cl.on('end', (cloudLabels: CloudLabel[]) => {
            const labels = cloudLabels.reduce((labels, label) => {
                labels[label.seriesIndex] = labels[label.seriesIndex] || [];
                labels[label.seriesIndex][label.pointIndex] = label;
                return labels;
            }, [] as CloudState['labels']);

            setState({series, labels});
        });
        cl.start();

    }, [
        setState, layerWidth, layerHeight,
        props.series, props.minY, props.maxY, props.canvas, props.timeInterval,
        props.font, props.minFontSize, props.maxFontSize, props.fontStyle, props.fontWeight,
        props.rotate, props.spiral, props.padding, props.random
    ]);

    const color = colorFunc(colors);

    return <g
        className={className} style={props.style} opacity={props.opacity}
        transform={'translate(' + (layerWidth / 2) + ',' + (layerHeight / 2) + ')'}>
        {state.series?.map((series, seriesIndex) => {

            if ('seriesVisible' in props) {
                const seriesVisible = value(props.seriesVisible, {seriesIndex, series, props});
                if (!seriesVisible) {
                    return;
                }
            }

            const seriesAttributes = value(props.seriesAttributes, {seriesIndex, series, props});
            const seriesStyle = value(props.seriesStyle, {seriesIndex, series, props});

            return <g
                key={seriesIndex}
                className={className && (className + '-series ' + className + '-series-' + seriesIndex)}
                style={seriesStyle}
                opacity={series.opacity}
                {...seriesAttributes}>
                {series.data.map((point: Point, pointIndex) => {

                    const label = state.labels?.[seriesIndex]?.[pointIndex];
                    if (!label) {
                        return;
                    }

                    if ('labelVisible' in props) {
                        const labelVisible = value(props.labelVisible, {
                            seriesIndex, pointIndex, point, label, series, props
                        });
                        if (!labelVisible) {
                            return;
                        }
                    }

                    const labelAttributes = value(props.labelAttributes, {
                        seriesIndex, pointIndex, point, label, series, props
                    });
                    const labelStyle = value([point.style, series.style, props.labelStyle],
                        {seriesIndex, pointIndex, point, label, series, props}
                    );

                    return <g
                        key={pointIndex}
                        className={className && (className + '-label ' + className + '-label-' + +pointIndex)}
                        style={{
                            fontSize: label.size + 'px',
                            fontFamily: label.font
                        }}>
                        <text
                            transform={'translate(' + label.x + ',' + label.y + '),rotate(' + label.rotate + ')'}
                            fill={point.color || series.color || color(seriesIndex)}
                            fillOpacity={point.opacity}
                            textAnchor='middle'
                            style={labelStyle}
                            {...labelAttributes}>
                            {label.text}
                        </text>
                    </g>;
                })}
            </g>;
        })}
    </g>;

}
