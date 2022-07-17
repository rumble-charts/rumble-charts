module.exports = {
    stories: [
        '../docs/**/*.stories.mdx',
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        './playroom/preset.js'
    ],
    core: {
        builder: 'webpack5',
    },
    features: {
        postcss: false,
    }
}
