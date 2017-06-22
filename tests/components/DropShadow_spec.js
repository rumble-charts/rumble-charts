import {shallow} from 'enzyme';
import DropShadow from '../../src/DropShadow';

describe('DropShadow', () => {

    it('should render svg filter', () => {
        const wrapper = shallow(<DropShadow
            id='shadow'
            dx={10}
            dy={12}
            blurDeviation={7}
            blurIn='SourceAlpha'
        />);
        const filter = wrapper.find('filter');
        expect(filter.prop('id')).toEqual('shadow');
        expect(filter.children('feGaussianBlur').prop('in')).toEqual('SourceAlpha');
        expect(filter.children('feGaussianBlur').prop('stdDeviation')).toEqual(7);
        expect(filter.children('feOffset').prop('dx')).toEqual(10);
        expect(filter.children('feOffset').prop('dy')).toEqual(12);
        const feMerge = filter.children('feMerge');
        expect(feMerge.children('feMergeNode').length).toEqual(2);
        expect(feMerge.children('feMergeNode').at(1).prop('in')).toEqual('SourceGraphic');
    });

});
