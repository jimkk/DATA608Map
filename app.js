import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {GeoJsonLayer, ArcLayer} from 'deck.gl';
import {scaleThreshold} from 'd3-scale';


// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const STATIONS =
'trips_per_year.geojson';
// 'https://raw.githubusercontent.com/jimkk/DATA608Map_Data/master/trips_per_year.geojson';

const INITIAL_VIEW_STATE = {
  latitude: 40.71,
  longitude: -73.99,
  zoom: 11,
  bearing: 0,
  pitch: 30
};

export const COLOR_SCALE = scaleThreshold()
  .domain([100, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 10000000])
  .range([
    [100, 220, 180],
    [127, 205, 187],
    [199, 233, 180],
    [237, 248, 177],
    [225, 255, 204],
    [254, 217, 118],
    [253, 141, 60],
    [252, 78, 42],
    [255, 26, 28],
  ]);

const COLORS = [
  [65, 182, 196],
  [127, 205, 187],
  [127, 205, 187],
  [127, 205, 187],  
  [199, 233, 180],
  [175, 0, 38],
  [175, 0, 38],
  [175, 0, 38],
  [250, 100, 38],
  [250, 0, 38],
  [250, 0, 38],
  [250, 0, 38],
  [250, 0, 38]
];

class Root extends Component {
  _onClick(info) {
    if (info.object) {
      // eslint-disable-next-line
      alert(`Station ID: ${info.object.properties.name}, Count: (${info.object.properties.count})`);
    }
  }

  render() {
    const layers = [
      new GeoJsonLayer({
        id: 'stations',
        data: STATIONS,
        // Styles
        filled: true,
        extruded: true,
        wireframe: false,
        fp64: true,
        opacity: 1,
        getElevation: f => f.properties.count / 100,
        getFillColor: f => COLOR_SCALE(f.properties.count),
        // Interactive props
        pickable: true,
        autoHighlight: true,
        onClick: this._onClick
      })
    ];

    return (
      <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
        <StaticMap mapboxApiAccessToken={MAPBOX_TOKEN} mapStyle="mapbox://styles/mapbox/light-v9" />
      </DeckGL>
    );
  }
}

/* global document */
render(<Root />, document.body.appendChild(document.createElement('div')));
