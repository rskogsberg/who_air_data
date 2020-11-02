import React, { useRef, useEffect, useState, useContext } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear, mouse } from "d3";
import useResizeObserver from "../hooks/useResizeObserver";
import { SelectedCountryContext } from '../context/DataContext';


// function to create data used for cities
function createData(name, pm10, pm2, long, lat) {
  return { name, pm10, pm2, long, lat };
}

function GeoChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const { selectedCountry, setSelectedCountry, cities, setCities } = useContext(SelectedCountryContext);


  //make markers for cities in selected country
  let markers = []
  function makeMarkers(selectedCountry) {
    if (selectedCountry != null){
      for(const city in selectedCountry.properties.Cities) {
        markers.push(createData(city, selectedCountry.properties.Cities[city][0], selectedCountry.properties.Cities[city][1], selectedCountry.properties.Cities[city][2][0], selectedCountry.properties.Cities[city][2][1]));
      }
    } else {
      markers = []
    }
    return markers
  }
  
  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    // set min and max for color change
    const minProp = min(data.features, feature => feature.properties[property]);
    const maxProp = max(data.features, feature => feature.properties[property]);
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "red"]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // create a tooltip
    var Tooltip = select("h2")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .style("color", "black")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("display", "inline")

    var h2 = select("h2")
      .attr("class", "tooltip")
      .style("opacity", 1)
      .style("color", "black")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
      const cityData = d.path[0].__data__
      Tooltip
        .html(cityData.name + "<br />" + "PM10: " + cityData.pm10 + "<br />" + "PM2.5: " + cityData.pm2)
        .style("left", (d.clientX + 10) + "px")
        .style("top", (d.clientY) + "px")
    }
    var mousemove = function(d) {
    }
    var mouseleave = function(d) {
      h2.html("World Map with d3-geo")
    }

    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (event, d) => {
        setSelectedCountry(selectedCountry === d ? null : d);
        setCities(selectedCountry === d ? [] : makeMarkers(selectedCountry));
        mouseleave();
      })
      .attr("class", "country")
      .transition()
      .duration(1000)
      .attr("fill", feature => colorScale(feature.properties[property]))
      .attr("d", feature => pathGenerator(feature))


    // render text
    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        feature =>
          feature &&
          feature.properties.name +
            ": " +
            feature.properties[property].toLocaleString()
      )
      .attr("x", 10)
      .attr("y", 25);

    // show bubbles
    const dots = svg
    .selectAll("circle")
    .data(makeMarkers(selectedCountry))
    .enter()
    .append("circle")
      .attr("class", "country")
      .attr("id", feature =>
      feature && feature.name)
      .attr("cx", feature =>
      typeof feature.long === 'number' ? projection([feature.long, feature.lat])[0] : null )
      .attr("cy", feature => 
      typeof feature.long === 'number' ? projection([feature.long, feature.lat])[1] : null )
      .attr("r", feature =>
      feature &&
      (feature.pm2 * feature.long) / feature.long)
      .style("fill", "red")
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr("fill-opacity", .4)
    .on("click", mouseover)
    .on("dblclick", mouseleave)
  dots.transition()

  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef} id="map" ></svg>
    </div>
  );
}

export default GeoChart;