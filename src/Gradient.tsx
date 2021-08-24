import type {ReactElement, ReactNode} from 'react';
import type {Size} from './types';

import React, {useMemo} from 'react';
import {isUndefined} from './helpers';

export type GradientProps = {
    id?: string;
    idPrefix?: string;
    type?: 'linear' | 'radial';
    spreadMethod?: 'pad' | 'repeat' | 'reflect';
    gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
    gradientTransform?: string;
    // for linear gradient
    from?: [Size, Size];
    to?: [Size, Size];
    // for radial gradient
    center?: [Size, Size];
    focalPoint?: [Size, Size];
    cx?: Size;
    cy?: Size;
    fx?: Size;
    fy?: Size;
    r?: Size;
    x1?: Size;
    y1?: Size;
    x2?: Size;
    y2?: Size;
    radius?: Size;
    children?: ReactNode;
}

let counter = 0;

export function Gradient(
    {
        type = 'linear',
        idPrefix = 'chartGradient',
        gradientUnits = 'objectBoundingBox',
        spreadMethod = 'pad',
        // for linear gradient
        from = ['0%', '0%'],
        to = ['100%', '0%'],
        // for radial gradient
        center = ['50%', '50%'],
        ...props
    }: GradientProps
): ReactElement {
    const id = useMemo(() => {
        if (props.id) {
            return props.id;
        }
        counter++;
        return idPrefix + counter;
    }, [props.id, idPrefix]);

    if (type === 'radial') {
        const {
            focalPoint, radius, gradientTransform, cx, cy, fx, fy, r
        } = props;

        const _cx = isUndefined(cx) ? (center && center[0]) : cx;
        const _cy = isUndefined(cy) ? (center && center[1]) : cy;
        const _fx = isUndefined(fx) ? (focalPoint && focalPoint[0]) : fx;
        const _fy = isUndefined(fy) ? (focalPoint && focalPoint[1]) : fy;
        const _r = isUndefined(r) ? radius : r;

        return <radialGradient
            id={id}
            gradientUnits={gradientUnits} gradientTransform={gradientTransform} spreadMethod={spreadMethod}
            cx={_cx} cy={_cy} fx={_fx} fy={_fy} r={_r}>
            {props.children}
        </radialGradient>;

    } else {

        const {gradientTransform, x1, y1, x2, y2} = props;

        const _x1 = isUndefined(x1) ? (from && from[0]) : x1;
        const _y1 = isUndefined(y1) ? (from && from[1]) : y1;
        const _x2 = isUndefined(x2) ? (to && to[0]) : x2;
        const _y2 = isUndefined(y2) ? (to && to[1]) : y2;

        return <linearGradient
            id={id}
            gradientUnits={gradientUnits} gradientTransform={gradientTransform} spreadMethod={spreadMethod}
            x1={_x1} y1={_y1} x2={_x2} y2={_y2}>
            {props.children}
        </linearGradient>;
    }
}
