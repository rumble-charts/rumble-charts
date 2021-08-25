import {
    Title,
    Subtitle,
    Description,
    ArgsTable,
    Stories,
    Heading,
} from '@storybook/addon-docs';

export const parameters = {
    actions: {argTypesRegex: '^on[A-Z].*'},
    options: {
        storySort: {
            method: 'alphabetical',
            order: ['Guides', ['Introduction', 'Installation', 'Getting started']]
        }
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    backgrounds: {
        values: [],
    },
    docs: {
        page: () => (
            <>
                <Title />
                <Subtitle />
                <Description />
                <Heading>Props</Heading>
                <ArgsTable />
                <Stories title='Examples' includePrimary={true} />
            </>
        ),
    },
    playroom: {
        reactElementToJSXStringOptions: {
            sortProps: false,
            showFunctions: false,
            maxInlineAttributesLineLength: 120
        },
        url: process.env.NODE_ENV === 'production' ? '/rumble-charts/playroom/' : 'http://localhost:9000'
    }
};
