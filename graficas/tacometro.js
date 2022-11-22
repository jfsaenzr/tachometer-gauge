function tachometerChart(ArraySelector) {

    //valores a ingresar
    var margin =
    {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    },
        selector = ArraySelector,
        width = 350,
        height = 350,
        dispatch,
        dimension,
        group,
        svg,
        filter = null,
        postFilter = null;

    let circley;
    let circlex;
    let circleRadious;
    let datum;
    let miKey;

    let duration = 3000;

    function my(ArraySelector) {
        selector = ArraySelector;
    };

    //metodos
    my.render = function () {

        data = group.all();

        //el dispatch svg
        dispatch.on('redraw.' + selector, function () {

            d3.select('#tachometer').select("svg").selectAll("g").remove();

            data.forEach((d) => {

                datum = d.value;
                miKey = d.key;

                circley = 0;
                circlex = 60 / 2;
                circleRadious = 300 * 0.97 / 2;

                svg = d3.select("#tachometer")
                    .append("svg")
                    .attr("class", "gauge")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform", "translate(" + circlex + "," + circley + ")");

                svg.append("circle")
                    .attr("cx", 200)
                    .attr("cy", 200)
                    .attr("r", circleRadious)
                    .style("fill", "#ccc")
                    .style("stroke", "#000")
                    .style("stroke-width", "0.5px");

                svg.append("circle")
                    .attr("cx", 200)
                    .attr("cy", 200)
                    .attr("r", 0.9 * circleRadious)
                    .style("fill", "#fff")
                    .style("stroke", "#e0e0e0")
                    .style("stroke-width", "2px");

                drawBand(0, 75, "#3CB371");
                drawBand(75, 90, "#FFA500");
                drawBand(90, 100, "#FF4500");

                var fontSize1 = Math.round(circleRadious / 6);

                svg.append("text")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("dy", 150)
                    .attr("dx", 200)
                    .attr("text-anchor", "middle")
                    .text(miKey)
                    .style("font-size", fontSize1 + "px")
                    .style("fill", "#333")
                    .style("stroke-width", "0px");

                var fontSize2 = Math.round(circleRadious / 9);

                var majorDelta = 100 / (5 - 1);

                for (var major = 0; major <= 100; major += majorDelta) {
                    var minorDelta = majorDelta / 5;
                    for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, 100); minor += minorDelta) {
                        var point1 = valueToPoint(minor, 0.75);
                        var point2 = valueToPoint(minor, 0.85);

                        svg.append("line")
                            .attr("x1", point1.x)
                            .attr("y1", point1.y)
                            .attr("x2", point2.x)
                            .attr("y2", point2.y)
                            .style("stroke", "#666")
                            .style("stroke-width", "1px")
                            .attr("transform", function () { return "translate(" + 200 + ", " + 200 + ")" });

                        svg.append("svg:text")
                            .attr("x", point1.x)
                            .attr("y", point1.y)
                            .attr("dy", 200)
                            .attr("dx", 200)
                            .attr("text-anchor", "middle")
                            .text(minor)
                            .style("font-size", 10 + "px")
                            .style("fill", "#333")
                            .style("stroke-width", "0px");
                    }

                    var point1 = valueToPoint(major, 0.7);
                    var point2 = valueToPoint(major, 0.85);

                    svg.append("line")
                        .attr("x1", point1.x)
                        .attr("y1", point1.y)
                        .attr("x2", point2.x)
                        .attr("y2", point2.y)
                        .style("stroke", "#333")
                        .style("stroke-width", "2px")
                        .attr("transform", function () { return "translate(" + 200 + ", " + 200 + ")" });

                    if (major == 0 || major == 100) {
                        var point = valueToPoint(major, 0.63);

                        svg.append("text")
                            .attr('class', 'textoPunto')
                            .attr("x", point.x)
                            .attr("y", point.y)
                            .attr("dy", 200)
                            .attr("dx", 200)
                            .attr("text-anchor", major == 0 ? "start" : "end")
                            .text(major)
                            .style("font-size", fontSize2 + "px")
                            .style("fill", "#333")
                            .style("stroke-width", "0px");
                    }
                }

                let pointerContainer = svg.append("g")
                    .attr("class", "pointerContainer");

                var midValue = (0 + 100) / 2;

                var pointerPath = buildPointerPath(midValue);

                var pointerLine = d3.line()
                    .x(function (d) { return d.x })
                    .y(function (d) { return d.y })
                //.interpolate("basis");

                pointerContainer.selectAll("path")
                    .data([pointerPath])
                    .enter()
                    .append("path")
                    .attr("d", pointerLine)
                    .style("fill", "#dc3912")
                    .style("stroke", "#c63310")
                    .style("fill-opacity", 0.7)
                    .style("cursor", "pointer");

                pointerContainer.append("circle")
                    .attr("cx", 200)
                    .attr("cy", 200)
                    .attr("r", 0.12 * circleRadious)
                    .style("fill", "#4684EE")
                    .style("stroke", "#666")
                    .style("opacity", 1)
                    .style("cursor", "pointer");

                var fontSize3 = Math.round(circleRadious / 6);

                pointerContainer.selectAll("text")
                    .data([d.value])
                    .enter()
                    .append("text")
                    .attr("x", 0)
                    .attr("y", fontSize3 + fontSize3)
                    .attr("dy", 200)
                    .attr("dx", 200)
                    .attr("text-anchor", "middle")
                    .style("font-size", fontSize3 + "px")
                    .style("fill", "#000")
                    .style("stroke-width", "0px")
                    .style("cursor", "pointer");

                pointerContainer
                    .selectAll("text")
                    .text(0)
                    .transition()
                    .duration(duration)
                    .tween("text", function (d) {
                        let i = d3.interpolate(this.textContent, d),
                            prec = (d + "").split("."),
                            round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                        return function (t) {
                            pointerContainer.selectAll("text").text(Math.round(i(t) * round) / round);
                        };
                    });

                redraw(0);
                redraw(datum);

            });

        })

    };

    function redraw(value) {

        pointerContainer = svg.select(".pointerContainer");

        let pointer = pointerContainer.selectAll("path");
        pointer.transition()
            .duration(duration)
            .attrTween("transform", function () {
                let pointerValue = value;
                if (value > 100) pointerValue = 100 + 0.02 * 100;
                else if (value < 0) pointerValue = 0 - 0.02 * 100;
                let targetRotation = (valueToDegrees(pointerValue) - 90);
                let currentRotation = this._currentRotation || targetRotation;
                this._currentRotation = targetRotation;

                return function (step) {
                    let rotation = currentRotation + (targetRotation - currentRotation) * step;
                    return "translate(" + 200 + ", " + 200 + ") rotate(" + rotation + ")";
                }
            });
    }

    buildPointerPath = function (value) {
        var delta = 100 / 13;

        var head = valueToPoint(value, 0.85);
        var head1 = valueToPoint(value - delta, 0.12);
        var head2 = valueToPoint(value + delta, 0.12);

        var tailValue = value - (100 * (1 / (270 / 360)) / 2);
        var tail = valueToPoint(tailValue, 0.28);
        var tail1 = valueToPoint(tailValue - delta, 0.12);
        var tail2 = valueToPoint(tailValue + delta, 0.12);

        return [head, head1, tail2, tail, tail1, head2, head];

        function valueToPoint(value, factor) {
            var point = this.valueToPoint(value, factor);
            point.x -= 0;
            point.y -= 0;
            return point;
        }
    }

    drawBand = function (start, end, color) {
        if (0 >= end - start) return;

        svg.append("path")
            .style("fill", color)
            .attr("d", d3.arc()
                .startAngle(valueToRadians(start))
                .endAngle(valueToRadians(end))
                .innerRadius(0.65 * circleRadious)
                .outerRadius(0.85 * circleRadious))
            .attr("transform", function () { return "translate(" + 200 + ", " + 200 + ") rotate(270)" });
    }

    valueToDegrees = function (value) {
        // thanks @closealert
        //return value / this.config.range * 270 - 45;
        return value / 100 * 270 - (0 / 100 * 270 + 45);
    }

    valueToRadians = function (value) {
        return valueToDegrees(value) * Math.PI / 180;
    }

    valueToPoint = function (value, factor) {
        return {
            x: 0 - circleRadious * factor * Math.cos(valueToRadians(value)),
            y: 0 - circleRadious * factor * Math.sin(valueToRadians(value))
        };
    }


    my.resetAll = function () {

    };

    //getter y settlers
    my.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        return my;
    };

    my.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return my;
    };

    my.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        return my;
    };

    my.selector = function (_) {
        if (!arguments.length) return selector;
        selector = _;
        return my;
    };

    my.dispatch = function (_) {
        if (!arguments.length) return dispatch;
        dispatch = _;
        return my;
    };

    my.dimension = function (_) {
        if (!arguments.length) return dimension;
        dimension = _;
        return my;
    };

    my.group = function (_) {
        if (!arguments.length) return group;
        group = _;
        return my;
    };

    my.postFilter = function (_) {
        if (!arguments.length) return postFilter;
        postFilter = _;
        return my;
    };

    my.valueAccesor = function (_) {
        if (!arguments.length) return valueAccesor;
        valueAccesor = _;
        return my;
    };

    my.filter = function (_) {
        if (!arguments.length) return filter;
        filter = _;
        return my;
    };

    return my;

}