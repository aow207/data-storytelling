import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 150, right: 0, bottom: 0 }

const height = 600 - margin.top - margin.bottom
const width = 1200 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoAlbersUsa()
const path = d3.geoPath().projection(projection)

const colorScale = d3.scaleOrdinal(d3.schemeSet3)
const radiusScale = d3.scaleSqrt().range([0, 0.2])

Promise.all([
  d3.json(require('/data/us_states.topojson')),
  d3.csv(require('/data/powerplants.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  console.log(json)
  const states = topojson.feature(json, json.objects.us_states)

  // States
  svg
    .selectAll('path')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'lightgray')
    .attr('stroke', 'white')

  // Text
  svg
    .selectAll('text')
    .data(states.features)
    .enter()
    .append('text')
    .attr('class', 'label')
    .text(function(d) {
      return d.properties.abbrev
    })
    .attr('transform', function(d) {
      return `translate(${path.centroid(d)})`
    })
    .style('font-size', 10)
    .attr('text-anchor', 'middle')
    .attr('dy', function(d) {
      if (d.properties.abbrev === 'D.C.') {
        return 10
      } else {
        return 0
      }
    })
    .attr('dx', function(d) {
      if (d.properties.abbrev === 'D.C.') {
        return 10
      } else if (d.properties.abbrev === 'DE') {
        return 10
      } else {
        return 0
      }
    })
    .style(
      'text-shadow',
      '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
    )

  // Circles
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d.Total_MW))
    .attr('fill', d => colorScale(d.PrimSource))
    .attr('opacity', 0.5)
    .attr('transform', function(d) {
      const coords = [d.Longitude, d.Latitude]
      return `translate(${projection(coords)})`
    })

  const nested = d3
    .nest()
    .key(d => d.PrimSource)
    .entries(datapoints)

  // Legend
  const legend = svg.append('g').attr('transform', 'translate(-100, 100)')

  legend
    .selectAll('.legend')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0,${i * 30})`)
    .attr('class', 'legend')
    .each(function(d) {
      const g = d3.select(this)

      g.append('circle')
        .attr('r', 10)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', colorScale(d.key))

      g.append('text')
        .text(d.key.charAt(0).toUpperCase() + d.key.slice(1))
        .attr('dx', 15)
        .style('font-weight', 200)
        .attr('alignment-baseline', 'middle')
    })
}
