import * as d3 from 'd3'

// Create your margins and height/width
const margin = { top: 30, left: 50, right: 30, bottom: 30 }
const height = 260 - margin.top - margin.bottom
const width = 200 - margin.left - margin.right

// I'll give you this part!
const container = d3.select('#chart-07')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.year)
  })
  .y(d => {
    return yPositionScale(d.income)
  })

// Read in your data
Promise.all([
  d3.csv(require('../data/middle-class-income.csv')),
  d3.csv(require('../data/middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function

function ready([datapoints, datapointsUSA]) {
  console.log('datapoints is', datapoints)
  console.log('datapointsUSA is', datapointsUSA)

  // We have __ groups of data
  // We want __ SVGs
  const nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      const name = d.key
      const datapoints = d.values

      // What SVG are we in? Let's grab it.
      const svg = d3.select(this)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#944F6B')
        .attr('stroke-width', 2)

      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', 'gray')
        .attr('stroke-width', 2)

      svg
        .append('text')
        .text(name)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle') // center align
        .attr('dy', -10) // move name up
        .style('font-size', '12px')
        .style('fill', '#944F6B')
        .style('font-weight', '600')

      svg
        .append('text')
        .text('USA')
        .attr('x', 20)
        .attr('text-anchor', 'middle') // center align
        .attr('dy', height / 8) // move name up
        .style('font-size', '12px')
        .style('fill', 'gray')

      // Making Axes
      const xAxis = d3
        .axisBottom(xPositionScale)
        .tickFormat(d3.format('d'))
        .ticks(4)
        .tickValues([1980, 1990, 2000, 2010])
        .tickSize(-height)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      const yAxis = d3
        .axisLeft(yPositionScale)
        .tickFormat(function(d) {
          return '$' + d3.format(',')(d)
        })
        .ticks(6)
        .tickValues([5000, 10000, 15000, 20000])
        .tickSize(-width)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      svg
        .selectAll('.tick line')
        .attr('stroke-dasharray', '2 2')
        .style('stroke', '#999999')

      svg.selectAll('.domain').remove()
    })
}
