import type {ReactElement, ReactNode} from 'react';
import type {ScaleContinuousNumeric} from 'd3-scale';
import type {Point, SharedProps} from './types';

import React, {useRef} from 'react';
import {proxyChildren, sortBy} from './helpers';

export type MouseEvent = {
    clientX: number;
    clientY: number;
    scaleX: ScaleContinuousNumeric<any, any>;
    scaleY: ScaleContinuousNumeric<any, any>;
    x: number;
    y: number;
    closestPoints: Point[];
    originalEvent: React.MouseEvent;
}

export type HandlersProps = SharedProps & {
    className?: string;
    sensitivity?: number;
    optimized?: boolean;
    distance?: 'x' | 'y';
    onClick?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseLeave?: React.MouseEventHandler;
    children: ReactNode;
};

/**
 * Helps to use mouse events. For now supports only `onClick`, `onMouseMove` and `onMouseLeave`.
 *
 * This component will be improved and simplified in the future.
 *
 * @example ../docs/examples/Handlers.md
 */
export function Handlers(props: HandlersProps): ReactElement {
    const {className, layerWidth, layerHeight} = props;
    const {onClick, onMouseMove, onMouseLeave} = props;

    const x = props.scaleX.factory(props);
    const y = props.scaleY.factory(props);
    const scaleX = props.scaleX.factory(props);
    const scaleY = props.scaleY.factory(props);

    const xDomain = x.domain();
    const xRange = x.range();
    x.domain(xRange);
    x.range(xDomain);

    const yDomain = y.domain();
    const yRange = y.range();
    y.domain(yRange);
    y.range(yDomain);

    const rectRef = useRef<SVGRectElement>();

    const ratio = Math.abs((y(1) - y(0)) / (x(1) - x(0)));

    function handleMouseEvent(handler, event) {
        if (!rectRef.current) {
            return;
        }

        const rect = rectRef.current.getBoundingClientRect();
        const {left, top, width, height} = rect;

        const {clientX, clientY} = event;
        const {series, sensitivity = Infinity, optimized = true, layerWidth, layerHeight} = props;
        const realX = (clientX - left) * layerWidth / width;
        const realY = (clientY - top) * layerHeight / height;
        const _x = x(realX);
        const _y = y(realY);

        let closestPoints = [];
        let minDistance = sensitivity;
        series?.forEach((series, seriesIndex) => {
            series.data?.forEach((point: Point, pointIndex) => {
                let distance;
                switch (props.distance) {
                    case 'x':
                        distance = Math.abs(point.x - _x);
                        break;
                    case 'y':
                        distance = Math.abs(point.y - _y);
                        break;
                    default:
                        distance = Math.sqrt(
                            Math.pow(Math.abs(point.x - _x) * (ratio || 1), 2) +
                            Math.pow(Math.abs(point.y - _y), 2)
                        );
                        break;
                }

                if (!optimized || distance <= minDistance) {
                    minDistance = distance;
                    closestPoints.push({
                        seriesIndex,
                        pointIndex,
                        point,
                        distance
                    });
                }
            });
        });
        closestPoints = sortBy(closestPoints, 'distance');

        handler({
            clientX: realX,
            clientY: realY,
            scaleX, scaleY, x: _x, y: _y,
            closestPoints,
            originalEvent: event
        });
    }


    const children = proxyChildren(
        props.children,
        props,
        {
            layerWidth,
            layerHeight,
            scaleX: props.scaleX,
            scaleY: props.scaleY,
        }
    );

    return <g
        className={className}
        onClick={onClick && handleMouseEvent.bind(null, onClick)}
        onMouseMove={onMouseMove && handleMouseEvent.bind(null, onMouseMove)}
        onMouseLeave={onMouseLeave}>
        <rect
            ref={rectRef}
            x={0} y={0} width={layerWidth} height={layerHeight}
            fill='transparent' stroke='transparent' />
        {children}
    </g>;
}
