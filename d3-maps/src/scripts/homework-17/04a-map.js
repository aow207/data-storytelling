import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 600 - margin.top - margin.bottom
const width = 900 - margin.left - margin.right

const svg = d3
  .select('#chart-4a')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const colorScale = d3.scaleSequential(d3.interpolatePiYG)

const opacityScale = d3
  .scaleLinear()
  .domain([0, 80000])
  .range([0, 1])
  .clamp(true)

const projection = d3.geoAlbersUsa()
const path = d3.geoPath().projection(projection)

d3.json(require('/data/counties_with_election_data.topojson'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  const counties = topojson.feature(json, json.objects.us_counties)

  svg
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('fill', d => {
      // console.log(d)
      // always do d.properties.__

      if (!d.properties.state) {
        return '#eeeeee'
      } else {
        const percent =
          d.properties.trump / (d.properties.trump + d.properties.clinton)
        return colorScale(percent)
      }
    })
    .attr('opacity', d => {
      if (d.properties.state) {
        const votes = d.properties.clinton + d.properties.trump
        return opacityScale(votes)
      }
      return 1
    })
    .attr('stroke', 'none')
}
