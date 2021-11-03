let fetchData = async () => {
    //I've handily uploaded the data to this site for easy reference.
    let url = "https://api.myjson.com/bins/cgbm8";
    //'fetch()' returns a promise
    let response = await fetch(url);
    //'json()' also returns a promise
    return response.json();
};

Number.prototype.round = function (decimals) {
return Number((Math.round(this + "e" + decimals) + "e-" + decimals));
};

const width = 800;
const height = 500;
const svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.append('g');


const projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]) // translate to center of screen
    .scale([1000]); // scale things down so see entire US

const path = d3.geoPath().projection(projection);

//import the csv data 
//const idata = d3.csv("data_aggregation.csv");

//create tooltip
const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    


//d3.csv("data_aggregation.csv", function(data) {
//var percent = 'inventor_percent'

//set colors 
// lowColor = '#EBF5FB';
// highColor = '#2874A6';

// var ramp = d3.scaleLinear()
//     .domain([min,max])
//     .range([lowColor,highColor]);

d3.json("https://gist.githubusercontent.com/Bradleykingz/3aa5206b6819a3c38b5d73cb814ed470/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json", function(error, uState) {
if (error) throw error;
_(uState.features)
.keyBy('properties.name')
//.merge(_.keyBy(data, 'state'))
.values()
.value();

 svg.selectAll('path')
    .data(uState.features)
    .enter()
    .append('path')
    .attr("d", path)
    .style('transition', "all 0.2s ease-in-out")
    .attr('class', 'state')
    // .style("fill", function(d) { 
    //     return ramp(d[percent]);
    // })

    //adding hover interactions
    .on('mousemove', function (d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);

        tooltip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")
            //.text(()=> `${d.state}: ${(d[percent])}%; \n\n Total: ${(d.inventor_count)}`)
            
    })

    //see this
    .on("mouseover", function (d) {
        d3.select(this)
            //.style("fill", tinycolor(ramp(d[percent])).darken(25).toString())
            .style("cursor", "pointer")
    })

    .on("mouseout", function (d, i) {
        d3.select(this).style("fill", function (d) {
            //return ramp(d[percent]);
        });
        tooltip.transition()
            .duration(500)
            .style("opacity", 0)
        // d3.selectAll(".label")
        //      .text("")
    //});
    });

//state abbr
svg.selectAll("text")
    .data(uState.features)
    .enter()
    .append("svg:text")
    .text(function(d){
        return d.state_abbr;
    })
    .attr("x", function(d){
        return path.centroid(d)[0];
    })
    .attr("y", function(d){
        return  path.centroid(d)[1];
    })
    .attr("text-anchor","middle")
    .attr('font-size','5pt')
    .attr('color','darkgray')})