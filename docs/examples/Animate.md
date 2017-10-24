```
const _ = require('lodash');

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

class Demo extends React.Component {
  render() {
    return <Chart onClick={this.updateSeries} width={600} height={400} series={this.state.series} minY={0}>
      <Layer width='80%' height='80%' position='middle center'>
        <Animate ease='bounce' _ease='elastic'>
        <Ticks
          axis='y'
          ticks={{maxTicks: 4}}
          tickVisible={({tick}) => tick.y > 0}
          lineLength='100%'
          lineVisible={true}
          lineStyle={{stroke:'lightgray'}}
          labelStyle={{textAnchor:'end',alignmentBaseline:'middle',fontSize:'0.85em',fontFamily:'sans-serif',fill:'lightgray'}}
          labelAttributes={{x: -5}}
        />
        <Ticks
          axis='x'
          label={({props, index}) => props.series[index].name}
          labelStyle={{textAnchor:'middle',alignmentBaseline:'before-edge',fontSize:'0.85em',fontFamily:'sans-serif',fill:'lightgray'}}
          labelAttributes={{y: 3}}
        />
        <Bars
          groupPadding='3%'
          innerPadding='0.5%'
        />
        <Lines />
        <Dots />
        <Labels
          label={({point}) => Math.round(point.y)}
          dotStyle={{
            alignmentBaseline:'after-edge',
            textAnchor:'middle',
            fontFamily:'sans-serif'
          }}
          labelAttributes={{y: -4}}
        />
        </Animate>
      </Layer>
    </Chart>;
  }
  constructor() {
    super();
    this.state = {series};
    this.updateSeries = () => {
      const series = _.map(_.range(3), index => ({
        data: _.map(_.range(3), index => Math.random() * 100)
      }));
      this.setState({series});
    }
  }
}

<Demo />

```
