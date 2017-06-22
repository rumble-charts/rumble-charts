import propTypes from '../../../src/helpers/propTypes';

describe('Helper propTypes', () => {

    it('should describe series propTypes', () => {
        expect(propTypes.series).toEqual(jasmine.any(Function));
    });

});
