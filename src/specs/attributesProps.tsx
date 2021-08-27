import type {CommonProps, Point, Series} from '../types';

import React from 'react';
import {create, act} from 'react-test-renderer';

import {Chart} from '../Chart';
import {generateRandomSeries, isUndefined} from '../helpers';
import {testSelector} from './testSelector';

type Options = Partial<{
    chartWidth: number;
    chartHeight: number;
    props: Record<any, string[]>;
    seriesObjects3x5: Series[];
    delay: number;
}>;

export function attributesProps(Component: React.FC<CommonProps>, options: Options = {}): void {
    options = {
        chartWidth: 100,
        chartHeight: 100,
        delay: 0,
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

    describe('should support "attributes"-type properties', () => {

        Object.keys(options.props).forEach(attrProperty => {
            const [tagName, className] = options.props[attrProperty];

            const selector = isUndefined(className)
                ? testSelector(tagName)
                : testSelector(`${tagName}.chart-${className}`);

            describe(`${attrProperty}`, () => {

                it('can be an object', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{[attrProperty]: {transform: 'translateX(10px)'}}}
                        />
                    </Chart>);
                    delay();
                    const list = renderer.root.findAll(selector);
                    expect(list.length).toBeGreaterThan(0);
                    expect(list[0].props.transform).toEqual('translateX(10px)');
                });

                it('can be a function', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component
                            className='chart'
                            {...{
                                [attrProperty]: ({series}) => ({
                                    transform: 'translateX(1' + series.data[0].y + 'px)'
                                })
                            }}
                        />
                    </Chart>);
                    delay();
                    const list = renderer.root.findAll(selector);
                    expect(list[list.length - 1].props.transform)
                        .toEqual('translateX(1' + (seriesObjects3x5[2].data[0] as Point).y + 'px)');
                });

                it('should not have default value', () => {
                    const renderer = create(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                    expect(renderer.root.findByType(Component).props[attrProperty.toString()]).toBeUndefined();
                });

            });
        });

    });

}
