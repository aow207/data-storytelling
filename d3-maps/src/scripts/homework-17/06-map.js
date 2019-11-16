import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 300 - margin.top - margin.bottom
const width = 330 - margin.left - margin.right

const container = d3.select('#chart-6')

const projection = d3.geoAlbersUsa()

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#ec913f',
    '#99979a',
    '#c1619c',
    '#2a83c2',
    '#de473a',
    '#51a74c',
    '#d7c54f',
    '#fdeed7'
  ])

const radiusScale = d3
  .scaleSqrt()
  .domain([0, 5000])
  .range([0, 10])

const path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('/data/us_states.topojson')),
  d3.csv(require('/data/powerplants.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  const states = topojson.feature(json, json.objects.us_states)

  projection.fitSize([width, height], states)

  const nested = d3
    .nest()
    .key(d => d.PrimSource)
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .each(function(d) {
      const svg = d3.select(this)
      svg
        .append('g')
        .selectAll('.state')
        .data(states.features)
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', path)
        .attr('fill', '#e1e1e1')

      svg
        .append('g')
        .selectAll('circle')
        .data(d.values)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d.Total_MW))
        .attr('transform', d => {
          const coords = projection([d.Longitude, d.Latitude])
          return `translate(${coords})`
        })
        .attr('fill', d => colorScale(d.PrimSource))
        .attr('opacity', 0.5)

      svg.append('text')
        .text(d.key.charAt(0).toUpperCase() + d.key.slice(1))
        .attr('font-size', 18)
        .attr('y', height / 2)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .style('text-shadow', '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff')
    })
}