import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL, {GeoJsonLayer, ArcLayer} from 'deck.gl';
import {scaleThreshold} from 'd3-scale';


// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const STATIONS =
'https://raw.githubusercontent.com/jimkk/DATA608Map_Data/master/trips_per_year.geojson';
// 'trips_per_year.geojson';

const INITIAL_VIEW_STATE = {
  latitude: 40.71,
  longitude: -73.99,
  zoom: 11.5,
  bearing: 0,
  pitch: 60
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

const elevationScale = {min: 0, max: 5};

class Root extends Component {
  _onClick(info) {
    if (info.object) {
      // eslint-disable-next-line
      alert(`Station ID: ${info.object.properties.name}, Count: (${info.object.properties.count})`);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      elevationScale: elevationScale.min
    };

    this.startAnimationTimer = null;
    this.intervalTimer = null;

    this._startAnimate = this._startAnimate.bind(this);
    this._animateHeight = this._animateHeight.bind(this);
  }

  componentDidMount() {
    this._animate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && this.props.data && nextProps.data.length !== this.props.data.length) {
      this._animate();
    }
  }

  componentWillUnmount() {
    this._stopAnimate();
  }

  _animate() {
    this._stopAnimate();

    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 3000);
  }

  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 50);
  }

  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateHeight() {
    if (this.state.elevationScale >= elevationScale.max) {
      this._stopAnimate();
    } else {
      this.setState({elevationScale: this.state.elevationScale + 0.1});
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
        // elevationRange: f => [0, f.properties.count / 1000],
        elevationScale: this.state.elevationScale,
        getElevation: f => f.properties.count / 200,
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
