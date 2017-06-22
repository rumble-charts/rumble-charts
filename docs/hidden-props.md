# Magic props

In order to have a great composability rumble-charts has a list of "magic" props that comes from parents to children,
from ancestors to descendants. They are: `series`, `minX`, `maxX`, `minY`, `maxY`, `scaleX`, `scaleY`, 
`layerWidth` and `layerHeight`. They all are described bellow.

## How it works?

For instance, `series` is settled in [`<Chart>`](#chart):  

```html
<Chart series={series}>
  <Layer>
    <Bars />
  </Layer>
</Chart>
```

... but [`<Layer>`](#layer) and [`<Bars>`](#bars) receive it like you've wrote next:
 
```html
<Chart>
  <Layer series={series}>
    <Bars series={series} />
  </Layer>
</Chart>
```

Also you can set `series` on an intermediate level:

```html
<Chart>
  <Layer series={series}>
    <Bars />
  </Layer>
</Chart>
```

... and [`<Bars>`](#bars) will receive it again like you've wrote next:

```html
<Chart>
  <Layer>
    <Bars series={series} />
  </Layer>
</Chart>
```

## series

Read more about [series](#series).

## minX, maxX, minY and maxY

Optional limits, affect on how graphics will be drawn. They are calculated 
automatically based on `series` you've supplied, but sometimes you need to define 
any by yourself. Especially it relates to `minY` property. Very often you have to set it as `minY={0}`.

Compare next two examples. Without `minY` (it's calculated automatically).

```
const series = [{
  data: [1, 2, 3]
}, {
  data: [5, 7, 11]
}, {
  data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series}>
  <Bars />
</Chart>;
```

And with `minY={0}`:

```
const series = [{
  data: [1, 2, 3]
}, {
  data: [5, 7, 11]
}, {
  data: [13, 17, 19]
}];

<Chart width={600} height={250} minY={0} series={series}>
  <Bars />
</Chart>;
```
## scaleX and scaleY

**scaleX** - X-scale (horizontal) attributes

It's an object can have next attributes:
- **direction** [number] — 1 or -1, default value is 1
- **paddingStart** [number] — Padding at the start of the scale domain, default value is 0.5
- **paddingEnd** [number] — Padding at the end of the scale domain, default value is 0.5
- **paddingLeft** [number] — Left padding in pixels, default value is 0
- **paddingRight** [number] — Right padding in pixels, default value is 0

**scaleY** - Y-scale (horizontal) attributes

It's an object can have next attributes:
- **direction** [number] — 1 or -1, default value is 1
- **paddingStart** [number] — Padding at the start of the scale domain, default value is 0
- **paddingEnd** [number] — Padding at the end of the scale domain, default value is 0
- **paddingTop** [number] — Top padding in pixels, default value is 0
- **paddingBottom** [number] — Bottom padding in pixels, default value is 0

For better understanding see examples below.

Scales' paddings (try to play with these properties right here):

```
const series = [{
  data: [1, 2, 3]
}, {
  data: [5, 7, 11]
}, {
  data: [13, 17, 19]
}];

<Chart 
  width={600} height={250} minY={0} series={series}
  scaleX={{
    paddingStart: 0.5, 
    paddingEnd: 0.0001
  }}
  scaleY={{
    paddingTop: 10, 
    paddingBottom: 0
  }}>
  <Bars opacity={0.5} />
  <Lines />
  <Dots />
</Chart>;
```

Invert scale's direction:

```
const series = [{
  data: [1, 2, 3]
}, {
  data: [5, 7, 11]
}, {
  data: [13, 17, 19]
}];

<Chart 
  width={600} height={250} minY={0} series={series}
  scaleX={{
    direction: -1
  }}
  scaleY={{
    direction: -1
  }}>
  <Bars />
</Chart>;
```
## layerWidth and layerHeight

When you set [`<Chart width={100} height={100}>`](#chart) all descendant components receive these `width` and `height`
as `layerWidth` and `layerHeight` correspondingly.
 
```
<Chart width={600} height={50}>
  <Title position='center middle'>
    {props => <text>
      {props.layerWidth + 'x' + props.layerHeight}
    </text>} 
  </Title>
</Chart>
```

# Hidden props

## children

Any component (except graphics like [`<Bars>`](#bars), [`<Lines>`](#lines), [`<Pies>`](#pies) etc) can have children.
Children can be any rumble-charts components (one or more) or any other valid svg tag 
(i.e. `<defs>`, `<g>`, `<rect>`, `<circle>` etc)

## seriesIndex

Using `seriesIndex` you can choose which specific series will be using in this component. 

```
const series = [{
  data: [1, 2, 3]
}, {
  data: [5, 7, 11]
}, {
  data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Bars
    seriesIndex={0}
    innerPadding='1%'
  />
  <Lines
    seriesIndex={[1,2]}
  />
  <Dots
    seriesIndex={(series, index) => index < 2}
  />
</Chart>;
```

## viewBox

Use it to set custom [viewBox](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox) SVG property. By default it is set to `0 0 {width} {height}` to make SVGs scalable.
