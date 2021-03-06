
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = 15;

var circles = d3.range(30).map(function () {
    return {
        x: Math.round(Math.random() * (width - radius * 2) + radius),
        y: Math.round(Math.random() * (height - radius * 2) + radius)
    };
});

var color = d3.scaleOrdinal()
    .range(d3.schemeCategory20);

var voronoi = d3.voronoi()
    .x(function (d) {
        return d.x;
    })
    .y(function (d) {
        return d.y;
    })
    .extent([[-1, -1], [width + 1, height + 1]]);

var circle = svg.selectAll("g")
    .data(circles)
    .enter().append("g")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

var cell = circle.append("path")
    .data(voronoi.polygons(circles))
    .attr("d", renderCell)
    .attr("id", function (d, i) {
        return "cell-" + i;
    });

circle.append("clipPath")
    .attr("id", function (d, i) {
        return "clip-" + i;
    })
    .append("use")
    .attr("xlink:href", function (d, i) {
        return "#cell-" + i;
    });

circle.append("circle")
    .attr("clip-path", function (d, i) {
        return "url(#clip-" + i + ")";
    })
    .attr("cx", function (d) {
        return d.x;
    })
    .attr("cy", function (d) {
        return d.y;
    })
    .attr("r", radius)
    .style("fill", function (d, i) {
        return color(i);
    });

circle.on("click", function(d){
    testClick(d);
});

function testClick(d) {
    console.log("ebanko");
}

function dragstarted(d) {
    d3.select(this).raise().classed("active", true);
}

function dragged(d) {
    d3.select(this).select("circle").attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    cell = cell.data(voronoi.polygons(circles)).attr("d", renderCell);
}

function dragended(d, i) {
    d3.select(this).classed("active", false);
}

function renderCell(d) {
    return d == null ? null : "M" + d.join("L") + "Z";
}