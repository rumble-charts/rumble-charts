import transform from '../../../src/helpers/transform';
import transforms from '../../../src/helpers/transforms';

import generateRandomSeries from '../../helpers/generateRandomSeries';

const series = generateRandomSeries(3, 5, {type: 'object'});

describe('Helper transform', () => {

    it('should transform props using given predefined method', () => {
        expect(transform({series}, 'reverse')).toEqual(transforms.reverse({series}));
        expect(transform({series, scaleX: {}, scaleY: {}}, 'rotate')).toEqual(transforms.rotate({
            series,
            scaleX: {},
            scaleY: {}
        }));
        expect(transform({series}, 'sort')).toEqual(transforms.sort({series}));
        const stacked = transform({series}, 'stack');
        expect(stacked).toEqual(transforms.stack({series}));
        expect(transform({series}, 'stackNormalized')).toEqual(transforms.stackNormalized({series}));
        expect(transform({series}, 'transpose')).toEqual(transforms.transpose({series}));
        expect(transform(stacked, 'unstack')).toEqual(transforms.unstack(stacked));
    });

    it('should leave props as is in case of wrong method name', () => {
        expect(transform({series}, 'blabla')).toEqual({series});
    });

    it('should support function as a method', () => {
        const method = (props, options) => {
            expect(props).toEqual({series});
            expect(options).toEqual({opt: 'ions'});
            return {
                hello: 'props',
                options
            };
        };
        expect(transform({series}, method, {opt: 'ions'})).toEqual({
            hello: 'props',
            options: {
                opt: 'ions'
            },
            series
        });
    });

    it('should support object notation for method', () => {
        expect(transform({series}, {method: 'stack', options: {normalize: true}}))
            .toEqual(transform({series}, 'stack', {normalize: true}));
    });

    it('should support a sequence of methods', () => {
        expect(transform({series}, ['reverse', 'stack']))
            .toEqual(transform(transform({series}, 'reverse'), 'stack'));

        const method = (props) => {
            expect(props).toEqual(transform({series}, 'reverse'));
            return props;
        };

        expect(transform({series}, [
            'reverse',
            method,
            {method: 'stack', options: {normalize: true}}
        ]))
            .toEqual(transform(transform(transform({series}, 'reverse'), method), 'stack', {normalize: true}));
    });

    it('should ignore wrong method', () => {
        expect(transform({series}, [undefined])).toEqual({series});
    });

});
