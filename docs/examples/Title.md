```
const series = [{
    data: [1, 2, 4]
}];

<Chart width={300} height={100} series={series} minY={0}>
  <Transform method={['transpose']}>
   <Bars />
     <Title position='middle center' style={{textAnchor:'middle'}}>
       Chart Title
     </Title>
  </Transform>
</Chart>
```


```
<Chart width={300} height={25}>
  <Title position='center middle'>
    {props => <text>
      {props.layerWidth + 'x' + props.layerHeight}
    </text>} 
  </Title>
</Chart>
```
