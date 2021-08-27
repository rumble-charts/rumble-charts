import type {CommonProps, Series} from '../types';

import React from 'react';
import {create, act} from 'react-test-renderer';

import {Chart} from '../Chart';
import {generateRandomSeries, isUndefined} from '../helpers';
import {testSelector} from './testSelector';

type Options = Partial<{
    chartWidth: number;
    chartHeight: number;
    props: Record<string, string[]>;
    seriesObjects3x5: Series[];
    delay: number;
}>;

export function visibleProps(Component: React.FC<CommonProps>, options: Options = {}): void {
    options = {
        chartWidth: 100,
        chartHeight: 100,
        props: {
            seriesVisible: ['g', 'series']
        },
        ...options
    };
    const {
        chartWidth,
        chartHeight,
        seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'})
    } = options;

    const delay = () => {
        act(() => {
            jest.advanceTimersByTime(options.delay || 0);
        });
    };

    describe('should support "visible"-type properties', () => {

        Object.keys(options.props).forEach(visibleProperty => {
            const [tagName, className] = options.props[visibleProperty];

            const selector = isUndefined(className)
                ? testSelector(tagName)
                : testSelector(`${tagName}.chart-${className}`);

            describe(`${visibleProperty}`, () => {

                it('can be a boolean', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{[visibleProperty]: false}}
                        />
                    </Chart>);

                    delay();
                    expect(renderer.root.findAll(selector).length).toEqual(0);
                });

                it('can be a function', () => {
                    const renderer = create(<Chart
                        width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{[visibleProperty]: ({seriesIndex}) => seriesIndex !== 0}}
                        />
                    </Chart>);

                    const maxWrapper = create(<Chart
                        width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component className='chart' />
                    </Chart>);

                    delay();
                    const elementsCount = maxWrapper.root.findAll(selector).length;

                    expect(renderer.root.findAll(selector).length).toBeLessThan(elementsCount);

                    if (className) {
                        expect(renderer.root.findAll(testSelector(`${tagName}.chart-${className}-0`)).length).toEqual(0);
                        expect(renderer.root.findAll(testSelector(`${tagName}.chart-${className}-1`)).length).toEqual(1);
                        expect(renderer.root.findAll(testSelector(`${tagName}.chart-${className}-2`)).length).toEqual(1);
                    }
                });

            });
        });

    });

}
