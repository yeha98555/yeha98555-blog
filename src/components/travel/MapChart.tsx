import React, { memo, useEffect, useState } from "react";
import ReactTooltip from 'react-tooltip'
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography
  // Sphere,
  // Graticule
} from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const colorScale = scaleLinear().domain([1, 10]).range(["#D8E2F6", "#1E40AF"]);

const MapChart = () => {
  const [data, setData] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    csv(`travel.csv`).then((data) => {
      setData(data);
    });
  }, []);

  return (
    <div className="m-auto w-full h-full">
      <ComposableMap
        data-tip=""
        projectionConfig={{
          rotate: [-20, 0, 0],
          scale: 180
        }}
      >
        {/* <Sphere stroke="#E4E5E6" strokeWidth={0.5} /> */}
        {/* <Graticule stroke="#E4E5E6" strokeWidth={0.5} /> */}
        {data.length > 0 && (
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = data.find((s) => s.ISO3 === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d["days"]) : "#DDDDDD"}
                    onMouseEnter={() => {
                      const NAME = geo.properties.name;
                      setContent(`${NAME}`);
                    }}
                    onMouseLeave={() => {
                      setContent("");
                    }}
                    stroke="#FFF"
                    style={{
                      default: { outline: "none" },
                      hover: { fill: d ? "#EC9A29" : "#BEBEBE", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>
      <ReactTooltip effect="float">{content}</ReactTooltip>
    </div>
  );
};

export default memo(MapChart);