import {PropTypes} from 'prop-types';
import {mount} from 'enzyme';
import _ from 'lodash';
import Chart from '../../src/Chart';
import Transform from '../../src/Transform';
import transformProps from '../../src/helpers/transform';
import generateRandomSeries from '../helpers/generateRandomSeries';

const series = generateRandomSeries(3, 5, {type: 'object'});

const chartWidth = 1000;
const chartHeight = 1000;

const Container = ({children}) => <g>{children}</g>;
Container.propTypes = {
    children: PropTypes.node
};
Container.displayName = 'Container';

const Graphics = () => <span />;
Graphics.displayName = 'Graphics';

describe('Transform', () => {

    it('should render g element with className', () => {
        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Transform className='transform'>
                <Graphics />
            </Transform>
        </Chart>);

        const transform = wrapper.find('g.transform');
        expect(transform.type()).toEqual('g');
        expect(transform.length).toEqual(1);
    });

    it('should make series data transformation', () => {
        const transformations = [
            'stackNormalized',
            (props) => _.assign({}, props, {maxY: 20})
        ];

        const wrapper = mount(<Chart
            width={chartWidth} height={chartHeight}
            series={series}>
            <Transform width='50%' height='50%' method={transformations}>
                <Graphics />
            </Transform>
        </Chart>);

        const graphics = wrapper.find('Graphics');
        const resultedSeries = graphics.prop('series');
        expect(resultedSeries).not.toEqual(series);
        expect(resultedSeries).toEqual(transformProps({series}, transformations).series);
        expect(graphics.prop('maxY')).toEqual(20);
    });

    it('should work with a tag between', () => {
        const wrapper = mount(<Chart width={chartWidth} height={chartHeight}>
            <Container>
                <Transform width='50%' height='50%' method={[({series}) => ({series})]} series={series}>
                    <Graphics />
                </Transform>
            </Container>
        </Chart>);

        const graphics = wrapper.find('Graphics');
        const resultedSeries = graphics.prop('series');
        expect(resultedSeries).toEqual(series);
    });

});
