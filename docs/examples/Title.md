```
import { Chart, Title, Transform, Bars } from 'rumble-charts';

const series = [{
    data: [1, 2, 4]
}];

<Chart width={600} height={250} series={series} minY={0}>
  <Transform method={['transpose']}>
   <Bars />
     <Title position='middle center' style={{textAnchor:'middle'}}>
       Chart Title
     </Title>
  </Transform>
</Chart>
```


```
import { Chart, Title } from 'rumble-charts';

<Chart width={600} height={50}>
  <Title position='center middle' style={{textAnchor:'middle'}}>
    {props => <text>
      Example of auto-updating title
      [width={props.layerWidth}, height={props.layerHeight}]
    </text>} 
  </Title>
</Chart>
```
