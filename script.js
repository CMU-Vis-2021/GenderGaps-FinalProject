let fetchData = async () => {
  //I've handily uploaded the data to this site for easy reference.
  let url = "https://api.myjson.com/bins/cgbm8"
  //'fetch()' returns a promise
  let response = await fetch(url)
  //'json()' also returns a promise
  return response.json()
}

var map_update = false;
// scroll detect 
var lastScrollTop = 0;

// map size
const width = 800
const height = 500
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")

const projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2]) // translate to center of screen
  .scale([1000]) // scale things down so see entire US

const path = d3.geoPath().projection(projection)

//create tooltip
const tooltip = d3
  .select("#chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)

d3.csv("bystate_fromcz_avgs.csv", function (data) {
  //grab the variable theil index - used to measure economic inequality
  var theil = "cs_race_theil_2000"
  var gdiff = "all_q_dif"

  //set colors - the darker the red, the more inequality there are
  lowColor = "#ffffff"
  highColor = "#c43333"

  //get theil index min and max
  let max = d3.max(data, function (d, i) {
    return d[theil]
  })
  let min = d3.min(data, function (d, i) {
    return d[theil]
  })

  //get gender difference min and max
  let gDiffMax = d3.max(data, function (d, i) {
    return d[gdiff]
  })
  //console.log("gdiff max is: " + gDiffMax)
  let gDiffMin = d3.min(data, function (d, i) {
    return d[gdiff]
  })
  //console.log("gdiff min is: " + gDiffMin)

  //color ramp for thiel index
  var ramp = d3.scaleLinear().domain([min, max]).range([lowColor, highColor])

  //create color ramp for gender difference
  var gDiffRamp = d3
    .scaleLinear()
    .domain([gDiffMin - 0.03, 0, gDiffMax])
    .range(["orange", "white", "steelblue"])

  d3.json(
    "https://gist.githubusercontent.com/Bradleykingz/3aa5206b6819a3c38b5d73cb814ed470/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json",
    function (error, uState) {
      if (error) throw error
      _(uState.features)
        .keyBy("properties.name")
        .merge(_.keyBy(data, "state_id"))
        .values()
        .value()

      //outline the map
      svg
        .selectAll("path")
        .data(uState.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("transition", "all 0.2s ease-in-out")
        .attr("class", "state")
        .style("stroke", "#666666")
        .style("fill", function (d) {
          return ramp(d[theil])
        })

        //adding hover interactions
        .on("mousemove", function (d) {
          tooltip
            .transition()
            .duration(200)
            .style("opacity", 0.9)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px")
            .text(
              () =>
                `${d.state_id}'s Theil Index : ${d[theil]}; Gender Difference : ${d[gdiff]}`
            )
        })

        .on("mouseover", function (d) {
          d3.select(this)
            .style("opacity", 1)
            .style("fill", tinycolor(ramp(d[theil])).darken(25).toString())
            .style("cursor", "pointer")
        })

        .on("mouseout", function (d, i) {
          d3.selectAll(".state").transition().duration(100).style("opacity", 1)
          d3.select(this).style("fill", function (d) {
            return ramp(d[theil])
          })
          tooltip.transition().duration(200).style("opacity", 0)
        })

      //legend
      var w = 100,
        h = 480
      var key = d3
        .select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "legend")

      var legend = key
        .append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad")

      // adding high bound
      legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", highColor)
        .attr("stop-opacity", 1)

      // adding low bound
      legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", lowColor)
        .attr("stop-opacity", 1)

      key
        .append("rect")
        .attr("width", w - 80)
        .attr("height", h + 10)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,10)")

      var y = d3.scaleLinear().range([h, 0]).domain([min, max])
      var ydDiff = d3
        .scaleLinear()
        .range([h, 0])
        .domain([gDiffMin - 0.03, gDiffMax])

      var yAxis = d3.axisRight(y)
      var yAxisgDiff = d3.axisRight(ydDiff)

      key
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(25,10)")
        .call(yAxis)

      //get the correct porportion for population size
      var radius = d3.scaleSqrt().domain([0, 1e6]).range([0, 6])

      function updateMap() {
        if (!map_update){
          map_update = true;
          console.log("updating the map")
        //remove choropleth
        svg
          .transition()
          .duration(300)
          .selectAll(".state")
          .style("fill", "#f5f2f0")
          .style("stroke", "lightgray")

        //adding bubble
        svg
          .append("g")
          .attr("class", "bubble")
          .selectAll("circle")
          .data(uState.features)
          .enter()
          .append("circle")
          .attr("id", "bubblemap")
          .transition()
          .duration(300)
          .attr("transform", function (d) {
            return "translate(" + path.centroid(d) + ")"
          })
          .style("fill", function (d) {
            return gDiffRamp(d[gdiff])
          })
          .attr("stroke", "gray")
          .attr("stroke-width", "0.5px")
          .attr("r", function (d) {
            return radius(d.pop2000)
          })

        // update the legend scale
        // remove the old legend
        d3.selectAll(".legend").remove()

        var w = 100,
          h = 480
        var key = d3
          .select("#chart")
          .append("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("class", "legend")

        var legend = key
          .append("defs")
          .append("svg:linearGradient")
          .attr("id", "gradient")
          .attr("x1", "100%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "100%")
          .attr("spreadMethod", "reflect")

        // adding high bound
        legend
          .append("stop")
          .attr("class", "start")
          .attr("offset", "0%")
          //.attr("stop-color",gDiffRamp(gDiffMax))
          .attr("stop-color", "steelblue")
          .attr("stop-opacity", 1)

        // adding middle point
        legend
          .append("stop")
          .attr("offset", "50%")
          .attr("stop-color", "white")
          .attr("stop-opacity", 1)

        // adding low bound
        legend
          .append("stop")
          .attr("class", "end")
          .attr("offset", "100%")
          .attr("stop-color", "orange")
          //.attr("stop-color", gDiffRamp(gDiffMin - 0.001))
          .attr("stop-opacity", 1)

        // legend
        //   .append("text")
        //   .attr("text-anchor","middle")
        //   .attr('font-size','10pt')
        //   .attr('color','darkgray')
        //   .text("gender difference")

        key
          .append("rect")
          .attr("width", w - 80)
          .attr("height", h + 10)
          .style("fill", "url(#gradient)")
          .attr("transform", "translate(0,0)")

        key
          .append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(25,0)")
          .call(yAxisgDiff)

        } 
      }
      function revertMap(){
        // update the legend scale
        // remove the old legend
        map_update = false
        d3.selectAll(".legend").remove()

        // remove the bubbles
        d3.selectAll("#bubblemap").remove()

        // revert the legend
        var w = 100,
        h = 480
      var key = d3
        .select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "legend")

      var legend = key
        .append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad")

      // adding high bound
      legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", highColor)
        .attr("stop-opacity", 1)

      // adding low bound
      legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", lowColor)
        .attr("stop-opacity", 1)

      key
        .append("rect")
        .attr("width", w - 80)
        .attr("height", h + 10)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,10)")

      key
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(25,10)")
        .call(yAxis)

      svg
        .style("transition", "all 0.2s ease-in-out")
        .selectAll(".state")
        .style("stroke", "#666666")
        .style("fill", function (d) {
          return ramp(d[theil])
        })

      }

      document.getElementById("map_text").addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
        var st = window.pageYOffset || document.getElementById("map_text").scrollTop
        if (st > lastScrollTop){
           // downscroll code
           updateMap();
           console.log("down");
        } else {
           // upscroll code
           revertMap();
           console.log("up")
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
     }, false);

    }
  )
})

// //line chart
// //code from https://www.d3-graph-gallery.com/graph/line_basic.html
//     // set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 30, left: 60 },
  Lwidth = 1000 - margin.left - margin.right,
  Lheight = 600 - margin.top - margin.bottom

// // append the svg object to the body of the page
var Lsvg = d3
  .select("#linechart")
  .append("svg")
  .attr("width", Lwidth + margin.left + margin.right)
  .attr("height", Lheight + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var labelx = "Parent Income Percentile"

var L2svg = d3
  .select("#scatterplot2")
  .append("svg")
  .attr("width", Lwidth + margin.left + margin.right)
  .attr("height", Lheight + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// //Read the data
d3.csv("gender_nat.csv", function (data) {
  // // Add X axis
  var x = d3.scaleLinear().domain([0, 100]).range([0, Lwidth])
  Lsvg.append("g")
    .attr("transform", "translate(0," + Lheight + ")")
    .call(d3.axisBottom(x))

  // // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.w2wages_30_m
      }),
    ])
    .range([Lheight, 0])
  Lsvg.append("g").call(d3.axisLeft(y))

  // // Add the line
  // Lsvg.append("path")
  //   .datum(data)
  //   .style("fill", "none")
  //   .style("stroke", "steelblue")
  //   .style("stroke-width", 2)
  //   .attr(
  //     "d",
  //     d3
  //       .line()
  //       .x(function (d) {
  //         return x(d.par_pctile)
  //       })
  //       .y(function (d) {
  //         return y(d.w2wages_30_m)
  //       })
  //   )

  // Lsvg.append("path")
  //   .datum(data)
  //   .style("fill", "none")
  //   .style("stroke", "pink")
  //   .style("stroke-width", 2)
  //   .attr(
  //     "d",
  //     d3
  //       .line()
  //       .x(function (d) {
  //         return x(d.par_pctile)
  //       })
  //       .y(function (d) {
  //         return y(d.w2wages_30_f)
  //       })
  //   )

  // Add the scatterplot

  //female dots added
  Lsvg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", "pink")
    .attr("r", 3.5)
    .attr("cx", function (d) {
      return x(d.par_pctile)
    })
    .attr("cy", function (d) {
      return y(d.w2wages_30_f)
    })

  //male dots added
  Lsvg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", "blue")
    .attr("r", 3.5)
    .attr("cx", function (d) {
      return x(d.par_pctile)
    })
    .attr("cy", function (d) {
      return y(d.w2wages_30_m)
    })

  //x axis label
  Lsvg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", Lwidth - 110)
    .attr("y", Lheight + 30)
    .text("Parent Income Percentile")

  //y-axis label
  Lsvg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -60)
    .attr("x", -120)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Wages")

  //chart title label
  Lsvg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("y", Lheight - 560)
    .attr("x", Lwidth - 190)
    .text(
      "Average Wages of 30 year olds from Varying Parent Income Percentiles"
    )

  //make key
  Lsvg.append("circle")
    .attr("cx", 20)
    .attr("cy", -20)
    .attr("r", 6)
    .style("fill", "blue")

  Lsvg.append("circle")
    .attr("cx", 20)
    .attr("cy", 10)
    .attr("r", 6)
    .style("fill", "pink")

  Lsvg.append("text")
    .attr("x", 40)
    .attr("y", -20)
    .text("Male")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")

  Lsvg.append("text")
    .attr("x", 40)
    .attr("y", 10)
    .text("Female")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")

  //scatterplot 2
  // // Add X axis
  var x2 = d3.scaleLinear().domain([0, 100]).range([0, Lwidth])
  L2svg.append("g")
    .attr("transform", "translate(0," + Lheight + ")")
    .call(d3.axisBottom(x2))

  // // Add Y axis
  var y2 = d3
    .scaleLinear()
    .domain([
      0.5,
      d3.max(data, function (d) {
        return +d.w2_pos_30_m
      }),
    ])
    .range([Lheight, 0])
  L2svg.append("g").call(d3.axisLeft(y2))

  // Add the scatterplot

  //female dots added
  L2svg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", "pink")
    .attr("r", 3.5)
    .attr("cx", function (d) {
      return x2(d.par_pctile)
    })
    .attr("cy", function (d) {
      return y2(d.w2_pos_30_f)
    })

  //male dots added
  L2svg.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", "blue")
    .attr("r", 3.5)
    .attr("cx", function (d) {
      return x2(d.par_pctile)
    })
    .attr("cy", function (d) {
      return y2(d.w2_pos_30_m)
    })

  //x axis label
  L2svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", Lwidth - 110)
    .attr("y", Lheight + 30)
    .text("Parent Income Percentile")

  //y-axis label
  L2svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -60)
    .attr("x", -120)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Percent(decimal) employed")

  //chart title label
  L2svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("y", Lheight - 560)
    .attr("x", Lwidth - 190)
    .text(
      "Percent Employed of 30 year olds from Varying Parent Income Percentiles"
    )

  L2svg.append("circle")
    .attr("cx", 20)
    .attr("cy", -20)
    .attr("r", 6)
    .style("fill", "blue")

  L2svg.append("circle")
    .attr("cx", 20)
    .attr("cy", 10)
    .attr("r", 6)
    .style("fill", "pink")

  L2svg.append("text")
    .attr("x", 40)
    .attr("y", -20)
    .text("Male")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")

  L2svg.append("text")
    .attr("x", 40)
    .attr("y", 10)
    .text("Female")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle")
})

// ROB ADDING CIRCLES ----------------------------------------

d3.csv("bystate_fromcz_rounded.csv", function (data) {
  // GET DATA FOR COMPARISON

  // state names
  var state1_name = data[32].state_id
  var state2_name = data[33].state_id

  // state GINI index
  var state1_gini = data[32].gini
  var state2_gini = data[9].gini

  // state HS dropout rate
  var state1_dropout = data[32].dropout_r
  var state2_dropout = data[33].dropout_r

  // state violent crime
  var state1_crime = data[32].crime_violent
  var state2_crime = data[9].crime_violent

  // state single parents
  var state1_single = data[32].cs_fam_wkidsinglemom
  var state2_single = data[9].cs_fam_wkidsinglemom

  // additional variables for new case study
  // employment rate, by sex, for NY and NC, for 1st quintiile of parent incomes

  var state1_m_emp = data[32].w2_pos_30_q1_m
  var state2_m_emp = data[33].w2_pos_30_q1_m

  var state1_f_emp = data[32].w2_pos_30_q1_f
  var state2_f_emp = data[33].w2_pos_30_q1_f

  // fraction of black residents
  var state1_fracB = data[32].cs_race_bla
  var state2_fracB = data[33].cs_race_bla

  // CREATE SCALES FOR CIRCLE COMPARISONS

  // get min and max for each comparision
  var gini = "gini"
  var dropout_r = "dropout_r"
  var crime_violent = "crime_violent"
  var cs_fam_wkidsinglemom = "cs_fam_wkidsinglemom"
  var w2_pos_30_q1_m = "w2_pos_30_q1_m"
  var w2_pos_30_q1_f = "w2_pos_30_q1_f"
  var cs_race_bla = "cs_race_bla"

  // CREATE MIN MAX FOR SCALES

  // employment rate min max is just 0 to 1

  // GINI min max
  let max_gini = d3.max(data, function (d, i) {
    return d[gini]
  })
  let min_gini = d3.min(data, function (d, i) {
    return d[gini]
  })

  // dropout min max
  let max_dropout = d3.max(data, function (d, i) {
    return d[dropout_r]
  })
  let min_dropout = d3.min(data, function (d, i) {
    return d[dropout_r]
  })

  // violent crime min max
  let max_crime_violent = d3.max(data, function (d, i) {
    return d[crime_violent]
  })
  let min_crime_violent = d3.min(data, function (d, i) {
    return d[crime_violent]
  })

  // single parent families min max
  let max_cs_fam_wkidsinglemom = d3.max(data, function (d, i) {
    return d[cs_fam_wkidsinglemom]
  })
  let min_cs_fam_wkidsinglemom = d3.min(data, function (d, i) {
    return d[cs_fam_wkidsinglemom]
  })

  // employment rate min max male
  let max_w2_pos_30_q1_m = d3.max(data, function (d, i) {
    return d[w2_pos_30_q1_m]
  })
  let min_w2_pos_30_q1_m = d3.min(data, function (d, i) {
    return d[w2_pos_30_q1_m]
  })

  // employment rate min max female
  let max_w2_pos_30_q1_f = d3.max(data, function (d, i) {
    return d[w2_pos_30_q1_f]
  })
  let min_w2_pos_30_q1_f = d3.min(data, function (d, i) {
    return d[w2_pos_30_q1_f]
  })

  // fraction black residents
  let max_fracB = d3.max(data, function (d, i) {
    return d[cs_race_bla]
  })
  let min_fracB = d3.min(data, function (d, i) {
    return d[cs_race_bla]
  })

  // set scales

  // employment rate scale male
  var scale_circle_emp_m = d3
    .scaleSqrt()
    .domain([min_w2_pos_30_q1_m, max_w2_pos_30_q1_m])
    .range([0, 75])

  // employment rate scale female
  var scale_circle_emp_f = d3
    .scaleSqrt()
    .domain([min_w2_pos_30_q1_f, max_w2_pos_30_q1_f])
    .range([0, 75])

  // alt employment rate scale (for both m and f)
  var scale_circle_emp = d3.scaleSqrt().domain([0, 1]).range([0, 80])

  // fraction of black residents scale
  var scale_circle_fracB = d3
    .scaleSqrt()
    .domain([min_fracB, max_fracB])
    .range([0, 75])

  // gini scale
  var scale_circle_gini = d3
    .scaleSqrt()
    .domain([min_gini, max_gini])
    .range([0, 75])

  // dropout scale
  var scale_circle_dropout = d3
    .scaleSqrt()
    .domain([min_dropout, max_dropout])
    .range([0, 75])

  // violent crime scale
  var scale_circle_crime_violent = d3
    .scaleSqrt()
    .domain([min_crime_violent, max_crime_violent])
    .range([0, 75])

  // single parent scale
  var scale_circle_cs_fam_wkidsinglemom = d3
    .scaleSqrt()
    .domain([min_cs_fam_wkidsinglemom, max_cs_fam_wkidsinglemom])
    .range([0, 75])

  console.log("radii", scale_circle_gini(0.5))

  // DRAWING CIRCLES

  // selecting divs for case study circle comparisons

  var divSelection1 = d3.select("#circles1")
  var divSelection2 = d3.select("#circles2")
  var divSelection3 = d3.select("#circles3")
  var divSelection4 = d3.select("#circles4")

  // add SVGs to all 4 divs
  var svgSelection1 = divSelection1
    .append("svg")
    .attr("width", 600)
    .attr("height", 300)

  var svgSelection2 = divSelection2
    .append("svg")
    .attr("width", 600)
    .attr("height", 300)

  var svgSelection3 = divSelection3
    .append("svg")
    .attr("width", 600)
    .attr("height", 300)

  var svgSelection4 = divSelection4
    .append("svg")
    .attr("width", 600)
    .attr("height", 300)

  // adding circles to the SVGs in each div

  // y locations for two related rows of circles
  var circ_y1 = 75
  var circ_y2 = 225

  var g1 = svgSelection1.append("g").attr("transform", function (d, i) {
    return "translate(0,0)"
  })

  // Employment rate comparison

  // state 1 (NY)
  g1
    // svgSelection1
    // .selectAll("circle")
    // .data(test_radius)
    // .enter()
    .append("circle")
    .attr("cx", 75)
    .attr("cy", circ_y1)
    .attr("r", scale_circle_emp(state1_m_emp))
    .style("fill", "steelblue")
    .append("text")

  g1.append("text")
    .attr("x", 75)
    .attr("y", circ_y1)
    // .attr("stroke", "#fff")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text("NY males")

  var g2 = svgSelection1.append("g").attr("transform", function (d, i) {
    return "translate(0,0)"
  })

  g2
    // svgSelection1
    // .selectAll("circle")
    // .data(test_radius)
    // .enter()
    .append("circle")
    .attr("cx", 225)
    .attr("cy", circ_y1)
    .attr("r", scale_circle_emp(state1_f_emp))
    .style("fill", "steelblue")

  g2.append("text")
    .attr("x", 225)
    .attr("y", circ_y1)
    // .attr("stroke", "#fff")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text("NY Females")

  var g3 = svgSelection1.append("g").attr("transform", function (d, i) {
    return "translate(0,0)"
  })

  // state 2 (NC)
  g3
    // svgSelection1
    // .selectAll("circle")
    // .data(test_radius)
    // .enter()
    .append("circle")
    .attr("cx", 75)
    .attr("cy", circ_y2)
    .attr("r", scale_circle_emp(state2_m_emp))
    .style("fill", "green")
    .append("text")

  g3.append("text")
    .attr("x", 75)
    .attr("y", circ_y2)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text("NC males")

  var g4 = svgSelection1.append("g").attr("transform", function (d, i) {
    return "translate(0,0)"
  })

  g4
    // svgSelection1
    // .selectAll("circle")
    // .data(test_radius)
    // .enter()
    .append("circle")
    .attr("cx", 225)
    .attr("cy", circ_y2)
    .attr("r", scale_circle_emp(state2_f_emp))
    .style("fill", "green")

  g4.append("text")
    .attr("x", 225)
    .attr("y", circ_y2)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text("NC Females")

  // HS dropout comparison
  drop_circle1 = svgSelection2
    // .selectAll("circle")
    // .data(test_radius)
    // .enter()
    .append("circle")
    .attr("cx", 75)
    .attr("cy", 75)
    .attr("r", 15)
    .style("fill", "steelblue")

  drop_circle1
    .transition()
    .duration(2000)
    .attr("r", scale_circle_dropout(state1_dropout))

  drop_circle2 = svgSelection2
    // .selectAll("circle")
    // .data(test_radius)
    // .enter()
    .append("circle")
    .attr("cx", 225)
    .attr("cy", 75)
    .attr("r", 15)
    .style("fill", "green")

  drop_circle2
    .transition()
    .duration(3000)
    .attr("r", scale_circle_dropout(state2_dropout))

  // percentage black population
  race_circle1 = svgSelection3
    // .selectAll("circle")
    // .data(test_radius)
    // .enter()
    .append("circle")
    .attr("cx", 75)
    .attr("cy", 75)
    .attr("r", 15)
    .style("fill", "steelblue")

  race_circle1
    .transition()
    .duration(2000)
    .attr("r", scale_circle_fracB(state1_fracB))

  race_circle2 = svgSelection3
    // .selectAll("circle")
    // .data(test_radius)
    // .enter()
    .append("circle")
    .attr("cx", 225)
    .attr("cy", 75)
    .attr("r", 15)
    .style("fill", "green")

  race_circle2
    .transition()
    .duration(3000)
    .attr("r", scale_circle_fracB(state2_fracB))
})
