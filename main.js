// map.js

import "ol/ol.css";
import { Map, View } from "ol";
import * as olHas from "ol/has";
import TileLayer from "ol/layer/Tile";
import { OSM, Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";

// Create a polygon feature covering the whole world in EPSG:4326
var worldPolygon = new Feature({
  geometry: new Polygon([
    [
      [-180, -90], // Bottom-left corner
      [180, -90], // Bottom-right corner
      [180, 90], // Top-right corner
      [-180, 90], // Top-left corner
      [-180, -90], // Bottom-left corner
    ],
  ]).transform("EPSG:4326", "EPSG:3857"),
});

// Create a VectorLayer outside the map creation
var vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [worldPolygon],
  }),
  style: new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0)",
    }),
  }),
});

// Create a map and set it to fill the entire screen
var map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer, // Add the external vector layer to the map
  ],
  view: new View({
    center: fromLonLat([2.3522, 48.8566]), // Coordinates for Paris
    zoom: 12,
  }),
});

// Add a 100x100 square hole to the polygon dynamically on vectorLayer postrender
vectorLayer.on("postrender", function (event) {
  const context = event.context;
  const size = map.getSize();

  var height = size[1] * olHas.DEVICE_PIXEL_RATIO,
    width = size[0] * olHas.DEVICE_PIXEL_RATIO;

  var minx = width * 0.25,
    miny = height * 0.25,
    maxx = width * 0.75,
    maxy = height * 0.75;

  // const center = [size[0] / 2, size[1] / 2];
  // const holeSize = 100; // Half of the square size

  context.save();

  context.beginPath();
  // Outside polygon, must be clockwise
  context.moveTo(0, 0);
  context.lineTo(width, 0);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.lineTo(0, 0);
  context.closePath();

  // Inner polygon,must be counter-clockwise
  context.moveTo(minx, miny);
  context.lineTo(minx, maxy);
  context.lineTo(maxx, maxy);
  context.lineTo(maxx, miny);
  context.lineTo(minx, miny);
  context.closePath();

  context.fillStyle = "rgba(0, 5, 25, 0.75)";
  context.fill();

  console.log(minx, miny, maxx, maxy);
  console.log(width, height);
  context.restore();
});
