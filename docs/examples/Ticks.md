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

<div style={{fontFamily:'sans-serif',fontSize:'0.8em'}}>
<Chart width={600} height={300} series={series} minY={0}>
  <Layer width='80%' height='90%' position='top center'>
    <Ticks
      axis='y'
      lineLength='100%'
      lineVisible={true}
      lineStyle={{stroke:'lightgray'}}
      labelStyle={{textAnchor:'end',dominantBaseline:'middle',fill:'lightgray'}}
      labelAttributes={{x: -5}}
    />
    <Ticks
      axis='x'
      label={({index, props}) => props.series[index].name}
      labelStyle={{textAnchor:'middle',dominantBaseline:'text-before-edge',fill:'lightgray'}}
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

<div style={{fontFamily:'sans-serif',fontSize:'0.8em'}}>
<Chart width={600} height={300} series={series} minY={0}>
  <Layer width='80%' height='90%' position='top center'>
    <Ticks
      axis='y'
      lineLength='100%'
      lineVisible={true}
      lineStyle={{stroke:'lightgray'}}
      labelStyle={{textAnchor:'end',dominantBaseline:'middle',fill:'lightgray'}}
      labelAttributes={{x: -5}}
      labelFormat={label => label + ' km'}
    />
    <Ticks
      axis='y'
      position='right'
      ticks={{minDistance:1.6}}
      lineLength='100%'
      lineOffset='-100%'
      lineVisible={true}
      lineStyle={{stroke:'lightblue'}}
      labelStyle={{textAnchor:'start',dominantBaseline:'middle',fill:'lightblue'}}
      labelAttributes={{x: 5}}
      labelFormat={label => Math.round(label / 1.6) + ' miles'}
    />
    <Ticks
      axis='x'
      label={({index, props}) => props.series[index].name}
      labelStyle={{textAnchor:'middle',dominantBaseline:'text-before-edge',fill:'lightgray'}}
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