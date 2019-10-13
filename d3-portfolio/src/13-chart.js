;(function() {
  // Build your SVG here
  // using all of that cut-and-paste magic
  const margin = {
    top: 75,
    right: 50,
    bottom: 75,
    left: 80
  }
  const width = 400 - margin.left - margin.right
  const height = 450 - margin.top - margin.bottom

  const svg = d3
    .select('#chart13')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Scales go here
  const colorScale = d3
    .scaleOrdinal()
    .domain(['dog', 'cat', 'cow'])
    .range(['#BF6360', '#7F170E', '#F6C3CB'])

  // Loading CSV Data
  d3.csv('eating-data.csv')
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    // X axis
    const x = d3
      .scaleLinear()
      .domain([0, 10])
      .range([0, 290])

    svg
      .append('g')
      .attr('transform', 'translate(0,' + 300 + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')

    // Y axis

    const y = d3
      .scaleBand()
      .range([0, 300])
      .domain(
        datapoints
          .map(function(d) {
            return d.name
          })
          .reverse()
      )
    svg.append('g').call(d3.axisLeft(y))

    // Add and style your marks here
    svg
      .selectAll('rect')
      .data(datapoints)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', function(d) {
        return y(d.name)
      })
      .attr('width', function(d) {
        return x(d.hamburgers)
      })
      .attr('height', y.bandwidth())
      .attr('fill', function(d) {
        return colorScale(d.animal)
      })
  }
})()
