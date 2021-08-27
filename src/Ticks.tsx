import type {ReactElement, ReactNode} from 'react';
import type {ScaleContinuousNumeric} from 'd3-scale';
import type {GraphicProps, Size, Style} from './types';

import React from 'react';
import {isNumber, isString, isUndefined, normalizeNumber, value} from './helpers';

export type TicksDefinition = {
    maxTicks?: number;
    minDistance?: number;
    distance?: number;
};

export type Tick = Partial<{
    x: number;
    y: number;
    label: ReactNode | (() => ReactNode);
    labelStyle: Style;
    labelAttributes: Record<string, any>;
    lineStyle: Style;
    lineAttributes: Record<string, any>;
    lineLength: Size;
    lineOffset: Size;
}>;

export type TicksConfig = number | TicksDefinition | Array<number | Tick>;

export type TickParams = {
    index: number;
    ticksLength: number;
    tick: Tick,
    props: TicksProps;
}

export type TicksProps = {
    axis?: 'x' | 'y';
    position?: 'top' | 'bottom' | 'left' | 'right';

    ticks?: TicksConfig | ((props: TicksProps) => number | TicksConfig);

    tickVisible?: boolean | ((params: TickParams) => boolean);
    tickAttributes?: Record<string, any> | ((params: TickParams) => Record<string, any>);
    tickStyle?: Style | ((params: TickParams) => Style);

    label?: ReactNode | ((params: TickParams) => ReactNode);
    labelVisible?: boolean | ((params: TickParams) => boolean);
    labelAttributes?: Record<string, any> | ((params: TickParams) => Record<string, any>);
    labelStyle?: Style | ((params: TickParams) => Style);
    labelFormat?: (label: string) => ReactNode,

    lineVisible?: boolean | ((params: TickParams) => boolean);
    lineAttributes?: Record<string, any> | ((params: TickParams) => Record<string, any>);
    lineStyle?: Style | ((params: TickParams) => Style);
    lineLength?: Size | ((params: TickParams) => Size);
    lineOffset?: Size | ((params: TickParams) => Size);
} & Omit<GraphicProps, 'colors'>;

/**
 * Renders ticks (labels and lines) for axis (x and y).
 */
export function Ticks(props: TicksProps): ReactElement {
    const {className, scaleX, scaleY, axis = 'x', style} = props;

    const x = scaleX.factory(props);
    const y = scaleY.factory(props);
    const horizontal = (axis === 'y' && !scaleX.swap && !scaleY.swap) ||
        (axis === 'x' && (scaleX.swap || scaleY.swap));
    const position = props.position ||
        (axis === 'x' ?
            (scaleX.swap || scaleY.swap ? 'top' : 'bottom') :
            'left');

    const ticks1 = value([props.ticks], props);
    const ticks2 = isNumber(ticks1) ? {maxTicks: ticks1} : (ticks1 || {});
    const ticks = Array.isArray(ticks2) ? ticks2 : generateTicks(props, ticks2);

    return <g className={className} style={style} opacity={props.opacity}>
        {ticks.map((tick, index) => renderTick({
            ticksLength: ticks.length,
            tick, index,
            x, y, horizontal, position, props
        }))}
    </g>;

}

function generateTicks(props, {maxTicks, minDistance, distance}: TicksDefinition): number[] {
    const {axis, maxX, maxY, minX, minY} = props;

    const max = axis === 'y' ? maxY : maxX;
    const min = axis === 'y' ? minY : minX;
    const length = max - min;

    if (isUndefined(minDistance)) {
        minDistance = Math.min(1, length);
    }

    if (isUndefined(maxTicks)) {
        maxTicks = Math.min((length + minDistance) / minDistance, 5);
    }

    if (isUndefined(distance)) {
        distance = Math.max(minDistance, length / maxTicks);
        distance = Math.ceil(distance / minDistance) * minDistance;
    }

    const result = [];
    for (let i = min; i < max + minDistance; i += distance) {
        result.push(i);
    }
    return result;
}

type RenderTickParams = {
    ticksLength: number;
    tick: Tick | number;
    index: number;
    x: ScaleContinuousNumeric<any, any>;
    y: ScaleContinuousNumeric<any, any>;
    horizontal: boolean;
    position: TicksProps['position'];
    props: TicksProps;
};

function renderTick(
    {
        ticksLength,
        tick: _tick,
        index,
        x, y, horizontal, position, props,
    }: RenderTickParams
) {
    const {axis, className, layerWidth, layerHeight, scaleX, scaleY} = props;

    const tick = isNumber(_tick) ? {[axis]: _tick} : _tick;

    if ('tickVisible' in props) {
        const tickVisible = value(props.tickVisible, {index, ticksLength, tick, props});
        if (!tickVisible) {
            return;
        }
    }

    const tickAttributes = value(props.tickAttributes, {index, ticksLength, tick, props});
    const tickStyle = value(props.tickStyle, {index, ticksLength, tick, props});

    const pX = axis === 'x' ? x(tick.x) : normalizeNumber(position, layerWidth);
    const pY = axis === 'y' ? y(tick.y) : normalizeNumber(position, layerHeight);

    const transform = (scaleX.swap || scaleY.swap) ?
        ('translate(' + pY + ' ' + pX + ')') :
        ('translate(' + pX + ' ' + pY + ')');

    return <g
        key={index} style={tickStyle}
        transform={transform}
        className={className && (className + '-tick ' + className + '-tick-' + index)}
        {...tickAttributes}>
        {renderLabel({ticksLength, tick, index, props})}
        {renderLine({ticksLength, tick, index, horizontal, props})}
    </g>;
}

type RenderLabelParams = {
    ticksLength: number;
    tick: Tick;
    index: number;
    props: TicksProps;
};

function renderLabel({ticksLength, tick, index, props}: RenderLabelParams) {
    const {className, axis} = props;

    if ('labelVisible' in props) {
        const labelVisible = value(props.labelVisible, {index, ticksLength, tick, props});
        if (!labelVisible) {
            return;
        }
    }

    const labelAttributes = value([tick.labelAttributes, props.labelAttributes], {index, ticksLength, tick, props});
    const labelStyle = value([tick.labelStyle, props.labelStyle], {index, ticksLength, tick, props});

    const label = value([tick.label, props.label, tick[axis]], {index, ticksLength, tick, props});

    if (isString(label) || isNumber(label)) {
        return <text
            style={labelStyle}
            className={className && (`${className}-label ${className}-label-${index}`)}
            {...labelAttributes}>
            {value(props.labelFormat, label + '') || label}
        </text>;
    } else {
        return label;
    }
}

type RenderLineParams = {
    ticksLength: number;
    tick: Tick;
    index: number;
    horizontal: boolean;
    props: TicksProps;
};

function renderLine({ticksLength, tick, index, horizontal, props}: RenderLineParams) {
    const {lineLength = 5, lineOffset = 0, layerWidth, layerHeight, className} = props;

    if ('lineVisible' in props) {
        const lineVisible = value(props.lineVisible, {index, ticksLength, tick, props});
        if (!lineVisible) {
            return null;
        }
    }

    const lineAttributes = value([tick.lineAttributes, props.lineAttributes], {index, ticksLength, tick, props});
    const lineStyle = value([tick.lineStyle, props.lineStyle], {index, ticksLength, tick, props});

    const _lineLength = normalizeNumber(
        value([tick.lineLength, lineLength], {index, ticksLength, tick, props}),
        horizontal ? layerWidth : layerHeight
    );
    const _lineOffset = normalizeNumber(
        value([tick.lineOffset, lineOffset], {index, ticksLength, tick, props}),
        horizontal ? layerWidth : layerHeight
    );

    const d = horizontal ?
        ('M' + _lineOffset + ',0 h' + _lineLength) :
        ('M0,' + _lineOffset + ' v' + _lineLength);

    return <path
        style={lineStyle}
        className={className && (`${className}-line ${className}-line-${index}`)}
        d={d}
        {...lineAttributes}
    />;
}
