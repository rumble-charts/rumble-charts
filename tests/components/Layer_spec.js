import {mount, shallow} from 'enzyme';
import Chart from '../../src/Chart';
import Layer from '../../src/Layer';
import generateRandomSeries from '../helpers/generateRandomSeries';

const series = generateRandomSeries(3, 5, {type: 'object'});

const chartWidth = 1000;
const chartHeight = 1000;

const Graphics = () => <span />;
Graphics.displayName = 'Graphics';

describe('Layer', () => {

    it('should render g element', () => {
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Layer className='layer'>
                <Graphics />
            </Layer>
        </Chart>);

        const layer = wrapper.find('g.layer');
        expect(layer.type()).toEqual('g');
        expect(layer.length).toEqual(1);
    });

    it('should support className and style', () => {
        const wrapper = shallow(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Layer className='layer' style={{visibility: 'hidden'}}>
                <Graphics />
            </Layer>
        </Chart>);

        const layer = wrapper.find('Layer');
        expect(layer.prop('className')).toEqual('layer');
        expect(layer.prop('style')).toEqual({visibility: 'hidden'});
    });

    it('should change layerWidth and layerHeight for all children elements', () => {
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Layer width='50%' height='50%'>
                <Graphics />
            </Layer>
        </Chart>);

        const layer = wrapper.find('Layer');
        const graphics = wrapper.find('Graphics');
        expect(graphics.prop('layerWidth') * 2).toEqual(layer.prop('layerWidth'));
        expect(graphics.prop('layerHeight') * 2).toEqual(layer.prop('layerHeight'));
    });

    it('should change position of children', () => {
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Layer width='50%' height='50%' position='center middle' className='layer'>
                <Graphics />
            </Layer>
        </Chart>);

        const layer = wrapper.find('g.layer');
        expect(layer.prop('transform')).toEqual(`translate(${chartWidth * 0.25} ${chartHeight * 0.25})`);
    });

});
