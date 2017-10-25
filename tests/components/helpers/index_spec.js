import index, {
    colorFunc, curves, eases, getCoords, normalizeNumber, normalizeSeries,
    propTypes, proxyChildren, transform, value, transforms
} from '../../../src/helpers';

describe('Helpers index file', () => {

    it('should export all the components in default object', () => {
        expect(index.colorFunc).toBeDefined();
        expect(index.curves).toBeDefined();
        expect(index.eases).toBeDefined();
        expect(index.getCoords).toBeDefined();
        expect(index.normalizeSeries).toBeDefined();
        expect(index.normalizeNumber).toBeDefined();
        expect(index.propTypes).toBeDefined();
        expect(index.proxyChildren).toBeDefined();
        expect(index.transform).toBeDefined();
        expect(index.value).toBeDefined();

        expect(index.transforms).toBeDefined();
        expect(index.transforms.reverse).toBeDefined();
        expect(index.transforms.rotate).toBeDefined();
        expect(index.transforms.sort).toBeDefined();
        expect(index.transforms.stack).toBeDefined();
        expect(index.transforms.stackNormalized).toBeDefined();
        expect(index.transforms.transpose).toBeDefined();
        expect(index.transforms.unstack).toBeDefined();
    });

    it('should export the same components in two different approaches', () => {
        expect(index.colorFunc).toEqual(colorFunc);
        expect(index.curves).toEqual(curves);
        expect(index.eases).toEqual(eases);
        expect(index.getCoords).toEqual(getCoords);
        expect(index.normalizeSeries).toEqual(normalizeSeries);
        expect(index.normalizeNumber).toEqual(normalizeNumber);
        expect(index.propTypes).toEqual(propTypes);
        expect(index.proxyChildren).toEqual(proxyChildren);
        expect(index.transform).toEqual(transform);
        expect(index.value).toEqual(value);

        expect(index.transforms).toEqual(transforms);
    });

});
