# [4.0.0](https://github.com/rumble-charts/rumble-charts/compare/v3.1.2...v4.0.0) (2021-08-27)

### Features and highlights

* Supports React 17 (for older React versions, use `rumble-charts` 3.x)
* Code rewritten as TypeScript (with typings) and functional react components
* Updated documentation (still in progress):
  * Use Storybook for documentation and examples: [https://rumble-charts.github.io/](https://rumble-charts.github.io/)
  * Playground (playroom): [https://rumble-charts.github.io/playroom/](https://rumble-charts.github.io/playroom/)
  * TypeDoc: [https://rumble-charts.github.io/typedoc/](https://rumble-charts.github.io/typedoc/)
* `<Chart>` supports percents for props `width` and `height` and is responsive by default
  (in this case, props `layerWidth` and `layerHeight` should be defined)
* `<Title>` has a new prop `textAnchor` to define an alignment: "start", "middle" or "end".
* `<Animate>` has a new prop `onCancel` to track animation cancellation (on the component unmount or re-render).
