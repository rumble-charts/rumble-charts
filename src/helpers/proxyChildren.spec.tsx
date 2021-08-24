import React from 'react';
import {generateRandomSeries} from './generateRandomSeries';
import {proxyChildren} from './proxyChildren';

const seriesObject = generateRandomSeries(3, 5, {type: 'object'});

const parentProps = {
    series: seriesObject,
    scaleX: {},
    scaleY: {}
};

const extraProps = {
    layerWidth: 100,
    layerHeight: 100,
    scaleX: parentProps.scaleX,
    scaleY: parentProps.scaleY
};

const Graphics = (props: any) => <g {...props} />;
Graphics.displayName = 'Graphics';

describe('Helper proxyChildren', () => {

    it('should apply special props from the parent to children', () => {
        const [component] = proxyChildren(<Graphics />, parentProps, extraProps);
        const {series, minX, minY, maxX, maxY} = component.props;
        expect(series?.length).toEqual(3);
        expect(minX).toEqual(0);
        expect(maxX).toEqual(4);
        expect(minY).not.toBeLessThan(0);
        expect(maxY).not.toBeGreaterThan(100);
    });

    it('should support seriesIndex as a number', () => {
        const consoleWrap = jest.spyOn(console, 'warn').mockReturnValue();
        const [component] = proxyChildren(<Graphics seriesIndex={1} />, parentProps, extraProps);
        const {series} = component.props;
        expect(series?.length).toEqual(1);
        consoleWrap.mockRestore();
    });

    it('should support seriesIndex as an array', () => {
        const [component] = proxyChildren(<Graphics seriesIndex={[1, 2]} />, parentProps, extraProps);
        const {series} = component.props;
        expect(series?.length).toEqual(2);
    });

    it('should support seriesIndex as a function', () => {
        const [component] = proxyChildren(
            <Graphics
                seriesIndex={(series, index) => index < 2}
            />,
            parentProps, extraProps
        );
        const {series} = component.props;
        expect(series?.length).toEqual(2);
    });

    it('should handle broken seriesIndex', () => {
        const [component] = proxyChildren(<Graphics seriesIndex={undefined} />, parentProps, extraProps);
        const {series} = component.props;
        expect(series?.length).toEqual(3);
    });

    it('should not override series prop for children', () => {
        const [component] = proxyChildren(
            <Graphics series={seriesObject} classname='chart' />,
            parentProps, extraProps
        );
        const {series} = component.props;
        expect(series?.length).toEqual(3);
    });

    it('should support extraProps (3rd argument) as a function', () => {
        const [component] = proxyChildren(<Graphics />, parentProps, () => extraProps);
        expect(component.props.layerWidth).toEqual(100);
    });

});
