import React from 'react';
import {create} from 'react-test-renderer';

import {Gradient} from './Gradient';

describe('Gradient', () => {

    describe('should render linear gradient', () => {

        it('use from and to props', () => {
            const renderer = create(<Gradient
                id='linearGrad'
                gradientTransform='matrix()'
                from={['0%', '5%']} to={['15%', '100%']}>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>);
            const gradient = renderer.root.findByType('linearGradient');
            expect(gradient.props.id).toEqual('linearGrad');
            expect(gradient.props.gradientUnits).toEqual('objectBoundingBox');
            expect(gradient.props.gradientTransform).toEqual('matrix()');
            expect(gradient.props.spreadMethod).toEqual('pad');
            expect(gradient.props.x1).toEqual('0%');
            expect(gradient.props.y1).toEqual('5%');
            expect(gradient.props.x2).toEqual('15%');
            expect(gradient.props.y2).toEqual('100%');
            expect(renderer.root.findAllByType('stop').length).toEqual(2);
        });

        it('use x1, y1, x2 and y2 props', () => {
            const renderer = create(<Gradient
                id='linearGrad'
                type='linear'
                x1='0%' y1='5%' x2={100} y2={150}>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>);
            const gradient = renderer.root.findByType('linearGradient');
            expect(gradient.props.x1).toEqual('0%');
            expect(gradient.props.y1).toEqual('5%');
            expect(gradient.props.x2).toEqual(100);
            expect(gradient.props.y2).toEqual(150);
        });

    });

    describe('should render radial gradient', () => {

        it('use center, focalPoint and radius props', () => {
            const renderer = create(<Gradient
                id='radialGrad'
                type='radial'
                gradientTransform='matrix()'
                radius={77}
                center={['40%', '45%']} focalPoint={['15%', '100%']}>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>);
            const gradient = renderer.root.findByType('radialGradient');
            expect(gradient.props.id).toEqual('radialGrad');
            expect(gradient.props.gradientUnits).toEqual('objectBoundingBox');
            expect(gradient.props.gradientTransform).toEqual('matrix()');
            expect(gradient.props.spreadMethod).toEqual('pad');
            expect(gradient.props.cx).toEqual('40%');
            expect(gradient.props.cy).toEqual('45%');
            expect(gradient.props.fx).toEqual('15%');
            expect(gradient.props.fy).toEqual('100%');
            expect(gradient.props.r).toEqual(77);
            expect(renderer.root.findAllByType('stop').length).toEqual(2);
        });

        it('use cx, cy, fx, fy and r props', () => {
            const renderer = create(<Gradient
                id='radialGrad'
                type='radial'
                gradientTransform='matrix()'
                cx='40%' cy='45%' fx={5} fy={7} r={13}>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>);
            const gradient = renderer.root.findByType('radialGradient');
            expect(gradient.props.cx).toEqual('40%');
            expect(gradient.props.cy).toEqual('45%');
            expect(gradient.props.fx).toEqual(5);
            expect(gradient.props.fy).toEqual(7);
            expect(gradient.props.r).toEqual(13);
            expect(renderer.root.findAllByType('stop').length).toEqual(2);
        });

    });

    it('should support autoincrement id', () => {
        const renderer = create(<svg>
            <Gradient type='linear'>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>
        </svg>);
        expect(renderer.root.findByType('linearGradient').props.id).toEqual('chartGradient1');
    });

});
