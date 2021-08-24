import React from 'react';
import {create} from 'react-test-renderer';

import {Title} from './Title';

describe('Title', () => {

    it('should render a text inside g', () => {
        const renderer = create(<Title layerWidth={100} layerHeight={100}>Title</Title>);
        const g = renderer.root.findAllByType('g');
        expect(g.length).toEqual(1);
        const text = g[0].findAllByType('text');
        expect(text.length).toEqual(1);
        expect(text[0].children).toEqual(['Title']);
    });

    it('should render everything else as children', () => {
        const renderer = create(<Title layerWidth={100} layerHeight={100}>
            <circle r={50} />
        </Title>);
        const g = renderer.root.findAllByType('g');
        expect(g.length).toEqual(1);
        const circle = g[0].findAllByType('circle');
        expect(circle.length).toEqual(1);
        expect(circle[0].props.r).toEqual(50);
    });

    it('should understand child as a function with props as an argument', () => {
        const renderer = create(<Title
            layerWidth={100} layerHeight={20} position='top center'
            series={[{data: [123]}]}>
            {({layerWidth, layerHeight, position, series}) => <g>
                <text>{layerWidth}</text>
                <text>{layerHeight}</text>
                <text>{position}</text>
                <text>{series?.[0].data[0]}</text>
            </g>}
        </Title>);
        const captions = renderer.root.findAllByType('text');
        expect(captions.length).toEqual(4);
        expect(captions[0].children).toEqual(['100']);
        expect(captions[1].children).toEqual(['20']);
        expect(captions[2].children).toEqual(['top center']);
        expect(captions[3].children).toEqual(['123']);
    });

    it('should be able to positioned', () => {
        const renderer = create(<Title layerWidth={100} layerHeight={100} position='top center'>
            Title
        </Title>);
        expect(renderer.root.findByType('g').props.transform).toEqual('translate(50 0)');
    });

    it('should support className and styles', () => {
        const renderer = create(<Title
            layerWidth={100} layerHeight={100}
            position='bottom center'
            className='className className-2'
            style={{transition: '100ms'}}
        >Title</Title>);
        const g = renderer.root.findByType('g');
        expect(g.props.style).toEqual(expect.objectContaining({
            transition: '100ms'
        }));
        expect(g.props.className.includes('className')).toEqual(true);
        expect(g.props.className.includes('className-2')).toEqual(true);
    });

    it('should not render empty tag', () => {
        // @ts-ignore
        const renderer = create(<Title layerWidth={100} layerHeight={100} />);
        expect(renderer.root.findByType('g').children).toEqual([]);
    });

});
