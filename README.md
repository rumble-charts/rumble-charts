# <img src="https://raw.githubusercontent.com/rumble-charts/rumble-charts/master/images/logo.png" alt="Logo" width="48" height="48" /> rumble-charts

[![Node.js CI](https://github.com/rumble-charts/rumble-charts/actions/workflows/node.js.yml/badge.svg)](https://github.com/rumble-charts/rumble-charts/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/rumble-charts/rumble-charts/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/rumble-charts/rumble-charts/actions/workflows/codeql-analysis.yml)
[![codecov](https://codecov.io/gh/rumble-charts/rumble-charts/branch/master/graph/badge.svg)](https://codecov.io/gh/rumble-charts/rumble-charts)

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=alert_status)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=security_rating)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=rumble-charts_rumble-charts&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=rumble-charts_rumble-charts)

[![npm](https://img.shields.io/npm/v/rumble-charts.svg)](https://www.npmjs.com/package/rumble-charts)
[![npm](https://img.shields.io/npm/dm/rumble-charts.svg)](https://www.npmjs.com/package/rumble-charts)
[![Bundle size](https://badgen.net/bundlephobia/minzip/rumble-charts)](https://bundlephobia.com/package/rumble-charts@latest)
[![Tree shaking](https://badgen.net/bundlephobia/tree-shaking/rumble-charts)](https://bundlephobia.com/package/rumble-charts@latest)

React components for building composable and flexible charts to visualize your data.

It's based on D3.js under the hood, but most of the time you will not feel that.

## Real-world examples

![Pie Charts](./docs/images/05.png)

![Bar Charts](./docs/images/07.png)

![Line Chart](./docs/images/03.png)

## Documentation

All examples are live editable on "Playroom" tab.

[https://rumble-charts.github.io](https://rumble-charts.github.io)

## Demo / live edit

[https://rumble-charts.github.io/playroom/](https://rumble-charts.github.io/playroom/)

## Installation

### NPM

```bash
npm install --save rumble-charts
```

### CDN

```html

<script src='https://unpkg.com/rumble-charts/umd/rumble-charts.min.js'></script>
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

<Chart width={600} height={250} series={series} minY={0} maxY={20}>
  <Bars innerPadding={5} groupPadding={10} />
  <Lines />
  <Dots />
</Chart>;
```

Result:

![Combined Chart](./docs/images/08.png)

## [Changelog](CHANGELOG.md)

## [Road map](ROADMAP.md)

## License

MIT
