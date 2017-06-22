import getCoords from '../../../src/helpers/getCoords';

const curriedGetCoords = position => getCoords(position, 1000, 1000, 500, 500);

describe('Helper getCoords', () => {

    it('should support keywords', () => {
        expect(curriedGetCoords('left top')).toEqual({x: 0, y: 0});
        expect(curriedGetCoords('left top')).toEqual(curriedGetCoords('TOP left'));
        expect(curriedGetCoords('left bottom')).toEqual({x: 0, y: 500});
        expect(curriedGetCoords('left bottom')).toEqual(curriedGetCoords('bottom LEFT'));
        expect(curriedGetCoords('left middle')).toEqual({x: 0, y: 250});
        expect(curriedGetCoords('left middle')).toEqual(curriedGetCoords('mIdDle lEFt'));

        expect(curriedGetCoords('right top')).toEqual({x: 500, y: 0});
        expect(curriedGetCoords('right top')).toEqual(curriedGetCoords('top RIGHT'));
        expect(curriedGetCoords('right bottom')).toEqual({x: 500, y: 500});
        expect(curriedGetCoords('right bottom')).toEqual(curriedGetCoords('BOTTOM right'));
        expect(curriedGetCoords('right middle')).toEqual({x: 500, y: 250});
        expect(curriedGetCoords('right middle')).toEqual(curriedGetCoords('MiDdLe   RIGht'));

        expect(curriedGetCoords('center top')).toEqual({x: 250, y: 0});
        expect(curriedGetCoords('center top')).toEqual(curriedGetCoords(['top', 'center']));
        expect(curriedGetCoords('center bottom')).toEqual({x: 250, y: 500});
        expect(curriedGetCoords('center bottom')).toEqual(curriedGetCoords('  BOTTOM CENTER '));
        expect(curriedGetCoords('center middle')).toEqual({x: 250, y: 250});
        expect(curriedGetCoords('center middle')).toEqual(curriedGetCoords(['CENTER', 'MIDDLE']));
    });

    it('should support integer numbers', () => {
        expect(curriedGetCoords('300 200')).toEqual({x: 300, y: 200});
        expect(curriedGetCoords([300, 200])).toEqual({x: 300, y: 200});
        expect(curriedGetCoords(['300', '200'])).toEqual({x: 300, y: 200});
        expect(curriedGetCoords([' 300', '200 '])).toEqual({x: 300, y: 200});
    });

    it('should support percents', () => {
        expect(curriedGetCoords('25% 50%')).toEqual({x: 250, y: 500});
        expect(curriedGetCoords(['25%', '50%'])).toEqual({x: 250, y: 500});
    });

    it('should support float numbers as percents', () => {
        expect(curriedGetCoords('0.25 0.56')).toEqual({x: 250, y: 560});
        expect(curriedGetCoords(['0.25', '0.56'])).toEqual({x: 250, y: 560});
        // expect(curriedGetCoords([0.25, 0.56])).toEqual({x: 250, y: 560});
    });

    it('should understand empty value as 0,0', () => {
        expect(curriedGetCoords()).toEqual({x: 0, y: 0});
        expect(curriedGetCoords('')).toEqual({x: 0, y: 0});
        expect(curriedGetCoords([])).toEqual({x: 0, y: 0});
    });

    it('should support empty object', () => {
        expect(getCoords('center middle', 1000, 1000)).toEqual({x: 500, y: 500});
    });

    it('should support combined types', () => {
        expect(curriedGetCoords('45% bottom')).toEqual({x: 450, y: 500});
        expect(curriedGetCoords('45% 0.3')).toEqual({x: 450, y: 300});
        expect(curriedGetCoords('45% 150')).toEqual({x: 450, y: 150});
        expect(curriedGetCoords('300 0.3')).toEqual({x: 300, y: 300});
        expect(curriedGetCoords('300 middle')).toEqual({x: 300, y: 250});
        expect(curriedGetCoords('300 55%')).toEqual({x: 300, y: 550});
        expect(curriedGetCoords('center 55%')).toEqual({x: 250, y: 550});
        expect(curriedGetCoords('center 0.25')).toEqual({x: 250, y: 250});
        expect(curriedGetCoords('center 100')).toEqual({x: 250, y: 100});
    });

});
