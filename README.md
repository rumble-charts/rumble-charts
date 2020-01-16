# <img src="https://raw.githubusercontent.com/rumble-charts/rumble-charts/master/images/logo.png" alt="Logo" width="48" height="48" /> rumble-charts

[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/rumble-charts/rumble-charts)

[![Build Status](https://travis-ci.org/rumble-charts/rumble-charts.svg?branch=master)](https://travis-ci.org/rumble-charts/rumble-charts)
[![codecov](https://codecov.io/gh/rumble-charts/rumble-charts/branch/master/graph/badge.svg)](https://codecov.io/gh/rumble-charts/rumble-charts)
[![Dependency Status](https://david-dm.org/rumble-charts/rumble-charts.svg)](https://david-dm.org/rumble-charts/rumble-charts) 
[![Greenkeeper badge](https://badges.greenkeeper.io/rumble-charts/rumble-charts.svg)](https://greenkeeper.io/)

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=alert_status)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=security_rating)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)

[![npm](https://img.shields.io/npm/v/rumble-charts.svg)](https://www.npmjs.com/package/rumble-charts)
[![npm](https://img.shields.io/npm/dm/rumble-charts.svg)](https://www.npmjs.com/package/rumble-charts)

React components for building composable and flexible charts to visualize your data. 

It's based on D3.js under the hood, but most of the time you will not feel that.

## Real-world examples

![Pie Charts](./docs/images/05.png)

![Bar Charts](./docs/images/07.png)

![Line Chart](./docs/images/03.png)

## Documentation

All examples are editable. You can see a result right on the page.

[https://rumble-charts.github.io](https://rumble-charts.github.io)

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
import {
  // main component
  Chart, 
  // graphs
  Bars, Cloud, Dots, Labels, Lines, Pies, RadialLines, Ticks, Title,
  // wrappers
  Layer, Animate, Transform, Handlers,
  // helpers
  helpers, DropShadow, Gradient
} from 'rumble-charts';
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

class Demo extends React.Component {
  render() {
    return <Chart width={600} height={250} series={series} minY={0} maxY={20}>
      <Bars innerPadding={5} groupPadding={10} />
      <Lines />
      <Dots />
    </Chart>;
  }
}
```

Result:

![Combined Chart](./docs/images/08.png)

## [Road map](ROADMAP.md)

## Similar projects 

Mainly there are 3 approaches to integrate React and D3:  

 - React wraps D3
    - [d3-react-squared](https://github.com/bgrsquared/d3-react-squared)  
    - [d3act](https://github.com/AnSavvides/d3act)
 - D3 prepares virtual DOM for React
    - [d3-react-sparkline](https://github.com/QubitProducts/d3-react-sparkline/) - based on react-faux-dom
    - [react-faux-dom](https://github.com/Olical/react-faux-dom)
 - React builds virtual DOM, D3 makes math (`rumble-charts` is here) 
    - [react-d3](https://github.com/esbullington/react-d3/) and [rd3](https://github.com/yang-wei/rd3) as a fork
    - [react-d3-components](https://github.com/codesuki/react-d3-components)
    - [react-vis](https://github.com/uber/react-vis)
    - [recharts](https://github.com/recharts/recharts)
    - [victory](https://github.com/FormidableLabs/victory)
    - [vx](https://github.com/hshoff/vx)

## License

MIT
