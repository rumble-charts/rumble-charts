You can build your own charts using the set of components presented here. All components are composable. 
It means you can use them in different orders and make a different nested structures.

**Important**. All examples on this site are editable. You are encouraged to experiment with them.

```
const series = [{
  data: [1, 2, 3]
}, {
  data: [5, 7, 11]
}, {
  data: [13, 17, 19]
}];

<Chart width={600} height={250} minY={0} series={series}>
  <Layer width='90%' height='90%'>
    <Bars opacity={0.5} />
    <Lines />
    <Dots />
  </Layer>
</Chart>;
```

## Important concepts

- [Series](#series)

## Still important, but you can read it later

- [Magic and hidden props](#magic--hidden-props)
- [CSS class names](#css-class-names)
