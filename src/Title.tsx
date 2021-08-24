import type {ReactElement, ReactNode} from 'react';
import type {Position, Series} from './types';

import React from 'react';
import {getCoords, isFunction, isString} from './helpers';
import {Style} from './types';

export type TitleProps = {
    children: ReactNode | ((props: TitleProps) => ReactNode);
    textAnchor?: 'start' | 'middle' | 'end';
    className?: string;
    style?: Style;

    width?: number;
    height?: number;
    position?: Position;

    layerWidth?: number;
    layerHeight?: number,
    series?: Series[]
}

export function Title(props: TitleProps): ReactElement {
    const {style, className, children} = props;

    const {x, y} = getCoords(
        props.position,
        props.layerWidth, props.layerHeight,
        props.width, props.height
    );

    return (
        <g
            className={className}
            transform={`translate(${x} ${y})`}
            style={style}>
            {isString(children)
                ? <text textAnchor={props.textAnchor}>{children}</text>
                : (isFunction(children) ? children(props) : children)}
        </g>
    );
}
