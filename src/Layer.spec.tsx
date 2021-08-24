import React from 'react';
import {create} from 'react-test-renderer';

import {Chart} from './Chart';
import {Layer} from './Layer';
import {generateRandomSeries} from './helpers';
import {testSelector} from './specs';

const series = generateRandomSeries(3, 5, {type: 'object'});

const chartWidth = 1000;
const chartHeight = 1000;

const Graphics = (props: any) => <span {...props} />;

describe('Layer', () => {

    it('should render g element', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Layer className='layer'>
                <Graphics />
            </Layer>
        </Chart>);

        const layer = renderer.root.findAll(testSelector('g.layer'));
        expect(layer.length).toEqual(1);
        expect(layer[0].type).toEqual('g');
    });

    it('should support className and style', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Layer className='layer' style={{visibility: 'hidden'}}>
                <Graphics />
            </Layer>
        </Chart>);

        const layer = renderer.root.findByType(Layer);
        expect(layer.props.className).toEqual('layer');
        expect(layer.props.style).toEqual({visibility: 'hidden'});
    });

    it('should change layerWidth and layerHeight for all children elements', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Layer width='50%' height='50%'>
                <Graphics />
            </Layer>
        </Chart>);

        const layer = renderer.root.findByType(Layer);
        const graphics = renderer.root.findByType(Graphics);
        expect(graphics.props.layerWidth * 2).toEqual(layer.props.layerWidth);
        expect(graphics.props.layerHeight * 2).toEqual(layer.props.layerHeight);
    });

    it('should change position of children', () => {
        const renderer = create(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Layer width='50%' height='50%' position='center middle' className='layer'>
                <Graphics />
            </Layer>
        </Chart>);

        const layer = renderer.root.find(testSelector('g.layer'));
        expect(layer.props.transform).toEqual(`translate(${chartWidth * 0.25} ${chartHeight * 0.25})`);
    });

});
