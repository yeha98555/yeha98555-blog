import React, { memo, useState } from "react";
import ReactTooltip from 'react-tooltip'
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  // Sphere,
  // Graticule,
  ZoomableGroup,
} from "react-simple-maps";
import mapData from '~/assets/map.json';
import { PlusIcon, MinusIcon, ReloadIcon } from '@radix-ui/react-icons';

const colorScale = scaleLinear().domain([1, 10]).range(["#D8E2F6", "#1E40AF"]);

const initialPosition = { coordinates: [20, 0] as [number, number], zoom: 1 };

interface Position {
  coordinates: [number, number];
  zoom: number;
};

interface MapChartData {
  ISO3: string;
  days: number;
};

const MapChart = ({ data }: { data: MapChartData[] }) => {
  const [content, setContent] = useState<string>("");
  const [position, setPosition] = useState<Position>(initialPosition);

  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom + 1 }));
  }

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom - 1 }));
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
          <Geographies geography={mapData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = data.find((s) => s.ISO3 === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d.days) : "#DDDDDD"}
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

      <div className="controls text-center text-sm">
        Zoom In/Out: 
        <button type="button" className="p-2 m-3 bg-slate-200 dark:bg-slate-800 rounded-full" onClick={handleZoomOut}>
          <MinusIcon className="w-3 h-3" />
        </button>
        {position.zoom.toFixed(2)}
        <button type="button" className="p-2 m-3 bg-slate-200 dark:bg-slate-800 rounded-full" onClick={handleZoomIn}>
          <PlusIcon className="w-3 h-3" />
        </button>
        <button type="button" className="p-2 m-5 bg-slate-200 dark:bg-slate-800 rounded-full" onClick={handleReset}>
          <ReloadIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default memo(MapChart);