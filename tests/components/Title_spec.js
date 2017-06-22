import {shallow} from 'enzyme';
import Title from '../../src/Title';

describe('Title', () => {

    it('should render a text inside g', () => {
        const wrapper = shallow(<Title layerWidth={100} layerHeight={100}>Title</Title>);
        const g = wrapper.find('g');
        expect(g.length).toEqual(1);
        const text = g.find('text');
        expect(text.length).toEqual(1);
        expect(text.text()).toEqual('Title');
    });

    it('should render everything else as children', () => {
        const wrapper = shallow(<Title layerWidth={100} layerHeight={100}>
            <circle r={50}/>
        </Title>);
        const g = wrapper.find('g');
        expect(g.length).toEqual(1);
        const circle = g.find('circle');
        expect(circle.length).toEqual(1);
        expect(circle.prop('r')).toEqual(50);
    });

    it('should understand child as a function with props as an argument', () => {
        const wrapper = shallow(<Title
            layerWidth={100} layerHeight={20} position='top center'
            series={[{data: [123]}]}>
            {({layerWidth, layerHeight, position, series}) => <g>
                <text>{layerWidth}</text>
                <text>{layerHeight}</text>
                <text>{position}</text>
                <text>{series[0].data[0]}</text>
            </g>}
        </Title>);
        const captions = wrapper.find('text');
        expect(captions.length).toEqual(4);
        expect(captions.at(0).text()).toEqual('100');
        expect(captions.at(1).text()).toEqual('20');
        expect(captions.at(2).text()).toEqual('top center');
        expect(captions.at(3).text()).toEqual('123');
    });

    it('should be able to positioned', () => {
        const wrapper = shallow(<Title layerWidth={100} layerHeight={100} position='top center'>
            Title
        </Title>);
        expect(wrapper.find('g').prop('transform')).toEqual('translate(50 0)');
    });

    it('should support className and styles', () => {
        const wrapper = shallow(<Title
            layerWidth={100} layerHeight={100}
            position='bottom center'
            className='className className-2'
            style={{transition: '100ms'}}
        >Title</Title>);
        const g = wrapper.find('g');
        expect(g.prop('style')).toEqual(jasmine.objectContaining({
            transition: '100ms'
        }));
        expect(g.hasClass('className')).toEqual(true);
        expect(g.hasClass('className-2')).toEqual(true);
    });

    it('should not render empty tag', () => {
        const consoleError = console.error;
        console.error = jest.fn();
        shallow(<Title layerWidth={100} layerHeight={100}/>);
        expect(console.error).toBeCalled();
        expect(console.error.mock.calls[0][0]).toContain('children');
        console.error = consoleError;
    });

});
