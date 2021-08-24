import type {SeriesProps, SharedProps} from '../types';

import React, {ReactElement, ReactNode} from 'react';

import {isFunction} from './isFunction';
import {isNumber} from './isNumber';
import {isPlainObject} from './isPlainObject';
import {isUndefined} from './isUndefined';
import {normalizeSeries} from './normalizeSeries';
import {omitBy} from './omitBy';
import {pick} from './pick';

const limitsPropNames: Array<keyof SeriesProps> = ['maxX', 'maxY', 'minX', 'minY'];

export function proxyChildren(
    // Children to enhance with props
    children: ReactNode,
    // Series props to use "series" and limits (minX/maxX/minY/maxY) (other props will be ignored!)
    seriesProps: SeriesProps = {},
    // Extra props to add to every child (but a child's own props will have higher priority)
    extraProps: ((child: ReactNode) => Record<string, any>) | Record<string, any> = {}
): ReactElement<SharedProps>[] {

    // 1. Extract defined limits (if any) (minX/maxX/minY/maxY)
    const definedLimits = pick(seriesProps, limitsPropNames);
    // 2. Normalize series
    const normalizedSeriesProps = normalizeSeries(seriesProps);
    // 3. Extract real limits (normalization calculates all the limits)
    const calculatedLimits = pick(normalizedSeriesProps, limitsPropNames);
    const {series: normalizedSeries} = normalizedSeriesProps;

    return React.Children.map(children, (child: ReactElement<SharedProps>) => {
        if (!child || !React.isValidElement(child)) {
            return child;
        }

        // Building the child props

        // 1. Copy child's own props
        let cloneChildProps: SharedProps = {
            ...child.props
        };

        // 2. Merge extraProps (giving priority to the child's original props)
        const childExtraProps = isFunction(extraProps) ? extraProps(child) : extraProps;
        Object.keys(childExtraProps).forEach(extraPropName => {
            const extraPropValue = childExtraProps[extraPropName];
            if (extraPropName in cloneChildProps) {
                if (isPlainObject(extraPropValue) && isPlainObject(cloneChildProps[extraPropName])) {
                    cloneChildProps[extraPropName] = {
                        ...extraPropValue,
                        ...cloneChildProps[extraPropName],
                    };
                }
            } else {
                cloneChildProps[extraPropName] = extraPropValue;
            }
        });

        // 3. Extract defined limits (if any) (minX/maxX/minY/maxY) from the child's original props
        const definedChildLimits = pick(child.props, limitsPropNames);

        // 4. Merge layerWidth/layerHeight and normalize series
        const childNormalizedSeriesProps = normalizeSeries({
            layerWidth: cloneChildProps.layerWidth, // usually comes from "extraProps" (3rd argument)
            layerHeight: cloneChildProps.layerHeight, // usually comes from "extraProps" (3rd argument)
            ...child.props
        });

        // 4. Extract real limits (normalization calculates all the limits)
        const calculatedChildLimits = pick(childNormalizedSeriesProps, limitsPropNames);

        // 6. Combine all together by specific priorities
        cloneChildProps = {
            // limits
            ...calculatedLimits, // lower (4th) priority: calculated/normalized limits from "seriesProps" (the 2nd argument of proxyChildren function)
            ...calculatedChildLimits, // 3th priority: calculated/normalized limits for the child
            ...definedLimits, // 2nd priority: defined limits "seriesProps" (from the 2nd argument of proxyChildren function)
            ...definedChildLimits, // highest (1st priority): defined limits for the child
            // other props
            ...cloneChildProps
        };

        // 7. Construct series

        const {seriesIndex} = child.props;
        if (!child.props.series && normalizedSeries) {
            if (isUndefined(seriesIndex)) {
                cloneChildProps.series = normalizedSeries;
            } else if (isNumber(seriesIndex)) {
                cloneChildProps.series = [normalizedSeries[seriesIndex]];
            } else if (Array.isArray(seriesIndex)) {
                cloneChildProps.series = seriesIndex.map(index => normalizedSeries[index]);
            } else if (isFunction(seriesIndex)) {
                cloneChildProps.series = normalizedSeries.filter(seriesIndex);
            } else {
                cloneChildProps.series = normalizedSeries;
            }
        } else {
            cloneChildProps.series = childNormalizedSeriesProps.series;
        }
        cloneChildProps.seriesNormalized = true;

        return React.cloneElement(
            child,
            omitBy(cloneChildProps, isUndefined)
        );
    });
}
