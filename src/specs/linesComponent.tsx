import type {CommonProps} from '../types';

import React from 'react';
import {create} from 'react-test-renderer';

import {Chart} from '../Chart';
import {generateRandomSeries} from '../helpers';
import {testSelector} from './testSelector';

type Options = Partial<{
    lineWidth: boolean;
    lineInterpolations: any[];
}>;

export function linesComponent(Component: React.FC<CommonProps>, options: Options = {}): void {
    options = {
        lineWidth: false, // true, false
        lineInterpolations: [],
        ...options,
    };

    const seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});

    describe('Line graphics renderer component', () => {

        if (options.lineWidth) {
            it('should support lineWidth property', () => {
                const renderer = create(<Chart width={100} height={100} series={seriesObjects3x5}>
                    <Component lineWidth={10} />
                </Chart>);
                const pathLines = renderer.root.findAll(testSelector('path'));
                expect(pathLines[0].props.strokeWidth).toEqual(10);
            });
        }

        if (Array.isArray(options.lineInterpolations) && options.lineInterpolations.length) {
            it('should support interpolation property', () => {

                options.lineInterpolations.forEach(interpolation => {
                    const renderer = create(<Chart width={100} height={100} series={seriesObjects3x5}>
                        <Component interpolation={interpolation} />
                    </Chart>);
                    const d = renderer.root.findAll(testSelector('path'))[0].props.d;
                    expect(d.length).toBeGreaterThan(20);
                });
            });
        }

    });

}
