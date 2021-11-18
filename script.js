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

//create tooltip
const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
d3.csv("bystate_fromcz.csv", function(data) {
    var gradRate = 'gradrate_r';

    //set colors 
    lowColor = '#EBF5FB';
    highColor = '#2874A6';

    //get grad rate min and max
    let max = d3.max(data, function (d, i) {
        return d[gradRate];
    });
    let min = d3.min(data, function (d, i) {
        return d[gradRate];
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
                return ramp(d[gradRate]);
            })

        //adding hover interactions
        .on('mousemove', function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text(()=> `${d.state_id}: ${(d[gradRate])}%`)  
        })

        //see this
        .on("mouseover", function (d) {
            d3.select(this)
                .style("fill", tinycolor(ramp(d[gradRate])).darken(25).toString())
                .style("cursor", "pointer")
        })

        .on("mouseout", function (d, i) {
            d3.select(this).style("fill", function (d) {
                return ramp(d[gradRate]);
            });
            tooltip.transition()
                .duration(500)
                .style("opacity", 0)
            d3.selectAll(".label")
                .text("")
        });

        //state abbr
        svg.selectAll("text")
            .data(uState.features)
            .enter()
            .append("svg:text")
            .text(function(d){
                return d.state_id;
            })
            .attr("x", function(d){
                return path.centroid(d)[0];
            })
            .attr("y", function(d){
                return  path.centroid(d)[1];
            })
            .attr("text-anchor","middle")
            .attr('font-size','5pt')
            .attr('color','darkgray')

        //legend
        var w = 100, h = 300;
        var key = d3.select("body")
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
            .attr("width", w - 75)
            .attr("height", h)
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