// Setting footer year
document.querySelector("footer p span").textContent = new Date().getFullYear();

// Getting Data from API
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(res => res.json())
  .then(data => {
    renderPlot(data);
  });

// Accessing svg element
const svg = d3.select("svg");

// Graph Renderer Function
function renderPlot(dataset) {

  // Setting constant widths
  const width = 800;
  const height = 460;
  const padding = 40;
  const radius = 7;

  // Adding Axis Text for y-azis
  svg.append("text")
    .text("Time in Minute")
    .attr('transform', 'rotate(-90)')
    .attr("x", -height * 0.45)
    .attr("y", padding * 0.45)
    .style("fill", "#f4ebc1");


  /* Scaling X (added one more year at each end
    so that our graph didn't start at the first
    year and don't end at last) */

  const xScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year + 1)]).range([0, width]);

  //Creating xAxis 
  const xAxis = d3.axisBottom(xScale).tickFormat(d => d);

  // Generating xAxis
  svg.append("g")
    .attr("transform", `translate(${1.5*padding},${height - padding/2})`)
    .attr("class", "axis")
    .attr("id", "x-axis")
    .call(xAxis);

  // Scaling Y
  const yScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => d.Seconds), d3.max(dataset, d => d.Seconds)]).range([0, height - padding]);

  // Generating Y axis with tick format of minute and seconds
  const yAxis = d3.axisLeft(yScale).tickFormat(d => {
    const format = parseInt(d / 60) + ":" + (d % 60 === 0 ? "00" : d % 60);
    return format;
  });

  // Generating Y axis
  svg.append("g")
    .attr("transform", `translate(${1.5*padding}, ${padding/2})`)
    .attr("class", "axis")
    .attr("id", "y-axis")
    .call(yAxis);

  // Creating tooltip
  const tooltip = d3.select("body").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .attr("id", "tooltip");

  // Generating the scatter plot
  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => 1.5 * padding + xScale(d.Year))
    .attr("cy", (d, i) => yScale(d.Seconds) + padding / 2)
    .attr("r", radius)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => new Date(1970, 0, 1, 0, d.Time.split(":")[0], d.Time.split(":")[1]))
    .attr("class", "dot")
    .attr("fill", d => {
      return d.Doping ? "#ff6f3c" : "#5eaaa8";
    }).on("mouseover", (event, d) => {
      tooltip.style("opacity", 0.9);
      tooltip.attr("data-year", d.Year);
      tooltip.html(d.Name + ": " + d.Nationality + "</br>" +
        "Year: " + d.Year + ", Time: " + d.Time + "</br>" +
        (d.Doping ? d.Doping : ""));
      tooltip.style("left", (event.pageX + 10) + "px");
      tooltip.style("top", (event.pageY - 28) + "px");
    }).on("mouseout", () => tooltip.style("opacity", 0));


  // Creating a legend
  const legend = svg.append("g").attr("transform", `translate(${width*0.985}, ${height*0.35})`)
    .attr("id", "legend")
    .style("fill", "#f4ebc1");

  // Generating legend color
  legend.append("rect")
    .attr("width", padding * 0.65)
    .attr("height", padding * 0.65)
    .style("fill", "#5eaaa8");

  // Generating legend text
  legend.append("text")
    .text("No doping allegations")
    .attr("x", -4 * padding)
    .attr("y", padding * 0.4);

  // Generating legend color
  legend.append("rect")
    .attr("width", padding * 0.65)
    .attr("height", padding * 0.65)
    .attr("y", padding * 0.85)
    .style("fill", "#ff6f3c");

  // Generating legend text
  legend.append("text")
    .text("Riders with doping allegations")
    .attr("x", -5.45 * padding)
    .attr("y", padding * 1.25)

}