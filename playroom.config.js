module.exports = {
    components: './es/index.js',
    outputPath: './storybook/playroom',

    typeScriptFiles: ['src/**/*.{ts,tsx}', '!**/node_modules'],


    // Optional:
    title: 'Rumble Charts Playroom',
    //   themes: './src/themes',
    //   snippets: './playroom/snippets.js',
    //   frameComponent: './playroom/FrameComponent.js',
    //   scope: './playroom/useScope.js',
    // widths: [640],
    //   port: 9000,
    //   openBrowser: true,
    paramType: 'hash', // default is 'hash'
    exampleCode: `
<Chart layerWidth={600} layerHeight={400} minY={0} series={[{"data":[1,2,3]},{"data":[5,7,11]},{"data":[13,17,19]}]}>
  <Bars colors='set1' innerPadding='1%' groupPadding='2%' />
</Chart>
`.trim(),
    baseUrl: '/playroom/',
    // webpackConfig: () => ({
    //     // Custom webpack config goes here...
    // }),
    // iframeSandbox: 'allow-scripts',
};
