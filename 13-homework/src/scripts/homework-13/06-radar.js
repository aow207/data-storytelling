import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }
const height = 400 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const categories = ['Food', 'Service', 'Atmosphere', 'Price', 'Trendiness']

const angleScale = d3
  .scaleBand()
  .domain(categories)
  .range([0, Math.PI * 2])

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

const line = d3
  .radialArea()
  .outerRadius(d => radiusScale(d.score))
  .angle(d => {
    return angleScale(d.category)
  })

d3.csv(require('/data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  // Area
  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'pink')
    .attr('stroke', 'black')
    .attr('opacity', 0.6)

  // Circles
  svg
    .append('circle')
    .attr('r', 3)
    .attr('fill', 'black')
    .attr('cx', 0)
    .attr('cy', 0)

  svg
    .append('circle')
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')

  // Bands
  const bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', function(d) {
      return radiusScale(d)
    }) // just return d since the number is the only thing in bands
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .lower()

  // Lines
  svg
    .selectAll('.radius-line')
    .data(categories)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'lightgrey')
    .style('transform', function(d) {
      console.log(angleScale(d))
      return `rotate(${angleScale(d)}rad)`
    })

  // Text
  svg
    .selectAll('.outside-label')
    .data(categories)
    .enter()
    .append('text')
    .text(d => d)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', 10)
    .style('font-weight', 600)
    .attr('y', -radius)
    .style('transform', function(d) {
      console.log(angleScale(d))
      return `rotate(${angleScale(d)}rad)`
    })
    .attr('text-anchor', 'middle')
    .attr('dy', -10)
}
