Simple

```
const series = [{
    data: [1, 3, 2, 5, 7]
}, {
    data: [5, 11, 7, 13, 19]
}, {
    data: [13, 19, 17, 23, 29]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <RadialLines 
    interpolation='linear-closed'
    lineWidth={2}
  />
</Chart>
```

Areas

```
const series = [{
    data: [1, 3, 2, 5, 7]
}, {
    data: [5, 11, 7, 13, 19]
}, {
    data: [13, 19, 17, 23, 29]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Transform method='stack'>
    <RadialLines 
      asAreas={true}
      innerRadius='20%'
      interpolation='linear-closed'
    />
  </Transform>
</Chart>
```
