import type {Point, Series, SharedProps} from '../types';

import React from 'react';
import {create, act} from 'react-test-renderer';

import {Chart} from '../Chart';
import {generateRandomSeries, isUndefined} from '../helpers';
import {testSelector} from './testSelector';

type Options = Partial<{
    chartWidth: number;
    chartHeight: number;
    props: Record<string, string[]>;
    delay: number;
    seriesObjects3x5: Series[]
}>;

export function styleProps(Component: React.FC<SharedProps>, options: Options = {}): void {
    options = {
        chartWidth: 100,
        chartHeight: 100,
        props: {
            seriesStyle: ['g', 'series']
        },
        ...options
    };
    const {
        chartWidth, chartHeight,
        seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'})
    } = options;

    const delay = () => {
        act(() => {
            jest.advanceTimersByTime(options.delay || 0);
        });
    };

    describe('should support "style"-type properties', () => {

        Object.keys(options.props).forEach(styleProperty => {
            const [tagName, className] = options.props[styleProperty];

            const selector = isUndefined(className)
                ? testSelector(tagName)
                : testSelector(`${tagName}.chart-${className}`);

            describe(`${styleProperty}`, () => {

                it('can be an object', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{[styleProperty]: {display: 'none'}}}
                        />
                    </Chart>);
                    delay();
                    expect(renderer.root.findAll(selector).length).toBeGreaterThan(0);
                    expect(renderer.root.findAll(selector).every(instance => instance.props?.style?.display === 'none')).toBe(true);
                });

                it('can be a function', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{
                                [styleProperty]: ({series}) => ({
                                    display: '1' + series.data[0].y + 'ms'
                                })
                            }}
                        />
                    </Chart>);
                    delay();
                    const list = renderer.root.findAll(selector);
                    expect(list.length).toBeGreaterThan(0);
                    const {style} = list[list.length - 1].props;
                    expect(style.display).toEqual('1' + (seriesObjects3x5[2].data[0] as Point).y + 'ms');
                });

            });
        });

    });

}
