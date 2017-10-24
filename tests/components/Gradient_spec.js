import {shallow, mount} from 'enzyme';
import Gradient from '../../src/Gradient';

describe('Gradient', () => {

    describe('should render linear gradient', () => {

        it('use from and to props', () => {
            const wrapper = shallow(<Gradient
                id='linearGrad'
                type='linear'
                gradientTransform='matrix()'
                from={['0%', '5%']} to={['15%', '100%']}>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>);
            const gradient = wrapper.find('linearGradient');
            expect(gradient.prop('id')).toEqual('linearGrad');
            expect(gradient.prop('gradientUnits')).toEqual('objectBoundingBox');
            expect(gradient.prop('gradientTransform')).toEqual('matrix()');
            expect(gradient.prop('spreadMethod')).toEqual('pad');
            expect(gradient.prop('x1')).toEqual('0%');
            expect(gradient.prop('y1')).toEqual('5%');
            expect(gradient.prop('x2')).toEqual('15%');
            expect(gradient.prop('y2')).toEqual('100%');
            expect(wrapper.find('stop').length).toEqual(2);
        });

        it('use x1, y1, x2 and y2 props', () => {
            const wrapper = shallow(<Gradient
                id='linearGrad'
                type='linear'
                x1='0%' y1='5%' x2={100} y2={150}>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>);
            const gradient = wrapper.find('linearGradient');
            expect(gradient.prop('x1')).toEqual('0%');
            expect(gradient.prop('y1')).toEqual('5%');
            expect(gradient.prop('x2')).toEqual(100);
            expect(gradient.prop('y2')).toEqual(150);
        });

    });

    describe('should render radial gradient', () => {

        it('use center, focalPoint and radius props', () => {
            const wrapper = shallow(<Gradient
                id='radialGrad'
                type='radial'
                gradientTransform='matrix()'
                radius={77}
                center={['40%', '45%']} focalPoint={['15%', '100%']}>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>);
            const gradient = wrapper.find('radialGradient');
            expect(gradient.prop('id')).toEqual('radialGrad');
            expect(gradient.prop('gradientUnits')).toEqual('objectBoundingBox');
            expect(gradient.prop('gradientTransform')).toEqual('matrix()');
            expect(gradient.prop('spreadMethod')).toEqual('pad');
            expect(gradient.prop('cx')).toEqual('40%');
            expect(gradient.prop('cy')).toEqual('45%');
            expect(gradient.prop('fx')).toEqual('15%');
            expect(gradient.prop('fy')).toEqual('100%');
            expect(gradient.prop('r')).toEqual(77);
            expect(wrapper.find('stop').length).toEqual(2);
        });

        it('use cx, cy, fx, fy and r props', () => {
            const wrapper = shallow(<Gradient
                id='radialGrad'
                type='radial'
                gradientTransform='matrix()'
                cx='40%' cy='45%' fx={5} fy={7} r={13}>
                <stop offset='60%' stopColor='black' />
                <stop offset='100%' stopColor='white' />
            </Gradient>);
            const gradient = wrapper.find('radialGradient');
            expect(gradient.prop('cx')).toEqual('40%');
            expect(gradient.prop('cy')).toEqual('45%');
            expect(gradient.prop('fx')).toEqual(5);
            expect(gradient.prop('fy')).toEqual(7);
            expect(gradient.prop('r')).toEqual(13);
            expect(wrapper.find('stop').length).toEqual(2);
        });

    });

    it('should support autoincrement id', () => {
        const wrapper = mount(<Gradient type='linear'>
            <stop offset='60%' stopColor='black' />
            <stop offset='100%' stopColor='white' />
        </Gradient>);
        expect(wrapper.find('linearGradient').prop('id')).toEqual('chartGradient1');
        expect(wrapper.find(Gradient).instance().getLink()).toEqual('url(#chartGradient1)');
    });

});
