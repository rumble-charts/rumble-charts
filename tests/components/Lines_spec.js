'use strict';

const {shallow} = require('enzyme');
const Chart = require('../../lib/Chart');
const Lines = require('../../lib/Lines');

const d3_scale = require('d3-scale');

const _ = require('lodash');
const d3 = require('d3');

describe('Lines', () => {

    const dataSeries1 = [
        {data: [1, 3, 5, 2, 4]},
        {data: [4, 2, 5, 3, 1]},
        {data: [5, 4, 1, 2, 3]}
    ];

    it('should render svg lines', () => {
        const wrapper = shallow(<Chart width={100} height={100}>
            <Lines className='lines' series={dataSeries1}/>
        </Chart>);
        const paths = wrapper.render().find('path');
        expect(paths.length).toEqual(3);
        const path = paths.first();
        // default attributes
        expect(path.prop('d')).toBeDefined();
        expect(path.prop('fill')).toBeDefined();
        expect(path.prop('stroke')).toBeDefined();
        expect(path.prop('stroke-width')).toBeDefined();

        const lines = wrapper.find(Lines);
        expect(lines.prop('layerWidth')).toEqual(100);
        expect(lines.prop('layerHeight')).toEqual(100);
    });

    it('should use className and styles properties', () => {
        const wrapper = shallow(<Chart width={100} height={100}>
            <Lines className='lines' style={{transition: '100ms'}} series={dataSeries1}/>
        </Chart>);
        const lines = wrapper.render().find('g.lines');
        expect(lines.length).toEqual(1);
        expect(lines.prop('style')).toEqual(jasmine.objectContaining({
            transition: '100ms'
        }));
        const series = lines.find('g.lines-series');
        expect(series.length).toEqual(3);
        const series0 = lines.find('g.lines-series.lines-series-0');
        expect(series0.length).toEqual(1);
        const path = series0.find('path');
        expect(path.length).toEqual(1);
    });

    it('should support different types of line interpolation and areas', () => {
        const wrapper = shallow(<Chart width={100} height={100}>
            <Lines className='lines' series={dataSeries1}/>
        </Chart>);
        const lines = wrapper.find(Lines);
        expect(lines.length).toEqual(1);
        // default interpolation
        expect(lines.prop('interpolation')).toEqual('monotone');

        const interpolations = [
            'linear', 'linear-close', 'step', 'step-before', 'step-after',
            'basis', 'basis-open', 'basis-closed', 'bundle',
            'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'
        ];

        const paths = {};
        _.forEach(interpolations, interpolation => {
            const wrapper = shallow(<Chart width={100} height={100}>
                <Lines className='lines' series={dataSeries1} interpolation={interpolation}/>
            </Chart>);
            const path = wrapper.render().find('path').first();
            const d = path.prop('d');
            expect(d.length).toBeGreaterThan(20);
            paths[interpolation] = d;
        });

        expect(paths['monotone']).toEqual('M10,100C10.459770114942529,98.85057471264368,29.080459770114942,52.298850574712645,30,50S45.2059925093633,-2.9962546816479403,50,0S65.2059925093633,72.00374531835206,70,75S89.54022988505747,26.149425287356323,90,25');
        expect(paths['linear']).toEqual('M10,100L30,50L50,0L70,75L90,25');

        const areasWrapper = shallow(<Chart width={100} height={100}>
            <Lines className='lines' series={dataSeries1} asAreas={true} interpolation='linear'/>
        </Chart>);
        paths['-area-linear'] = areasWrapper.render().find('path').first().prop('d');
        expect(paths['-area-linear']).not.toEqual(paths['linear']);
        expect(paths['-area-linear']).toEqual('M10,100L30,50L50,0L70,75L90,25L90,125L70,125L50,125L30,125L10,125Z');
    });

    it('should support series selections by seriesIndex', () => {
        const wrapper = shallow(<Chart width={100} height={100} series={dataSeries1}>
            <Lines className='lines' seriesIndex={[0]}/>
            <Lines className='areas' seriesIndex={[1]}/>
        </Chart>);
        const render = wrapper.render();
        expect(render.find('g.lines-series').length).toEqual(1);
        expect(render.find('g.areas-series').length).toEqual(1);
    });

    describe('should support colors', () => {

        it('can be d3 color schemas', () => {
            const wrapper = shallow(<Chart width={100} height={100}>
                <Lines className='lines' series={dataSeries1}/>
            </Chart>);
            // default color scheme
            expect(wrapper.find(Lines).prop('colors')).toEqual('category20');
            const paths = wrapper.render().find('path');
            const colors = d3.scale.category20().domain(_.range(3));
            expect(paths.first().prop('stroke')).toEqual(colors(0));
            expect(paths.last().prop('stroke')).toEqual(colors(2));
        });

        it('can be array', () => {
            const wrapper = shallow(<Chart width={100} height={100}>
                <Lines className='lines' series={dataSeries1} colors={['red', 'green', 'blue']}/>
            </Chart>);
            const paths = wrapper.render().find('path');
            const colors = d3_scale.scaleOrdinal().range(['red', 'green', 'blue']).domain(_.range(3));
            expect(paths.first().prop('stroke')).toEqual(colors(0));
            expect(paths.last().prop('stroke')).toEqual(colors(2));
        });

        it('can be function', () => {
            const wrapper = shallow(<Chart width={100} height={100}>
                <Lines
                    className='lines' series={dataSeries1}
                    colors={seriesIndex => '#fff00' + seriesIndex}
                />
            </Chart>);
            const paths = wrapper.render().find('path');
            expect(paths.first().prop('stroke')).toEqual('#fff000');
            expect(paths.last().prop('stroke')).toEqual('#fff002');
        });

    });

    describe('should implement properties for visibility, attributes and styles', () => {

        const render = shallow(<Chart width={100} height={100}>
            <Lines
                className='lines' series={dataSeries1}
                seriesVisible={({seriesIndex}) => seriesIndex !== 0}
                seriesAttributes={({series}) => ({
                    transform: 'translateX(' + (series.data[0].y * 10) + 'px)'
                })}
                seriesStyle={{transition: '100ms'}}
                lineVisible={({seriesIndex}) => seriesIndex !== 2}
                lineAttributes={{transform: 'scaleX(5)'}}
                fill='fillForLineStyle'
                lineStyle={({props}) => ({fill: props.fill})}
                lineWidth={10}
            />
        </Chart>).render();

        it('for series', () => {
            const gLines = render.find('g.lines-series');
            // seriesVisible
            expect(gLines.length).toEqual(2);
            // seriesAttributes
            expect(gLines.first().prop('transform')).toEqual('translateX(40px)');
            expect(gLines.last().prop('transform')).toEqual('translateX(50px)');
            // seriesStyle
            expect(gLines.first().prop('style')).toEqual(jasmine.objectContaining({transition: '100ms'}));
        });

        it('for lines', () => {
            const pathLines = render.find('path');
            // lineVisible
            expect(pathLines.length).toEqual(1);
            // lineAttributes
            expect(pathLines.prop('transform')).toEqual('scaleX(5)');
            // lineStyle
            expect(pathLines.prop('style').fill).toEqual('fillForLineStyle');
            // lineWidth
            expect(pathLines.prop('stroke-width')).toEqual('10');
        });

    });

});
