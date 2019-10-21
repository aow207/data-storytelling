import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 980 - margin.left - margin.right

const svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 70

const radiusScale = d3
  .scaleLinear()
  .domain([0, 80])
  .range([0, radius])

const colorScale = d3
  .scaleLinear()
  .domain([40, 80])
  .range(['#C0D3E0', '#F5BCC3'])

const arc = d3
  .arc()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

const pointScale = d3.scalePoint().range([0, width])

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

// At the very least you'll need scales, and

function ready(datapoints) {
  //   console.log(pie(datapoints))

  const names = datapoints.map(d => d.city)
  pointScale.domain(names).padding(0.3)

  const nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)
  //   console.log(nested)
  svg
    .selectAll('.arc-chart')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      // console.log(d)
      return 'translate(' + pointScale(d.key) + ',' + height / 2 + ')'
    })

    .each(function(d) {
      // const name = d.key
      const datapoints = d.values
      const svg = d3.select(this)
      datapoints.push(datapoints[0])

      svg
        .selectAll('.polar-bar')
        .data(datapoints)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => colorScale(d.high_temp))

      svg
        .append('circle')
        .attr('r', 1)
        .attr('cx', 0)
        .attr('cy', 0)

      svg
        .append('text')
        .text(d => d.key)
        .attr('x', pointScale(d.city))
        .attr('y', height / 2)
        .attr('fill', 'black')
        .style('font-size', 14)
        .attr('text-anchor', 'middle')
    })
}
