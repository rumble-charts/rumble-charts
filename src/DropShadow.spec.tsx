import React from 'react';
import {create} from 'react-test-renderer';

import {DropShadow} from './DropShadow';
import {testSelector} from './specs';

describe('DropShadow', () => {

    it('should render svg filter', () => {
        const renderer = create(<DropShadow
            id='shadow'
            dx={10}
            dy={12}
            blurDeviation={7}
            blurIn='SourceAlpha'
        />);
        const filter = renderer.root.find(testSelector('filter'));
        expect(filter.props.id).toEqual('shadow');
        expect(filter.find(testSelector('feGaussianBlur')).props.in).toEqual('SourceAlpha');
        expect(filter.find(testSelector('feGaussianBlur')).props.stdDeviation).toEqual(7);
        expect(filter.find(testSelector('feOffset')).props.dx).toEqual(10);
        expect(filter.find(testSelector('feOffset')).props.dy).toEqual(12);
        const feMerge = filter.find(testSelector('feMerge'));
        expect(feMerge.findAll(testSelector('feMergeNode')).length).toEqual(2);
        expect(feMerge.findAll(testSelector('feMergeNode'))[1].props.in).toEqual('SourceGraphic');
    });

});
