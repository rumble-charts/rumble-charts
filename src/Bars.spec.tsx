import React from 'react';
import {create, ReactTestInstance} from 'react-test-renderer';

import {generateRandomSeries} from './helpers';
import {graphicsComponent, testSelector} from './specs';

import {Chart} from './Chart';
import {Bars} from './Bars';
import {Transform} from './Transform';

const seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});

describe('Bars', () => {

    graphicsComponent(Bars, {
        pointGroupClassName: 'bar',
        pointStyling: true,
        defaultProps: {
            groupPadding: 0,
            innerPadding: 0,
            colors: 'category20',
            seriesVisible: true,
            barVisible: true
        },
        visibleProperties: {
            seriesVisible: ['g', 'series'],
            barVisible: ['path']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series'],
            barAttributes: ['path']
        },
        styleProperties: {
            seriesStyle: ['g', 'series'],
            barStyle: ['path'],
            groupStyle: ['g', 'bar']
        }

    });

    const selector = (instance: ReactTestInstance) => {
        return instance.type === 'g' && instance.props?.className?.includes('bars-bar');
    };

    it('should set bars width', () => {
        const renderer = create(<Chart width={100} height={100} series={seriesObjects3x5}>
            <Bars className='bars' barWidth={72} />
        </Chart>);
        const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
        const d = child.props.d;
        expect(d).toContain(' h72 ');
        expect(d).toContain('M-36,0 ');
    });

    it('should have combined mode', () => {
        const renderer = create(<Chart width={100} height={100} series={seriesObjects3x5}>
            <Bars className='bars' combined={true} />
        </Chart>);
        const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
        const d = child.props.d;
        expect(d).toContain(' h20 '); // 100 (chart width) / 5 (number of points)
    });

    describe('should support inner padding', () => {
        it('can be a number', () => {
            const renderer = create(<Chart width={150} height={100} series={seriesObjects3x5}>
                <Bars className='bars' innerPadding={2} />
            </Chart>);
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h8 '); // 150 (chart width) / 15 (number of points) - 2 (inner padding)
        });

        it('can be percents as a string', () => {
            const renderer = create(<Chart width={150} height={100} series={seriesObjects3x5}>
                <Bars className='bars' innerPadding='1%' />
            </Chart>);
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h8.5 '); // 150 (chart width) / 15 (number of points) - 1.5 (inner padding, 1%)
        });

        it('can be percents as a number', () => {
            const consoleWrap = jest.spyOn(console, 'warn').mockReturnValue();
            const renderer = create(<Chart width={150} height={100} series={seriesObjects3x5}>
                <Bars className='bars' innerPadding='2%' />
            </Chart>);
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h7 '); // 150 (chart width) / 15 (number of points) - 3 (inner padding, 1%)
            consoleWrap.mockRestore();
        });
    });

    it('should set inner padding and bar width', () => {
        const renderer = create(<Chart width={150} height={100} series={seriesObjects3x5}>
            <Bars className='bars' innerPadding={10} combined={true} />
        </Chart>);
        const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
        const d = child.props.d;
        expect(d).toContain(' h20 '); // 150 (chart width) / 5 (number of points) - 10 (inner padding)
    });

    describe('should support group padding', () => {
        it('can be a number', () => {
            const renderer = create(<Chart width={150} height={100} series={seriesObjects3x5}>
                <Bars className='bars' groupPadding={6} />
            </Chart>);
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h8 '); // (150 (chart width) - 6 (group padding) * 5 (groups)) / 15 (number of points)
        });

        it('can be percents as a string', () => {
            const renderer = create(<Chart width={150} height={100} series={seriesObjects3x5}>
                <Bars className='bars' groupPadding='2%' />
            </Chart>);
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h9 '); // (150 (chart width) - 3 (group padding) * 5 (groups)) / 15 (number of points)
        });

        it('can be percents as a number', () => {
            const consoleWrap = jest.spyOn(console, 'warn').mockReturnValue();
            const renderer = create(<Chart width={100} height={100} series={seriesObjects3x5}>
                <Bars className='bars' groupPadding='2%' />
            </Chart>);
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h6 '); // (100 (chart width) - 2 (group padding) * 5 (groups)) / 15 (number of points)
            consoleWrap.mockRestore();
        });
    });

    it('should support group padding and inner padding together', () => {
        const renderer = create(<Chart width={250} height={100} series={seriesObjects3x5}>
            <Bars className='bars' groupPadding={5} innerPadding={2} />
        </Chart>);
        const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
        const d = child.props.d;
        expect(d).toContain(' h13 '); // (250 (chart width) - 5 (group padding) * 5 (groups)) / 15 (number of points) - 2 (inner padding)
    });

    it('should ignore group padding in case of combined enabled', () => {
        const renderer = create(<Chart width={250} height={100} series={seriesObjects3x5}>
            <Bars className='bars' groupPadding={5} combined={true} />
        </Chart>);
        const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
        const d = child.props.d;
        expect(d).toContain(' h50 '); // (250 (chart width) / 5 (number of points)
    });

    it('should support group padding and combined props together', () => {
        const renderer = create(<Chart width={250} height={100} series={seriesObjects3x5}>
            <Bars className='bars' innerPadding={5} combined={true} />
        </Chart>);
        const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
        const d = child.props.d;
        expect(d).toContain(' h45 '); // (250 (chart width) / 5 (number of points) - 5 (inner padding)
    });

    it('should be sensitive for paddings on x scale', () => {
        const renderer = create(<Chart
            width={150} height={100} series={seriesObjects3x5}
            scaleX={{paddingStart: -0.5, paddingEnd: -0.5}}>
            <Bars className='bars' combined={true} />
        </Chart>);
        const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
        const d = child.props.d;
        expect(d).toContain(' h50 ');
    });

    describe('should correct paddings on x scale', () => {

        it('in case of natural direction of the scale', () => {
            const renderer = create(<Chart
                width={250} height={100} series={seriesObjects3x5}
                scaleX={{paddingStart: 0, paddingEnd: 0}}>
                <Bars className='bars' innerPadding={5} combined={true} />
            </Chart>);
            // it corrects paddingStart=0 and paddingEnd=0 to paddingStart=0.5 and paddingEnd=0.5
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h45 ');
        });

        it('in case of reversed direction of the scale', () => {
            const renderer = create(<Chart
                width={250} height={100} series={seriesObjects3x5}
                scaleX={{paddingStart: 0, paddingEnd: 0, direction: -1}}>
                <Bars className='bars' innerPadding={5} combined={true} />
            </Chart>);
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h45 ');
        });

    });

    it('should support rotate transformation', () => {
        const renderer = create(<Chart
            width={250} height={250} series={seriesObjects3x5}>
            <Transform method='rotate'>
                <Bars className='bars' innerPadding={5} combined={true} />
            </Transform>
        </Chart>);
        const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
        const d = child.props.d;
        expect(d).toContain(' v45 ');
    });

    it('should support stacked bars', () => {
        const height = 250;
        const renderer = create(<Chart
            width={150} height={height} series={seriesObjects3x5}>
            <Transform method='stack'>
                <Bars className='bars' combined={true} />
            </Transform>
        </Chart>);
        let remain = height;
        seriesObjects3x5.forEach((series, seriesIndex) => {
            const g = renderer.root
                .findAll(testSelector('g.bars-series'))[seriesIndex]
                .findAll(testSelector('g.bars-bar'))[0];

            const {d} = g.findByType('path').props;
            const barHeight = Number(d.split(',0 v')[1].split(' h30 ')[0]);
            const barY = Number(g.props.transform.split('(15 ')[1].split(')')[0]);
            remain -= barHeight;
            expect(Math.abs(remain - barY)).toBeLessThan(2);
        });
    });

    describe('should handle some wrong input data', () => {

        it('undefined x scale direction', () => {
            const renderer = create(<Chart
                width={250} height={100} series={seriesObjects3x5}
                scaleX={{direction: null}}>
                <Bars className='bars' innerPadding={5} combined={true} />
            </Chart>);
            const child = renderer.root.findAll(selector)[3].children[0] as ReactTestInstance;
            const d = child.props.d;
            expect(d).toContain(' h45 ');
        });

        it('undefined series', () => {
            const renderer = create(<Chart width={100} height={100}>
                <Bars className='bars' />
            </Chart>);
            expect(renderer.root.findAll(instance => {
                return instance.type === 'g' && instance.props?.className === 'bars';
            }).length).toEqual(1);
        });

    });

});
