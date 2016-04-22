# rumble-charts

[![Join the chat at https://gitter.im/RumbleInc/rumble-js-charts](https://badges.gitter.im/RumbleInc/rumble-js-charts.svg)](https://gitter.im/RumbleInc/rumble-js-charts?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/RumbleInc/rumble-js-charts.svg)](https://travis-ci.org/RumbleInc/rumble-js-charts) 
[![Dependency Status](https://david-dm.org/RumbleInc/rumble-js-charts.svg)](https://david-dm.org/RumbleInc/rumble-js-charts) 
[![npm](https://img.shields.io/npm/v/rumble-charts.svg)](https://www.npmjs.com/package/rumble-charts)

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

## Road map

- [x] Write unit tests for graphics components
- [x] Make a first version of documentation with examples
- [x] Update to React 15.x
- [x] Update to lodash 4.x
- [ ] Write unit tests for wrappers and helpers components 
- [ ] Support React ART
- [ ] Support morphing between graphics types (Pies <=> Bars)

## Similar projects 

Mainly there are 3 approaches to integrate React and D3:  

 - React wraps D3
    - [d3-react-squared](https://github.com/bgrsquared/d3-react-squared)  
    - [d3act](https://github.com/AnSavvides/d3act)
 - D3 prepares virtual DOM for React
    - [react-faux-dom](https://github.com/Olical/react-faux-dom)
    - [d3-react-sparkline](https://github.com/QubitProducts/d3-react-sparkline/) - based on react-faux-dom
 - React builds virtual DOM, D3 makes math (`rumble-charts` is here) 
    - [react-d3-components](https://github.com/codesuki/react-d3-components)
    - [react-d3](https://github.com/esbullington/react-d3/) and [rd3](https://github.com/yang-wei/rd3) as a fork
    - [react-vis](https://github.com/uber/react-vis)
    - [victory](https://github.com/FormidableLabs/victory)

## License

MIT
