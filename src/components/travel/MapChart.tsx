import React, { memo, useState } from "react";
import ReactTooltip from 'react-tooltip'
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  // Sphere,
  // Graticule,
  ZoomableGroup
} from "react-simple-maps";
import data from '~/data/travel.json';
import { PlusIcon, MinusIcon, ReloadIcon } from '@radix-ui/react-icons';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const colorScale = scaleLinear().domain([1, 10]).range(["#D8E2F6", "#1E40AF"]);

const initialPosition = { coordinates: [0, 0], zoom: 1 };

const MapChart = () => {
  const [content, setContent] = useState("");
  const [position, setPosition] = useState(initialPosition);

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  const handleMoveEnd = (position) => {
    setPosition(position);
  }

  const handleReset = () => {
    setPosition(initialPosition);
  }

  return (
    <div className="m-auto w-full h-full">
      <ComposableMap
        data-tip=""
        projectionConfig={{
          rotate: [-20, 0, 0],
          scale: 180
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
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
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip effect="float">{content}</ReactTooltip>

      <div className="controls text-center">
        <button type="button" className="p-2 m-5 bg-slate-200 dark:bg-slate-800 rounded-full" onClick={handleZoomIn}>
          <PlusIcon />
        </button>
        -
        <button type="button" className="p-2 m-5 bg-slate-200 dark:bg-slate-800  rounded-full" onClick={handleZoomOut}>
          <MinusIcon />
        </button>
        <button type="button" className="p-2 m-5 bg-slate-200 dark:bg-slate-800  rounded-full" onClick={handleReset}>
          <ReloadIcon />
        </button>
      </div>
    </div>
  );
};

export default memo(MapChart);