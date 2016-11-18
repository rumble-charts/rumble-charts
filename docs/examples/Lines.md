```
const series = [{
    data: [1, 3, 2]
}, {
    data: [5, 11, 7]
}, {
    data: [13, 19, 17]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Lines />
</Chart>
```

Makes sense to use scaleX and scaleY

```
const series = [{
    data: [1, 3, 2]
}, {
    data: [5, 11, 7]
}, {
    data: [13, 19, 17]
}];

<Chart 
  width={600} height={250} series={series} minY={0}
  scaleX={{paddingStart: 0, paddingEnd: 0}}
  scaleY={{paddingTop: 10}}>
  <Lines />
</Chart>
```

Area chart

```
const series = [{
    data: [1, 3, 2]
}, {
    data: [5, 11, 7]
}, {
    data: [13, 19, 17]
}];

<Chart 
  width={600} height={250} series={series} minY={0}
  scaleX={{paddingStart: 0, paddingEnd: 0}}
  scaleY={{paddingTop: 10}}>
  <Transform method='stack'>
    <Lines asAreas={true} />
  </Transform>
</Chart>
```
