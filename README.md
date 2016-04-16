# rumble-charts

React components for building composable and flexible charts. 

It's based on D3.js under the hood, but most of the time you will not feel that.

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

## Development and testing

```bash
# 1. Fork it on github

# 2. Clone your repo
git clone ...
cd rumble-js-charts

# 3. Install all dependencies (including devDependecies)
npm install

# 4.
# to run all tests and generate test coverage (./coverage)
npm test

# to run tests in watch mode for development
npm start
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
