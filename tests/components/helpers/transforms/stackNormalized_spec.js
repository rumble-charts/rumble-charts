import stackNormalized from '../../../../src/helpers/transforms/stackNormalized';
import stack from '../../../../src/helpers/transforms/stack';

const series = [
    {data: [1, 2, 3, 4]},
    {data: [2, 3, 4, 1]},
    {data: [4, 3, 2, 1]}
];

describe('Transform stackNormalized', () => {

    it('should be just a shortcut for stack transform', () => {
        expect(stackNormalized({series})).toEqual(stack({series}, {normalize: true}));
    });

});
