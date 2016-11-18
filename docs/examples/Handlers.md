```
const series = [{
    data: [1, 2, 3]
}, {
    data: [5, 7, 11]
}, {
    data: [13, 17, 19]
}];

<Chart width={600} height={300} series={series} minY={0}>
  <Layer width='100%' height='90%' position='bottom center'>
  <Handlers onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} optimized={false}>
    <Bars
      groupPadding='3%'
      innerPadding='0.5%'
      barAttributes={{
        onMouseMove: e => e.target.style.fillOpacity = 1,
        onMouseLeave: e => e.target.style.fillOpacity = 0.5
      }}
      barStyle={{
        fillOpacity: 0.5,
        transition: 'all 250ms'
      }}
    />
    <Lines lineWidth={2} />
    <Dots className='dots' dotStyle={{transition:'all 250ms',fillOpacity:0}} />
  </Handlers>
  </Layer>
</Chart>

var hovered = null;
function hideHovered() {
   if (hovered && hovered.circle) {
     hovered.circle.setAttribute('r', hovered.radius);
     hovered.circle.style.fillOpacity = hovered.opacity;
     if (hovered.label) {
       hovered.label.style.display = 'none';
     }
   }
}

function handleMouseMove({closestPoints}) {
  const closest = closestPoints[0];
  if (!closest) {
    return;
  }
  const {seriesIndex, pointIndex} = closest;
  const circle = document.querySelector(`circle.dots-circle-${seriesIndex}-${pointIndex}`);
  if (!circle) {
    return;
  }
  hideHovered();
  const label = document.querySelector(`.labels-label-${seriesIndex}-${pointIndex}`);
  hovered = {circle, label, radius: circle.getAttribute('r'), opacity: circle.style.fillOpacity};
  circle.setAttribute('r', 5);
  circle.style.fillOpacity = 1;
  if (label) {
    label.style.display = 'block';
  }
}

function handleMouseLeave() {
  hideHovered();
}
```
