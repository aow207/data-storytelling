import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

// Create your margins and height/width
const margin = { top: 30, left: 50, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// D3 Tip
String.prototype.toProperCase = function() {
  return this.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}
const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return `<div class='charts'><strong>Song:</strong> <span style='color:white'>${d.Song.toProperCase()}</span><br><strong>Chart Position:</strong> <span style='color:#87C0B0'>${d.Rank}</span></div>`
  })

svg.call(tip)

// Create your scales

const xPositionScale = d3
  .scaleLinear()
  .domain([1983, 2006])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([100, 1])
  .range([height, 0])

// Read in your data
d3.csv(require('../data/madonna.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function

function ready(datapoints) {
  console.log('datapoints is', datapoints)

  // Make chart here
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xPositionScale(d.Year)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.Rank)
    })
    .attr('r', 4)
    .attr('fill', '#87C0B0')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // Title
  svg
    .append('text')
    .attr('x', 0)
    .attr('dx', 100)
    .attr('y', 0 - margin.top / 3)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .style('fill', '#4A555A')
    .text('Madonna Year-End Billboard Chart Rankings')

  svg
    .append('text')
    .attr('x', width)
    .attr('y', height)
    .attr('dy', -2)
    .style('text-anchor', 'end')
    .style('font-size', '10px')
    .text('Year')

  const annotations = [
    {
      note: {
        title: 'Evita',
        label: 'Madonna sang this as Eva Perón in the movie adaptation'
      },
      data: { Year: 1997, Rank: 87 },
      // y: 200,
      // x: 100,
      dx: 80,
      dy: -30,
      color: '#81B0D4'
    }
  ]

  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale(d.Year),
      y: d => yPositionScale(d.Rank)
    })
    .annotations(annotations)

  svg.call(makeAnnotations)

  // Making Axes

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg.selectAll('.y-axis path')

  svg
    .selectAll('.tick line')
    .attr('stroke-dasharray', '2 2')
    .style('stroke', '#999999')
}
