var inter = setInterval(function() {
    updateScatter();
  }, 5000);
  setTimeout(() => {
    updateScatter()
  }, 2000)

function updateScatter(data){
        console.log("making it into function")
        // Update our scales
        // // Add X axis
    var x = d3.scaleLinear().domain([0, 100]).range([0, Lwidth])
    var xAxis = Lsvg.append("g")
      .attr("transform", "translate(0," + Lheight + ")")
      .call(d3.axisBottom(x))
    // // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        0.5,
        d3.max(data, function (d) {
          return d.w2_pos_30_m
        }),
      ])
      .range([Lheight, 0])
    var yAxis = Lsvg.append("g").call(d3.axisLeft(y))
        // // Update our axes
        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y));
        // Update our circles
        var circles = Lsvg.selectAll("circle")
            .data(data);
        circles.exit().remove()
        console.log("circles removed");
        circles
            .attr("cx", function(d){ return x(d.par_pctile) })
            .attr("cy", function(d){ return y(d.w2_pos_30_m) })
        circles.enter()
            .append("circle")
                .attr("cx", function (d) {return x(d.par_pctile)})
                .attr("cy", function (d) {return y(d.w2_pos_30_f)})
                .attr("r", 3.5)
                .attr("fill", "pink");
          circles.enter()
              .append("circle")
                    .attr("cx", function (d) {return x(d.par_pctile)})
                    .attr("cy", function (d) {return y(d.w2_pos_30_m)})
                    .attr("r", 3.5)
                    .attr("fill", "blue");
        var Lsvg = d3.selectAll.transition().duration(500);
        console.log("made it to the end");
      }