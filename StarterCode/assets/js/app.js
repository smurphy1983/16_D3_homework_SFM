// Creat Visualization size and margins
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

        var svgWidth = window.innerWidth - 200;;
        var svgHeight =  window.innerHeight - 200;

        var margin = {top:20, right:40, bottom:60, left:100};

        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;

        //Create SVG Wrapper
        var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

        //Move wrapper using predefined margins

        var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        //read in data using d3 from csv file

        d3.csv("censusdata.csv").then(function(data) {
            
            //ensure values from data are read as numbers
            data.forEach(function(data) {
                data.id = +data.id;
                data.poverty = +data.poverty;
                data.income = +data.income;
                data.healthcare = +data.healthcare;
                data.obesity = +data.obesity;
                data.smokes = +data.smokes;
            });
            console.log(data);
            //create scales

            var xLinearScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.poverty)-1, d3.max(data, d =>d.poverty)])
                .range([0, width]);
            var yLinearScale = d3.scaleLinear()
                .domain([d3.min(data, d=> d.obesity)-1, d3.max(data, d=> d.obesity)])
                .range([height, 0]);
            
            //create axes
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);
            //add axes to chart

            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);
            
            chartGroup.append("g")
                .call(leftAxis);    

            var items = chartGroup.selectAll("item")
                .data(data)
                .enter()
                .append('g');
            //Create     
                items.append("text")
                .text(data => data.abbr)
                .attr("dx", d => xLinearScale(d.poverty)-6) 
                .attr("dy", d => yLinearScale(d.obesity)+6)
                .style("fill", "blue")
                .style("font", "12px sans-serif")
                .style("font-weight", "bold")
                .classed("fill-text", true);   

            //Creat circles for datapoints
        
                items.append("circle")
                .attr("cx", d => xLinearScale(d.poverty))
                .attr("cy", d => yLinearScale(d.obesity))
                .attr("r", "15")
                .attr("fill", "green")
                .attr("opacity", ".5");
            
            chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Poverty");
        
            chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Obesity");    
        
            


        });


    }
    makeResponsive();

    d3.select(window).on("resize", makeResponsive);

