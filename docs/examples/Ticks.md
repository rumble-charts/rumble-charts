```
const series = [{
  name: 'John',
  data: [1, 2, 3]
}, {
  name: 'Jane',
  data: [5, 7, 11]
}, {
  name: 'James',
  data: [13, 17, 19]
}];

<div style={{fontFamily:'sans-serif',fontSize:'0.75em'}}>
<Chart width={300} height={150} series={series} minY={0}>
  <Layer width='80%' height='90%' position='top center'>
    <Ticks
      axis='y'
      lineLength='100%'
      lineVisible={true}
      lineStyle={{stroke:'lightgray'}}
      labelStyle={{textAnchor:'end',alignmentBaseline:'middle',fill:'lightgray'}}
      labelAttributes={{x: -5}}
    />
    <Ticks
      axis='x'
      label={({index, props}) => props.series[index].name}
      labelStyle={{textAnchor:'middle',alignmentBaseline:'before-edge',fill:'lightgray'}}
      labelAttributes={{y: 3}}
    />
    <Bars
      groupPadding='3%'
      innerPadding='0.5%'
    />
  </Layer>
</Chart>
</div>
```