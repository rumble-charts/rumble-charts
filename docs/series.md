Series is one of the main concepts in rumble charts. It's a set of data you're going to show using your chart.
For instance, line graphs, cloud of tags, bars, pies etc. 
 
Series is an array of several (one or more) specific series objects.

```javascript static
const series = [{
  name: '', // optional
  // ... other attributes
  data: []
}]
```

Specific series object is an object contains `data` and other optional attributes such 
as `name`, `color`, `style`, `opacity`. You can add your own attribute and use it in a chart.

## series.data

It's an array of data points and can be presented in three ways 
(all next examples are identical):

1. Primitive numerical values

```javascript static
[1, 2, 4]
```
2. Pairs of numbers [x, y], where the first value represents `x` value 
and the second one - `y` value (as main value).

```javascript static
[[0, 1], [1, 2], [2, 4]]
```

3. Objects contain point's attributes: 
  - required `y` (as a main value)
  - and optional `x`, `color`, `style`, `opacity`

As in series objects, here you also can add your own attribute and use it in a chart.

```javascript static
[{
  x: 0, // optional
  y: 1
}, {
  x: 1, // optional
  y: 2
}, {
  x: 2, // optional
  y: 4
}]
```

In propTypes series property described as:

```javascript static
series: React.PropTypes.arrayOf(React.PropTypes.shape({
  name: React.PropTypes.string,
  color: React.PropTypes.string,
  opacity: React.PropTypes.number,
  style: React.PropTypes.object,
  data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.arrayOf(React.PropTypes.number),
    React.PropTypes.shape({
      x: React.PropTypes.number,
      y: React.PropTypes.number.isRequired,
      color: React.PropTypes.string,
      opacity: React.PropTypes.number,
      style: React.PropTypes.object
    })
  ])).isRequired
}))
```

**Important**. The first two schemas (numbers and pairs of numbers) eventually will be converted 
to the third one (object {x, y}).  
