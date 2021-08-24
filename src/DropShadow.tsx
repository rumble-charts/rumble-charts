import type {ReactElement} from 'react';

import React from 'react';

export type DropShadowProps = {
    id: string;
    blurIn?: 'SourceAlpha' | 'SourceGraphic' | 'BackgroundImage' | 'BackgroundAlpha' | 'FillPaint' | 'StrokePaint';
    blurDeviation?: number;
    dx?: number;
    dy?: number;
};

export function DropShadow(
    {id, dx = 1, dy = 1, blurDeviation = 4, blurIn = 'SourceAlpha'}: DropShadowProps
): ReactElement {
    return <filter id={id}>
        <feGaussianBlur in={blurIn} stdDeviation={blurDeviation} />
        <feOffset dx={dx} dy={dy} />
        <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
        </feMerge>
    </filter>;
}
