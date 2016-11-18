The simplest bar chart

```
const series = [{
    data: [1, 2, 4]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Bars />
</Chart>
```

Three series

```
const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Bars />
</Chart>
```

Colors

```
const series = [{
    data: [1, 2, 3]
}, {
    data: [5, {y:7, color: 'violet'}, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Bars
    colors='category10' // category20, category20b, category20c
    // colors={['red', 'green', 'blue']}
    innerPadding='0.5%'
    groupPadding='3%'
  />
</Chart>
```

Stacked bar chart

```

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series}>
  <Transform method='stack'>
    <Bars combined={true} innerPadding='2%' />
  </Transform>
</Chart>
```

Horizontal stacked bar chart

```

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series}>
  <Transform method={['stack', 'rotate']}>
    <Bars combined={true} innerPadding='2%' />
  </Transform>
</Chart>
```
