import {generateRandomSeries} from './generateRandomSeries';
import {normalizeSeries} from './normalizeSeries';

import {transform} from './transform';
import * as transforms from './transforms';
import {NormalizedSeriesProps} from '../types';

const series = generateRandomSeries(3, 5, {type: 'object'});

describe('Helper transform', () => {

    it('should transform props using given predefined method', () => {
        const normProps = normalizeSeries({series});

        expect(transform(normProps, 'reverse')).toEqual(transforms.reverse(normProps));
        expect(transform({
            ...normProps,
            scaleX: {},
            scaleY: {}
        }, 'rotate')).toEqual(transforms.rotate({
            ...normProps,
            scaleX: {},
            scaleY: {}
        }));
        expect(transform(normProps, 'sort')).toEqual(transforms.sort(normProps));
        const stacked = transform(normProps, 'stack');
        expect(stacked).toEqual(transforms.stack(normProps));
        expect(transform(normProps, 'stackNormalized'))
            .toEqual(transforms.stackNormalized(normProps));
        expect(transform(normProps, 'transpose'))
            .toEqual(transforms.transpose(normProps));
        expect(transform(stacked, 'unstack')).toEqual(transforms.unstack(stacked));
    });

    it('should leave props as is in case of wrong method name', () => {
        const normProps = normalizeSeries({series});
        // @ts-ignore
        expect(transform(normProps, 'blabla')).toEqual(normProps);
    });

    it('should support function as a method', () => {
        const normProps = normalizeSeries({series});
        const method = (props: NormalizedSeriesProps, options: any) => {
            expect(props).toEqual(normProps);
            expect(options).toEqual({opt: 'ions'});
            return {
                hello: 'props',
                options
            };
        };
        // @ts-ignore
        expect(transform(normProps, method, {opt: 'ions'})).toEqual({
            hello: 'props',
            options: {
                opt: 'ions'
            },
            ...normProps
        });
    });

    it('should support object notation for method', () => {
        expect(transform(normalizeSeries({series}), {method: 'stack', options: {normalize: true}}))
            .toEqual(transform(normalizeSeries({series}), 'stack', {normalize: true}));
    });

    it('should support a sequence of methods', () => {
        expect(transform(normalizeSeries({series}), ['reverse', 'stack']))
            .toEqual(transform(transform(normalizeSeries({series}), 'reverse'), 'stack'));

        const method = (props: NormalizedSeriesProps) => {
            expect(props).toEqual(transform(normalizeSeries({series}), 'reverse'));
            return props;
        };

        expect(transform(normalizeSeries({series}), [
            'reverse',
            method,
            {method: 'stack', options: {normalize: true}}
        ]))
            .toEqual(transform(transform(transform(normalizeSeries({series}), 'reverse'), method), 'stack', {normalize: true}));
    });

    it('should ignore wrong method', () => {
        const normProps = normalizeSeries({series});
        // @ts-ignore
        expect(transform(normProps, [undefined])).toEqual(normProps);
    });

});
