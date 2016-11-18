Simple

```
const series = [{
    data: [1, 2, 4]
}];

<Chart width={600} height={250} series={series}>
  <Transform method={['transpose', 'stack']}>
    <Pies combined={true} />
  </Transform>
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
  <Transform method={['transpose', 'stack']}>
    <Pies
      combined={true}
      innerPadding='3%'
      innerRadius='20%'
    />
  </Transform>
</Chart>
```

Conical gradient. Actually it's a not real conical gradient since svg doesn't support it. It's emulated 
using many small sectors.

```
const series = [{
    data: [1, 2, 4]
}];

<Chart width={600} height={250} series={series}>
  <Transform method={['transpose', 'stack']}>
    <Pies
      combined={true} barWidth='50%'
      colors={['red', ['green', 'blue'], 'blue']}
    />
  </Transform>
</Chart>
```

Fancy. Interacts with your mouse.

```
const series = [{
  data: [1, 3, 2, 5, 7]
}, {
  data: [5, 11, 7, 13, 19]
}, {
  data: [13, 19, 17, 23, 29]
}];

<Chart width={600} height={250} series={series}>
  <Transform method={['transpose', 'stackNormalized']}>
    <Pies
      colors='category10'
      combined={true}
      innerRadius='33%'
      padAngle={0.025}
      cornerRadius={5}
      innerPadding={2}
      pieAttributes={{
        onMouseMove: (e) => e.target.style.opacity = 1,
        onMouseLeave: (e) => e.target.style.opacity = 0.5
      }}
      pieStyle={{opacity: 0.5}}
    />
  </Transform>
</Chart>
```
