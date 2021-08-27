import type {ReactElement, ReactNode} from 'react';
import type {CommonProps, NormalizedSeriesProps, TransformMethod} from './types';

import React from 'react';
import {isUndefined, proxyChildren, transform} from './helpers';

export type TransformProps = {
    className?: string;
    /**
     * Possible string values: `stack`, `stackNormalized`, `sort`, `unstack`,
     * `transpose`, `rotate`, `reverse`. Also you can define it as function that
     * receives props as an object, transforms it somehow and returns changes props as an object.
     */
    method: TransformMethod | TransformMethod[];
    children: ReactNode
} & CommonProps;

/**
 * Transforms `series` data according chosen `method`.
 *
 * As a wrapper it takes `series` obtained from its parent and gives it to its children.
 */
export function Transform(props: TransformProps): ReactElement {
    const {className, layerWidth, layerHeight, scaleX, scaleY} = props;

    const transformedProps = transform(props as NormalizedSeriesProps, props.method);

    const children = proxyChildren(
        props.children,
        transformedProps,
        {
            layerWidth: isUndefined(transformedProps.layerWidth) ? layerWidth : transformedProps.layerWidth,
            layerHeight: isUndefined(transformedProps.layerHeight) ? layerHeight : transformedProps.layerHeight,
            scaleX: isUndefined(transformedProps.scaleX) ? scaleX : transformedProps.scaleX,
            scaleY: isUndefined(transformedProps.scaleY) ? scaleY : transformedProps.scaleY
        }
    );

    return (
        <g className={className}>
            {children}
        </g>
    );
}
