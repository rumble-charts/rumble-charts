Just dots

```
const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Layer width='90%' height='90%'>
    <Dots />
  </Layer>
</Chart>
```

Scatter plot

```
const series = [{
    data: [{y: 1, weight: 2}, {y: 2, weight: 3}, {y: 3, weight: 2}]
}, {
    data: [{y: 5, weight: 13}, {y: 7, weight: 7}, {y: 11, weight: 2}]
}, {
    data: [{y: 13, weight: 9}, {y: 17, weight: 6}, {y: 19, weight: 4}]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Layer width='90%' height='90%'>
    <Dots circleRadius={({point}) => point.weight} />
  </Layer>
</Chart>
```

Combine dot types

```
const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Layer width='90%' height='90%'>
    <Dots 
      dotType={['circle', 'symbol']}
      symbolType='cross'
      symbolAttributes={{fill: 'white'}}
      circleRadius={6}
    />
  </Layer>
</Chart>
```
