let fetchData = async () => {
    //I've handily uploaded the data to this site for easy reference.
    let url = "https://api.myjson.com/bins/cgbm8";
    //'fetch()' returns a promise
    let response = await fetch(url);
    //'json()' also returns a promise
    return response.json();
};

// Number.prototype.round = function (decimals) {
// return Number((Math.round(this + "e" + decimals) + "e-" + decimals));
// };

const width = 800;
const height = 500;
const svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g');

const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([1000]); // scale things down so see entire US

const path = d3.geoPath().projection(projection);

//create tooltip
const tooltip = d3.select("#chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
d3.csv("bystate_fromcz_rounded.csv", function(data) {
    //grab the variable theil index - used to measure economic inequality
    var theil = 'cs_race_theil_2000';

    //set colors - the darker the red, the more inequality there are
    lowColor = '#ffffff';
    highColor = '#c43333';

    //get grad rate min and max
    let max = d3.max(data, function (d, i) {
        return d[theil];
    });
    let min = d3.min(data, function (d, i) {
        return d[theil];
    });

    //color ramp
    var ramp = d3.scaleLinear()
        .domain([min,max])
        .range([lowColor,highColor]);

    d3.json("https://gist.githubusercontent.com/Bradleykingz/3aa5206b6819a3c38b5d73cb814ed470/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json", 
        function(error, uState) {
            if (error) throw error;
            _(uState.features)
            .keyBy('properties.name')
            .merge(_.keyBy(data, 'state_id'))
            .values()
            .value();

        svg.selectAll('path')
            .data(uState.features)
            .enter()
            .append('path')
            .attr("d", path)
            .style('transition', "all 0.2s ease-in-out")
            .attr('class', 'state')
            .style("fill", function(d) { 
                return ramp(d[theil]);
            })
        
        //adding graph title
        // svg.append("text")
        //     .attr("x", (width / 2))             
        //     .attr("y", 20)
        //     .attr("text-anchor", "middle")  
        //     .style("font-size", "15px") 
        //     .text("US Economic Inequality Hot Spot - Using Theil Index")

        //adding hover interactions
        .on('mousemove', function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text(()=> `${d.state_id}'s Theil Index : ${(d[theil])}`)  
        })

        .on("mouseover", function (d) {
            d3.select(this)
                .style("opacity", 1)    
                .style("fill", tinycolor(ramp(d[theil])).darken(25).toString())
                .style("cursor", "pointer")
        })

        .on("mouseout", function (d, i) {
            d3.selectAll(".state")
                .transition()
                .duration(100)
                .style("opacity", 1)
            d3.select(this).style("fill", function (d) {
                return ramp(d[theil]);
            });
            tooltip.transition()
                .duration(200)
                .style("opacity", 0)
        });

        //state abbr
        // svg.selectAll("text")
        //     .data(uState.features)
        //     .enter()
        //     .append("svg:text")
        //     .text(function(d){
        //         return d.state_id;
        //     })
        //     .attr("x", function(d){
        //         return path.centroid(d)[0];
        //     })
        //     .attr("y", function(d){
        //         return  path.centroid(d)[1];
        //     })
        //     .attr("text-anchor","middle")
        //     .attr('font-size','6pt')
        //     .attr('color','darkgray')

        //legend
        var w = 100, h = 480;
        var key = d3.select("#chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "legend");

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", highColor)
            .attr("stop-opacity", 1);
            
        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", lowColor)
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w - 80)
            .attr("height", h+20)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([h, 0])
            .domain([min, max]);

        var yAxis = d3.axisRight(y);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(41,10)")
            .call(yAxis)
        });
    });



//line chat 
//code from https://www.d3-graph-gallery.com/graph/line_basic.html
    // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
LineChartwidth = 460 - margin.left - margin.right,
LineChartheight = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var linesvg = d3.select("#linechart")
.append("svg")
.attr("width", LineChartwidth + margin.left + margin.right)
.attr("height", LineChartheight + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("gender_nat.csv", function(data){
// When reading the csv, I must format variables:
// function(d){
// return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
// },

// Add X axis --> it is a date format
var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.par_pctile; }))
  .range([ 0, LineChartwidth ]);
linesvg.append("g")
  .attr("transform", "translate(0," + LineChartheight + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.value;})])
  .range([ LineChartheight, 0 ]);
  linesvg.append("g")
  .call(d3.axisLeft(y));

// Add the line
linesvg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.value) })
    )
})