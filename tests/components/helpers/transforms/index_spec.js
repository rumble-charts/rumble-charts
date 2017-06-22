import index, {
    reverse, rotate, sort, stack, stackNormalized, transpose, unstack
} from '../../../../src/helpers/transforms';

describe('Helpers index file', () => {

    it('should export all the components in default object', () => {
        expect(index.reverse).toBeDefined();
        expect(index.rotate).toBeDefined();
        expect(index.sort).toBeDefined();
        expect(index.stack).toBeDefined();
        expect(index.stackNormalized).toBeDefined();
        expect(index.transpose).toBeDefined();
        expect(index.unstack).toBeDefined();
    });

    it('should export the same components in two different approaches', () => {
        expect(index.reverse).toEqual(reverse);
        expect(index.rotate).toEqual(rotate);
        expect(index.sort).toEqual(sort);
        expect(index.stack).toEqual(stack);
        expect(index.stackNormalized).toEqual(stackNormalized);
        expect(index.transpose).toEqual(transpose);
        expect(index.unstack).toEqual(unstack);
    });

});
