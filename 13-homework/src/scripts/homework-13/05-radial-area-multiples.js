import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 980 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
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

const radius = 60

const radiusScale = d3
  .scaleLinear()
  .domain([0, 75])
  .range([20, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

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
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'pink')
        .attr('opacity', 0.7)
        .attr('stroke', 'none')

      const bands = [20, 40, 60, 80, 100]
      const textBands = [20, 60, 100]

      svg
        .selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', function(d) {
          return radiusScale(d)
        })
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', 'none')
        .attr('stroke', 'lightgrey')

      // Labels
      svg
        .selectAll('.label')
        .data(textBands)
        .enter()
        .append('text')
        .text(d => d + '°')
        .attr('x', 0)
        .attr('y', function(d) {
          return -radiusScale(d)
        })
        .attr('dy', -6)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', 10)

      svg
        .append('text')
        .text(d => d.key)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 6)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 600)
        .style('font-size', 10)
    })
}
