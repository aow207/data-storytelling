import * as d3 from 'd3'

const margin = { top: 100, left: 50, right: 150, bottom: 30 }

const height = 700 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%B-%y')

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('/data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  const dates = datapoints.map(d => d.datetime)
  const prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  const nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'country-path')
    .attr('id', d => {
      return d.key.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'country-circ')
    .attr('id', d => {
      return 'circ-' + d.key.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'labels')
    .attr('id', d => {
      return 'label-' + d.key.toLowerCase().replace(/[^a-z]*/g, '')
    })
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('font-size', '12')

  svg
    .append('text')
    .attr('font-size', '24')
    .attr('class', 'title')
    .attr('text-anchor', 'middle')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  const rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('class', 'highlight')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#C2DFFF')
    .lower()

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
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

  // Steps

  // NOTHING IS HERE!!
  d3.select('#no-lines').on('stepin', function() {
    svg.selectAll('.country-path').attr('stroke', 'none')
    svg.selectAll('.country-circ').attr('fill', 'none')
    svg.selectAll('.labels').attr('fill', 'none')
    svg.selectAll('.highlight').attr('fill', 'none')
  })

  // Step 2: In this step, you'll draw all of the lines.
  d3.select('#all-lines').on('stepin', function() {
    svg.selectAll('.country-path').attr('stroke', function(d) {
      return colorScale(d.key)
    })
    svg.selectAll('.country-circ').attr('fill', function(d) {
      return colorScale(d.key)
    })
    svg
      .selectAll('.labels')
      .attr('fill', 'black')
      .style('font-weight', 400)
  })

  // Step 3: Give the "U.S." line a highlight color, bold the text, and and grey out every other line/bubble/text.
  d3.select('#us-line').on('stepin', function() {
    // Gray everything out
    svg.selectAll('.country-path').attr('stroke', 'lightgray')
    svg.selectAll('.country-circ').attr('fill', 'lightgray')
    svg.selectAll('.labels').attr('fill', 'lightgray')

    // Color U.S.
    svg.selectAll('#us').attr('stroke', 'orange')
    svg.selectAll('#circ-us').attr('fill', 'orange')
    svg
      .selectAll('#label-us')
      .attr('fill', 'orange')
      .style('font-weight', 600)
  })

  // Step 4: Highlight the Mountain, Pacific, West South Central, South Atlantic regions (but in a different color than the average).

  d3.select('#regions').on('stepin', function() {
    // Color Regions

    // Mountain
    svg.selectAll('#mountain').attr('stroke', 'lightblue')
    svg.selectAll('#circ-mountain').attr('fill', 'lightblue')
    svg.selectAll('#label-mountain').attr('fill', 'lightblue')

    // Pacific
    svg.selectAll('#pacific').attr('stroke', 'lightblue')
    svg.selectAll('#circ-pacific').attr('fill', 'lightblue')
    svg.selectAll('#label-pacific').attr('fill', 'lightblue')

    // West South Central
    svg.selectAll('#westsouthcentral').attr('stroke', 'lightblue')
    svg.selectAll('#circ-westsouthcentral').attr('fill', 'lightblue')
    svg.selectAll('#label-westsouthcentral').attr('fill', 'lightblue')

    // South Atlantic
    svg.selectAll('#southatlantic').attr('stroke', 'lightblue')
    svg.selectAll('#circ-southatlantic').attr('fill', 'lightblue')
    svg.selectAll('#label-southatlantic').attr('fill', 'lightblue')

    // remove highligh from next section when scrolling back up
    svg.selectAll('.highlight').attr('fill', 'none')
  })

  // Step 5: Finally, draw the rectangle that represents winter.
  d3.select('#winter-rect').on('stepin', function() {
    svg.selectAll('.highlight').attr('fill', '#C2DFFF')
  })

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    // Do you want it to be full height? Pick one of the two below
    const svgHeight = height + margin.top + margin.bottom
    // const svgHeight = window.innerHeight

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    // Update our scale
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Update things you draw

    svg
      .selectAll('.country-path')
      .attr('d', function(d) {
        return line(d.values)
      })
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })

    svg
      .selectAll('.country-circ')
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('.labels')
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('.title')
      .attr('text-anchor', 'middle')
      .text('U.S. housing prices fall in winter')
      .attr('x', newWidth / 2)

    const rectWidth =
      xPositionScale(parseTime('February-17')) -
      xPositionScale(parseTime('November-16'))

    svg
      .selectAll('.highlight')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('width', rectWidth)
      .attr('height', newHeight)
      .lower()

    const xAxis = d3
      .axisBottom(xPositionScale)
      .tickFormat(d3.timeFormat('%b %y'))

    if (svgWidth < 500) {
      xAxis.ticks(4)
    } else if (svgWidth < 550) {
      xAxis.ticks(9)
    } else {
      xAxis.ticks(null)
    }

    // svg
    //   .append('g')
    //   .attr('class', 'axis x-axis')
    //   .attr('transform', 'translate(0,' + newHeight + ')')
    //   .call(xAxis)

    const yAxis = d3.axisLeft(yPositionScale)

    // svg
    //   .append('g')
    //   .attr('class', 'axis y-axis')
    //   .call(yAxis)

    // Update axes
    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
