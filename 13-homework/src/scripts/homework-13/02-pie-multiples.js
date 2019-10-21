import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
// .append('g')
// .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
// .attr('transform', `translate(${width / 2},${height / 2})`)

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const radius = 75

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const labelArc = d3
  .arc()
  .innerRadius(radius)
  .outerRadius(radius + 20)

const colorScale = d3.scaleOrdinal().range(['#90C786', '#BBAED1', '#F4C38E'])

const pointScale = d3.scalePoint().range([0, width])

d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// At the very least you'll need scales, and
// you'll need to read in the file. And you'll need
// and svg, too, probably.

function ready(datapoints) {
  //   console.log(pie(datapoints))

  const names = datapoints.map(d => d.project)
  pointScale.domain(names).padding(0.5)

  const nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)
  //   console.log(nested)
  svg
    .selectAll('.pie-chart')
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
      // const points = pointScale(d => d.values.project)

      svg
        .append('text')
        .text(d => d.key)
        .attr('x', pointScale(d.projects))
        .attr('y', height / 3)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .style('font-size', 14)

      svg
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', function(d) {
          return arc(d)
        })
        .attr('fill', d => colorScale(d.data.task))
    })
}
