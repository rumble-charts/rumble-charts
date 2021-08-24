import {ReactTestInstance} from 'react-test-renderer';

import React from 'react';
import {create} from 'react-test-renderer';

import {Chart} from './Chart';
import {Ticks} from './Ticks';
import {Transform} from './Transform';
import {generateRandomSeries} from './helpers';
import {testSelector} from './specs';

function checkVASProperties(propertyName, tag, {chartWidth, chartHeight, series, className = 'ticks'}) {
    const selector = `${tag}.${className}-${propertyName}`;

    describe(`"visible", "attributes" and "style" properties for ${propertyName}s`, () => {

        it(`${propertyName}Visible could be a boolean`, () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Visible`]: false}}
                />
            </Chart>);
            expect(renderer.root.findAll(testSelector(selector)).length).toEqual(0);
        });

        it(`${propertyName}Visible could be a function`, () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Visible`]: ({index}) => index <= 1}}
                />
            </Chart>);
            expect(renderer.root.findAll(testSelector(selector)).length).toEqual(2);
        });

        it(`${propertyName}Attributes could be an object`, () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Attributes`]: {fill: 'red'}}}
                />
            </Chart>);
            expect(renderer.root.findAll(testSelector(selector))[0].props.fill).toEqual('red');
        });


        it(`${propertyName}Attributes could be a function`, () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Attributes`]: ({index}) => ({fill: index})}}
                />
            </Chart>);
            expect(renderer.root.findAll(testSelector(selector))[2].props.fill).toEqual(2);
        });


        it(`${propertyName}Style could be an object`, () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Style`]: {fill: 'red'}}}
                />
            </Chart>);
            expect(renderer.root.findAll(testSelector(selector))[0].props.style).toEqual({fill: 'red'});
        });


        it(`${propertyName}Style could be a function`, () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks
                    className={className}
                    {...{[`${propertyName}Style`]: ({index}) => ({fill: index})}}
                />
            </Chart>);
            expect(renderer.root.findAll(testSelector(selector))[2].props['style']).toEqual({fill: 2});
        });

    });
}

describe('Ticks', () => {

    const chartWidth = 500;
    const chartHeight = 500;
    const series = generateRandomSeries(3, 10, {type: 'object'});

    describe('should support className property', () => {

        it('should render proper class names', () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks className='ticks' />
            </Chart>);
            const root = renderer.root.findAll(testSelector('g.ticks'));
            expect(root.length).toEqual(1);
            const ticks = root[0].findAll(testSelector('g.ticks-tick'));
            expect(ticks.length).toEqual(5);
            const labels = root[0].findAll(testSelector('text.ticks-label'));
            expect(labels.length).toEqual(5);
            const lines = root[0].findAll(testSelector('path.ticks-line'));
            expect(lines.length).toEqual(5);

            expect(ticks[0].findAll(testSelector('text.ticks-label')).length).toEqual(1);
            expect(ticks[0].findAll(testSelector('path.ticks-line')).length).toEqual(1);
        });

        it('should have no default value', () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight}><Ticks /></Chart>);
            expect(renderer.root.findByType(Ticks).props['className']).toBeUndefined();
        });

    });

    describe('should support style property', () => {

        it('should render style in the root element', () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight}>
                <Ticks className='chart' style={{transition: '100ms'}} />
            </Chart>);
            const root = renderer.root.findAll(testSelector('g.chart'));
            expect(root[0].props['style'].transition).toEqual('100ms');
        });

        it('should have no default value', () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight}><Ticks /></Chart>);
            expect(renderer.root.findByType(Ticks).props['style']).toBeUndefined();
        });

    });

    describe('should support opacity property', () => {

        it('should apply opacity attribute to the root element', () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
                <Ticks className='ticks' opacity={0.9} />
            </Chart>);
            const root = renderer.root.findAll(testSelector('g.ticks'));
            expect(root[0].props['opacity']).toEqual(0.9);
        });

        it('should have no default value', () => {
            const renderer = create(<Chart width={chartWidth} height={chartHeight}><Ticks /></Chart>);
            expect(renderer.root.findByType(Ticks).props['opacity']).toBeUndefined();
        });

    });

    it('should have no children', () => {
        const html1 = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Ticks />
        </Chart>).toJSON();
        const html2 = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Ticks>
                <g>
                    <text>Hello</text>
                </g>
            </Ticks>
        </Chart>).toJSON();
        expect(html1).toEqual(html2);
    });

    it('should render ticks with lines and labels', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series}>
            <Ticks className='ticks' axis='y' />
        </Chart>);
        const tick = renderer.root.findAll(testSelector('g.ticks-tick'))[0];
        expect(tick.children.length).toEqual(2);
        expect(tick.props['transform'].substr(0, 10)).toEqual('translate(');
        expect((tick.children[0] as ReactTestInstance).type).toEqual('text');
        expect((tick.children[1] as ReactTestInstance).type).toEqual('path');
    });

    describe('ticks property', () => {
        it('could be a number', () => {
            const ticks = 10;
            const series = [{
                data: [1, 2, 4]
            }];
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks className='ticks' ticks={ticks} axis='y' />
            </Chart>);
            expect(renderer.root.findAll(testSelector('g.ticks-tick')).length).toEqual(ticks);
        });

        describe('could be a list of settings', () => {
            it('should support max ticks value', () => {
                const maxY = 100;
                const minY = 0;
                const ticks = {
                    maxTicks: 5
                };
                const renderer = create(<Chart
                    width={chartWidth} height={chartHeight}
                    series={series}
                    maxY={maxY} minY={minY}>
                    <Ticks className='ticks' ticks={ticks} axis='y' maxY={maxY} minY={minY} />
                </Chart>);
                expect(renderer.root.findAll(testSelector('g.ticks-tick')).length).toEqual(ticks.maxTicks + 1);
            });

            it('should support distance value', () => {
                const maxY = 100;
                const ticks = {
                    distance: 25
                };
                const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={maxY}>
                    <Ticks className='ticks' ticks={ticks} axis='y' maxY={maxY} />
                </Chart>);
                expect(renderer.root.findAll(testSelector('g.ticks-tick')).length).toEqual(maxY / ticks.distance);
            });

            it('should support min distance value', () => {
                const maxY = 100;
                const minY = 0;
                const ticks = {
                    maxTicks: 20,
                    minDistance: 10
                };
                const renderer = create(<Chart
                    width={chartWidth} height={chartHeight} series={series}
                    maxY={maxY} minY={minY}>
                    <Ticks className='ticks' ticks={ticks} axis='y' />
                </Chart>);
                expect(renderer.root.findAll(testSelector('g.ticks-tick')).length).toEqual(maxY / ticks.minDistance + 1);
            });
        });

        it('could be an array of actual ticks', () => {
            const ticks = [9.5, 15, 28, {
                label: 'seventy eight',
                y: 78
            }];
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks className='ticks' ticks={ticks} axis='y' />
            </Chart>);
            const list = renderer.root.findAll(testSelector('g.ticks-tick'));
            expect(list.length).toEqual(ticks.length);
            expect(list[0].findAll(testSelector('text'))[0].children[0]).toEqual('9.5');
            expect(list[list.length - 1].findAll(testSelector('text'))[0].children[0]).toEqual('seventy eight');
        });

        it('could be a function', () => {
            const ticks = ({maxY}) => ([maxY, 15, 28, {
                label: 'seventy eight',
                y: 78
            }]);
            const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
                <Ticks className='ticks' ticks={ticks} axis='y' />
            </Chart>);
            const list = renderer.root.findAll(testSelector('g.ticks-tick'));
            expect(list.length).toEqual(4);
            expect(list[0].findAll(testSelector('text'))[0].children[0]).toEqual('100');
            expect(list[list.length - 1].findAll(testSelector('text'))[0].children[0]).toEqual('seventy eight');
        });
    });

    checkVASProperties('tick', 'g', {chartWidth, chartHeight, series, className: 'ticks1'});
    checkVASProperties('label', 'text', {chartWidth, chartHeight, series, className: 'ticks2'});
    checkVASProperties('line', 'path', {chartWidth, chartHeight, series, className: 'ticks3'});

    it('should support label property as string', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                label='static label'
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('text.ticks-label'))[0].children[0]).toEqual('static label');
    });

    it('should support label property as node', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                label={<text className='label'>static node label</text>}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('text.label'))[0].children[0]).toEqual('static node label');
    });

    it('should support label property as function returns string', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                label={({index}) => `label-${index}`}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('text.ticks-label'))[2].children[0]).toEqual('label-2');
    });

    it('should support label property as function returns node', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                label={({index}) => <text className={`label-${index}`}>
                    node-label-{index}
                </text>}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('text.label-2'))[0].children.join('')).toEqual('node-label-2');
    });

    it('should support labelFormat property as function to format a label', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                labelFormat={label => `(${label})`}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('text.ticks-label'))[2].children[0]).toMatch(/\(.*\)/);
    });

    it('should support swap mode', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Transform method='rotate'>
                <Ticks className='ticks' />
            </Transform>
        </Chart>);
        const root = renderer.root.findAll(testSelector('g.ticks'));
        expect(root.length).toEqual(1);
        const ticks = root[0].findAll(testSelector('g.ticks-tick'));
        expect(ticks.length).toEqual(5);
        const labels = root[0].findAll(testSelector('text.ticks-label'));
        expect(labels.length).toEqual(5);
        const lines = root[0].findAll(testSelector('path.ticks-line'));
        expect(lines.length).toEqual(5);
    });


    it('should support lineLength property as number', () => {
        const lineLength = 10;
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineLength={lineLength}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('path.ticks-line'))[0].props['d']).toEqual(`M0,0 v${lineLength}`);
    });

    it('should support lineLength property as percentage', () => {
        const lineLength = '50%';
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineLength={lineLength}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('path.ticks-line'))[0].props['d']).toEqual(`M0,0 v${chartHeight * 0.5}`);
    });

    it('should support lineLength property as function', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineLength={({index}) => index * 10 + 5}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('path.ticks-line'))[2].props['d']).toEqual('M0,0 v25');
    });

    it('should support lineOffset property as number', () => {
        const lineOffset = 10;
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineOffset={lineOffset}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('path.ticks-line'))[0].props['d']).toEqual(`M0,${lineOffset} v5`);
    });

    it('should support lineOffset property as percentage', () => {
        const lineOffset = '50%';
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineOffset={lineOffset}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('path.ticks-line'))[0].props['d']).toEqual(`M0,${chartHeight * 0.5} v5`);
    });

    it('should support lineOffset property as function', () => {
        const renderer = create(<Chart width={chartWidth} height={chartHeight} series={series} maxY={100}>
            <Ticks
                className='ticks'
                lineOffset={({index}) => index * 10 + 5}
            />
        </Chart>);
        expect(renderer.root.findAll(testSelector('path.ticks-line'))[2].props['d']).toEqual('M0,25 v5');
    });


    // TODO: test props:
    // - axis x, y
    // - position (9-point)

});
