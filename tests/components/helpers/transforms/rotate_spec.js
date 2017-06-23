import rotate from '../../../../src/helpers/transforms/rotate';

describe('Transform rotate', () => {

    it('should swap x and y scales', () => {
        const {scaleX, scaleY} = rotate({
            scaleX: {
                paddingLeft: 5,
                paddingRight: 6
            },
            scaleY: {
                paddingTop: 7,
                paddingBottom: 8
            }
        });
        expect(scaleX.swap).toEqual(true);
        expect(scaleX.paddingLeft).toEqual(7);
        expect(scaleX.paddingRight).toEqual(8);
        expect(scaleY.swap).toEqual(true);
        expect(scaleY.paddingTop).toEqual(5);
        expect(scaleY.paddingBottom).toEqual(6);
        expect(scaleY.direction).toEqual(-1);
    });

});
