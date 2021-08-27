import type {ReactElement, ReactNode} from 'react';
import type {Position, CommonProps, Size, Style} from './types';

import React, {useMemo} from 'react';
import {getCoords, normalizeNumber, proxyChildren} from './helpers';

export type LayerProps = CommonProps & {
    className?: string;
    style?: Style;
    width?: Size;
    height?: Size;
    position?: Position;
    children?: ReactNode;
};

/**
 * Creates a new layer using specific `width` and `height` at specific `position`. It's useful when
 * you have two or more graphics on the same chart. Or in case you to have a margins.
 */
export function Layer(
    {
        width = '100%',
        height = '100%',
        position = 'middle center',
        layerWidth, layerHeight,
        className, scaleX, scaleY, style,
        ...props
    }: LayerProps
): ReactElement {
    const _width = useMemo(() => {
        return normalizeNumber(width, layerWidth);
    }, [width, props.layerWidth]);

    const _height = useMemo(() => {
        return normalizeNumber(height, layerHeight);
    }, [height, props.layerHeight]);

    const {x, y} = useMemo(() => {
        return getCoords(position, layerWidth, layerHeight, _width, _height);
    }, [position, layerWidth, layerHeight, _width, _height]);

    const children = proxyChildren(
        props.children,
        props,
        {
            layerWidth: _width,
            layerHeight: _height,
            scaleX,
            scaleY
        }
    );

    return <g
        className={className}
        transform={`translate(${x} ${y})`}
        style={style}>
        {children}
    </g>;

}
