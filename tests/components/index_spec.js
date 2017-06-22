import index, {
    Animate, Bars, Chart, Cloud, Dots, DropShadow,
    Gradient, Handlers, Labels, Layer, Lines, Pies, RadialLines,
    Ticks, Title, Transform, helpers
} from '../../src';

describe('Main index file', () => {

    it('should export all the components in default object', () => {
        expect(index.Animate).toBeDefined();
        expect(index.Bars).toBeDefined();
        expect(index.Chart).toBeDefined();
        expect(index.Cloud).toBeDefined();
        expect(index.Dots).toBeDefined();
        expect(index.DropShadow).toBeDefined();
        expect(index.Gradient).toBeDefined();
        expect(index.Handlers).toBeDefined();
        expect(index.Labels).toBeDefined();
        expect(index.Layer).toBeDefined();
        expect(index.Lines).toBeDefined();
        expect(index.Pies).toBeDefined();
        expect(index.RadialLines).toBeDefined();
        expect(index.Ticks).toBeDefined();
        expect(index.Title).toBeDefined();
        expect(index.Transform).toBeDefined();

        expect(index.helpers).toBeDefined();
    });

    it('should export the same components in two different approaches', () => {
        expect(index.Animate).toEqual(Animate);
        expect(index.Bars).toEqual(Bars);
        expect(index.Chart).toEqual(Chart);
        expect(index.Cloud).toEqual(Cloud);
        expect(index.Dots).toEqual(Dots);
        expect(index.DropShadow).toEqual(DropShadow);
        expect(index.Gradient).toEqual(Gradient);
        expect(index.Handlers).toEqual(Handlers);
        expect(index.Labels).toEqual(Labels);
        expect(index.Layer).toEqual(Layer);
        expect(index.Lines).toEqual(Lines);
        expect(index.Pies).toEqual(Pies);
        expect(index.RadialLines).toEqual(RadialLines);
        expect(index.Ticks).toEqual(Ticks);
        expect(index.Title).toEqual(Title);
        expect(index.Transform).toEqual(Transform);

        expect(index.helpers).toEqual(helpers);
    });

});
