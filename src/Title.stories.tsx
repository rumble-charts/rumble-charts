import type {TitleProps} from './Title';

import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Chart} from './Chart';
import {Title} from './Title';
import {Bars} from './Bars';
import {Transform} from './Transform';

export default {
    title: 'Components/Graphics/Title',
    component: Title
} as ComponentMeta<typeof Title>;

const series = [{
    data: [1, 2, 4]
}];

const Template: ComponentStory<typeof Title> = ({children, ...args}: TitleProps) => <Chart width={600} height={300}>
    <Title {...args}>
        {children}
    </Title>
</Chart>;

export const Primary: ComponentStory<typeof Title> = (args) =>
    <Chart width={600} height={300} series={series} minY={0}>
        <Transform method={['transpose']}>
            <Bars />
            <Title {...args}>
                Chart Title
            </Title>
        </Transform>
    </Chart>;
Primary.storyName = 'default';
Primary.args = {
    children: 'Chart Title',
    position: 'middle center',
    style: {textAnchor: 'middle'}
};

export const Secondary: ComponentStory<typeof Title> = Template.bind({});
Secondary.storyName = 'callback title';
Secondary.args = {
    children(props: TitleProps) {
        return <text style={{textAnchor: props.textAnchor}}>
            {props.layerWidth + 'x' + props.layerHeight}
        </text>;
    },
    position: 'center middle',
    textAnchor: 'middle',
};
