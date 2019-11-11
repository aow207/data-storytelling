import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 20, left: 20, right: 20, bottom: 20 }
const height = 500 - margin.top - margin.bottom
const width = 1200 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoEqualEarth()

const path = d3.geoPath().projection(projection)
const basicLine = d3.line()

Promise.all([
  d3.json(require('/data/world.topojson')),
  d3.csv(require('/data/flights.csv')),
  d3.csv(require('/data/airport-codes-subset.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

const coordinateStore = d3.map()

function ready([json, flightData, airportData]) {
  // Loop through the city/coordinate data
  // and save the coordinates inside the
  // coordinateStore based on the name
  // later we can do coordinateStore.get('London'), etc
  airportData.forEach(d => {
    const name = d.iata_code
    const coords = [d.longitude, d.latitude]
    coordinateStore.set(name, coords)
  })

  const world = topojson.feature(json, json.objects.countries)
  // console.log('the world is', world)

  // Globe shape
  svg
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('d', path)
    .attr('fill', '#b3d9ff')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)

  // Country Shapes
  svg
    .selectAll('.country')
    .data(world.features)
    .enter()
    .append('path')
    .attr('fill', 'lightgrey')
    .attr('stroke', 'black')
    .attr('d', path)

  // Circle Points
  svg
    .selectAll('.airport')
    .data(airportData)
    .enter()
    .append('circle')
    .attr('class', 'airport')
    .attr('r', 2)
    .attr('fill', 'white')
    .attr('transform', d => {
      const coords = [d.longitude, d.latitude]
      return `translate(${projection(coords)})`
    })

  // Drawing lines

  // JFK
  // Longitude: -73.7787443
  // Latitude: 40.6398262

  svg
    .selectAll('.flight')
    .data(airportData)
    .enter()
    .append('path')
    .attr('d', d => {
      // What is the 'from' city?
      // console.log(d.from)
      // Get the coordinates based on that city's name
      // console.log(coordinateStore.get(d.from))

      // Pull out our coordinates
      const fromCoords = [-73.78, 40.64] // JFK
      const toCoords = coordinateStore.get(d.iata_code)

      // Build a GeoJSON LineString
      const geoLine = {
        type: 'LineString',
        coordinates: [fromCoords, toCoords]
      }

      // Feed that to our d3.geoPath()
      return path(geoLine)
    })
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .attr('stroke-linecap', 'round')
}
