```
const series = [{
    data: [1, 2, 4]
}];

<Chart width={1000} height={200} series={series} minY={0}>
  <Layer width='19%' height='100%' position='left middle'>
    <Bars />
  </Layer>
  <Layer width='19%' height='100%' position='20% middle'>
    <Transform method='transpose'>
      <Bars />
    </Transform>
  </Layer>
  <Layer width='19%' height='100%' position='40% middle'>
    <Transform method={['transpose', 'rotate']}>
      <Bars />
    </Transform>
  </Layer>
  <Layer width='19%' height='100%' position='60% middle'>
    <Transform method={['transpose', 'reverse']}>
      <Bars />
    </Transform>
  </Layer>
  <Layer width='19%' height='100%' position='right middle'>
    <Transform method={['transpose', 'stack']}>
      <Bars combined={true} />
    </Transform>
  </Layer>
</Chart>
```
