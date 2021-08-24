import type {ReactElement, ReactNode} from 'react';
import type {ScaleX, ScaleY, SeriesProps} from './types';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {timer} from 'd3-timer';
import {interpolate as d3Interpolate} from 'd3-interpolate';

import {eases, isFunction, isString, isUndefined, normalizeSeries, omitBy, pick, proxyChildren} from './helpers';

export type AnimateProps = SeriesProps & {
    interpolateProps?: Array<keyof SeriesProps>;
    duration?: number;
    logFPS?: boolean;
    ease?: ((num: number) => number) | keyof typeof eases;
    className?: string;
    scaleX?: ScaleX;
    scaleY?: ScaleY;
    children: ReactNode;
    tag?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onCancel?: () => void;
}

/**
 * Animates (actually interpolates) your `series` data. Very useful when you want to have a simple transitions
 * between data state.
 *
 * As a wrapper it takes `series` obtained from its parent and gives it to its children.
 *
 * @example ../docs/examples/Animate.md
 */
export function Animate(props: AnimateProps): ReactElement {
    const {
        interpolateProps = ['series', 'maxX', 'maxY', 'minX', 'minY', 'layerWidth', 'layerHeight'],
        duration = 500,
        ease = 'linear',
        tag = 'g',
        onStart, onEnd, onCancel, logFPS, ...pickProps
    } = props;

    const [state, setState] = useState(() => ({
        ...pickProps,
        ...normalizeSeries(pickProps)
    }));

    const prevPropsRef = useRef<AnimateProps>(props);

    const newPropsRef = useRef<SeriesProps>();
    newPropsRef.current = useMemo(() => {

        const newProps = Object.keys(pickProps).reduce((newProps, propName) => {
            if (pickProps[propName] !== prevPropsRef.current?.[propName]) {
                newProps[propName] = pickProps[propName];
            }
            return newProps;
        }, {} as Record<string, any>);
        return Object.keys(newProps).length > 0 ? newProps : null;

    }, [props !== prevPropsRef.current]) || newPropsRef.current;

    prevPropsRef.current = props;

    useEffect(() => {
        const newProps = newPropsRef.current;
        if (!newProps) {
            return;
        }

        const interpolate = d3Interpolate(
            pick(state, interpolateProps),
            pick(
                {
                    ...newProps,
                    ...normalizeSeries(newProps),
                },
                interpolateProps
            )
        );

        const easeFunc = isString(ease) ?
            eases[ease] :
            (isFunction(ease) ? ease : eases['linear']);

        onStart && onStart();

        let i = 0;
        const _timer = timer(p => {
            i++;
            if (p >= duration) {
                p = duration;
                setState(state => ({
                    ...state,
                    ...interpolate(easeFunc(p / duration))
                }));

                onEnd && onEnd();
                if (logFPS) {
                    console.warn(i * (1000 / duration) + 'fps; ' + i + ' frames in ' + duration + 'ms');
                }
                _timer.stop();
            } else {
                setState(state => ({
                    ...state,
                    ...interpolate(easeFunc(p / duration))
                }));
            }
        });

        return () => {
            onCancel && onCancel();
            _timer.stop();
        };

    }, [newPropsRef.current]);

    return React.createElement(
        tag,
        {className: pickProps.className},
        proxyChildren(
            pickProps.children,
            omitBy(state, isUndefined),
            {
                layerWidth: state.layerWidth,
                layerHeight: state.layerHeight,
                scaleX: pickProps.scaleX,
                scaleY: pickProps.scaleY
            }
        )
    );
}
