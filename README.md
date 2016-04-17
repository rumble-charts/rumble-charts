# rumble-charts

[![Join the chat at https://gitter.im/RumbleInc/rumble-js-charts](https://badges.gitter.im/RumbleInc/rumble-js-charts.svg)](https://gitter.im/RumbleInc/rumble-js-charts?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/RumbleInc/rumble-js-charts.svg)](https://travis-ci.org/RumbleInc/rumble-js-charts) [![Dependency Status](https://david-dm.org/RumbleInc/rumble-js-charts.svg)](https://david-dm.org/RumbleInc/rumble-js-charts) [![npm](https://img.shields.io/npm/v/rumble-charts.svg)](https://www.npmjs.com/package/rumble-charts)

React components for building composable and flexible charts. 

It's based on D3.js under the hood, but most of the time you will not feel that.

## Documentation

All examples are editable. You can see a result right on the page.

[https://rumbleinc.github.io/rumble-js-charts/](https://rumbleinc.github.io/rumble-js-charts/)

## Demo / live edit

[rosko.github.io/slides/2016-04-declarative-charts/#/liveedit](https://rosko.github.io/slides/2016-04-declarative-charts/#/liveedit)

## Installation

### NPM

```bash
npm install --save rumble-charts
```

## Usage

Just include it:

```javascript
const {
  // main component
  Chart, 
  // graphs
  Bars, Cloud, Dots, Labels, Lines, Pies, RadialLines, Ticks, Title,
  // wrappers
  Layer, Animate, Transform, Handlers,
  // helpers
  helpers, DropShadow, Gradient
} = require('rumble-charts');
```

And use:

```jsx
const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

class Demo extends Component {
  render() {
    return <Chart width={400} height={400} series={series} minY={0}>
      <Bars />
      <Lines />
      <Dots />
    </Chart>;
  }
}
```

## License

MIT
