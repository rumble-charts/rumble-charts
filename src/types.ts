import type {ScaleContinuousNumeric} from 'd3-scale';

import * as transforms from './helpers/transforms';
import {schemeMap} from './helpers';

export type Coords = {
    x: number;
    y: number;
};

export type Point = {
    x?: number;
    y: number;
    color?: string;
    opacity?: number;
    style?: Style;
} & Record<string, any>;

export type Position = Size | [Size?, Size?];

export type Series = {
    name?: string;
    color?: string;
    opacity?: number;
    style?: Style;
    data: Array<number | [number, number] | Point>;
};

export type NormalizedSeries = Omit<Series, 'data'> & {
    data: Point[]
};

export type ScaleX = {
    /**
     * 1 or -1, default value is 1
     */
    direction?: number;
    /**
     * Padding at the start of the scale domain, default value is 0.5
     */
    paddingStart?: number;
    /**
     * Padding at the end of the scale domain, default value is 0.5
     */
    paddingEnd?: number;
    /**
     * Left padding in pixels, default value is 0
     */
    paddingLeft?: number;
    /**
     * Right padding in pixels, default value is 0
     */
    paddingRight?: number;
    factory?: (props: CommonProps) => ScaleContinuousNumeric<any, any>;
    swap?: boolean;
};

export type ScaleY = {
    /**
     * 1 or -1, default value is 1
     */
    direction?: number;
    /**
     * Padding at the start of the scale domain, default value is 0
     */
    paddingStart?: number;
    /**
     * Padding at the end of the scale domain, default value is 0
     */
    paddingEnd?: number;
    /**
     * Top padding in pixels, default value is 0
     */
    paddingTop?: number;
    /**
     * Bottom padding in pixels, default value is 0
     */
    paddingBottom?: number;
    factory?: (props: CommonProps) => ScaleContinuousNumeric<any, any>;
    swap?: boolean;
};

export type SeriesProps = {
    /**
     * An array of series objects.
     */
    series?: Series[];
    seriesNormalized?: boolean;
    /**
     * Optional limit, affects on how graphics will be drawn. It's calculated automatically based on
     * `series` you've supplied, but sometimes you will need to define it by yourself.
     */
    minX?: number;
    /**
     * Optional limit, affects on how graphics will be drawn. It's calculated automatically based on
     * `series` you've supplied, but sometimes you will need to define it by yourself.
     */
    maxX?: number;
    /**
     * Optional limit, affects on how graphics will be drawn. It's calculated automatically based on
     * `series` you've supplied, but sometimes you will need to define it by yourself.
     * Especially it relates to `minY` property. Very often you have to set it as `minY={0}`.
     */
    minY?: number;
    /**
     * Optional limit, affects on how graphics will be drawn. It's calculated automatically based on
     * `series` you've supplied, but sometimes you will need to define it by yourself.
     */
    maxY?: number;
} & Record<string, any>;

export type NormalizedSeriesProps = Omit<SeriesProps, 'series' & 'seriesNormalized'> & {
    series?: NormalizedSeries[];
    seriesNormalized?: true
}

export type CommonProps = SeriesProps & {
    seriesIndex?: number | number[] | ((series: Series, index: number) => boolean);
    layerWidth?: number;
    layerHeight?: number;
    /**
     * X-scale (horizontal) attributes. For better understanding see examples below.
     */
    scaleX?: ScaleX;
    /**
     * Y-scale (vertical) attributes. For better understanding see examples below.
     */
    scaleY?: ScaleY;
}

export type GraphicProps = {
    className?: string;
    /**
     * Colors
     */
    colors?: Colors;
    opacity?: number;
    style?: Style;
} & CommonProps;

export type Size = number | string;

export type Style = Record<string, any>;

type BaseMethod = keyof typeof transforms
    | ((props: NormalizedSeriesProps, options?: any) => NormalizedSeriesProps);

export type TransformMethod = BaseMethod | {
    method: BaseMethod,
    options: any
};

export type Colors = keyof typeof schemeMap | string[] | Array<string[]> | ColorScale;

export type ColorScale = (param: any) => string;
