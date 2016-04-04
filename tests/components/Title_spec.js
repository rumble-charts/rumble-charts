'use strict';

const {shallow, render} = require('enzyme');
const Title = require('../../src/Title');

describe('<Title />', () => {

    it('should be a component', () => {
        const wrapper = shallow(<Title>Title</Title>);
        expect(wrapper.find('g').length).toEqual(1);
        expect(wrapper.find('text').length).toEqual(1);
    });

});
