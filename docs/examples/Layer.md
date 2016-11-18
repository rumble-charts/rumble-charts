```
const series = [{
    data: [1, 2, 4]
}];

<Chart width={600} height={400} series={series} minY={0}>
  <Transform method={['transpose']}>
    <Layer width='80%' height='80%'>
      <Bars />
    </Layer>
    <Layer width='33%' height='33%' position='right bottom'>
      <Transform method='stack'>
        <Pies
          combined={true} colors='category10'
          pieStyle={{opacity:0.8}}
        />
      </Transform>
    </Layer>
  </Transform>
</Chart>
```
