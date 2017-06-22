import {mount} from 'enzyme';
import proxyChildren from '../../../src/helpers/proxyChildren';
import generateRandomSeries from '../../helpers/generateRandomSeries';

const seriesObject = generateRandomSeries(3, 5, {type: 'object'});

const parentProps = {
    series: seriesObject,
    scaleX: {},
    scaleY: {}
};

const extraProps = {
    layerWidth: 100,
    layerHeight: 100,
    scaleX: parentProps.scaleX,
    scaleY: parentProps.scaleY
};

const Graphics = () => <g />;
Graphics.displayName = 'Graphics';

describe('Helper proxyChildren', () => {

    it('should apply special props from the parent to children', () => {
        const wrapper = mount(<g>
            {proxyChildren(<Graphics classname='chart'/>, parentProps, extraProps)}
        </g>);
        const {series, minX, minY, maxX, maxY} = wrapper.find(Graphics).props();
        expect(series.length).toEqual(3);
        expect(minX).toEqual(0);
        expect(maxX).toEqual(4);
        expect(minY).not.toBeLessThan(0);
        expect(maxY).not.toBeGreaterThan(100);
    });

    it('should support seriesIndex as a number', () => {
        const wrapper = mount(<g>
            {proxyChildren(<Graphics classname='chart' seriesIndex={1}/>, parentProps, extraProps)}
        </g>);
        const series = wrapper.find(Graphics).prop('series');
        expect(series.length).toEqual(1);
    });

    it('should support seriesIndex as an array', () => {
        const wrapper = mount(<g>
            {proxyChildren(<Graphics classname='chart' seriesIndex={[1, 2]}/>, parentProps, extraProps)}
        </g>);
        const series = wrapper.find(Graphics).prop('series');
        expect(series.length).toEqual(2);
    });

    it('should support seriesIndex as a function', () => {
        const wrapper = mount(<g>
            {proxyChildren(
                <Graphics
                    classname='chart'
                    seriesIndex={(series, index) => index < 2}
                />,
                parentProps, extraProps)}
        </g>);
        const series = wrapper.find(Graphics).prop('series');
        expect(series.length).toEqual(2);
    });

    it('should handle broken seriesIndex', () => {
        const wrapper = mount(<g>
            {proxyChildren(<Graphics classname='chart' seriesIndex={null}/>, parentProps, extraProps)}
        </g>);
        const series = wrapper.find(Graphics).prop('series');
        expect(series.length).toEqual(3);
    });

    it('should not override series prop for children', () => {
        const wrapper = mount(<g>
            {proxyChildren(
                <Graphics series={seriesObject} classname='chart'/>,
                parentProps, extraProps)}
        </g>);
        const {series} = wrapper.find(Graphics).props();
        expect(series.length).toEqual(3);
    });

    it('should handle empty arguments', () => {
        const wrapper = mount(<g>
            {proxyChildren([null])}
        </g>);
        expect(wrapper.html()).toEqual('<g></g>');
    });

    it('should support extraProps (3rd argument) as a function', () => {
        const wrapper = mount(<g>
            {proxyChildren(<Graphics classname='chart'/>, parentProps, () => extraProps)}
        </g>);
        const graphics = wrapper.find(Graphics);
        expect(graphics.prop('layerWidth')).toEqual(100);
    });

});
