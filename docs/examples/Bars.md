The simplest bar chart

```
import { Chart, Bars } from 'rumble-charts';

const series = [{
    data: [1, 2, 4]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Bars />
</Chart>
```

Three series

```
import { Chart, Bars } from 'rumble-charts';

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Bars />
</Chart>
```

Colors

```
import { Chart, Bars } from 'rumble-charts';

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, {y:7, color: 'violet'}, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Bars
    colors='category10' // accent, dark2, paired, pastel1, pastel2', set1, set2, set3, tableau10
    // colors={['red', 'green', 'blue']}
    innerPadding='0.5%'
    groupPadding='3%'
  />
</Chart>
```

Stacked bar chart

```
import { Chart, Bars, Transform } from 'rumble-charts';

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series}>
  <Transform method='stack'>
    <Bars combined={true} innerPadding='2%' />
  </Transform>
</Chart>
```

Horizontal stacked bar chart

```
import { Chart, Bars, Transform } from 'rumble-charts';

const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={250} series={series}>
  <Transform method={['stack', 'rotate']}>
    <Bars combined={true} innerPadding='2%' />
  </Transform>
</Chart>
```
