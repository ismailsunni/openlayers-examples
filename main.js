// map.js

import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";

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
  const center = [size[0] / 2, size[1] / 2];
  const holeSize = 50; // Half of the square size

  context.save();
  context.fillStyle = "rgba(0, 0, 255, 0.5)";
  context.strokeStyle = "rgba(0, 0, 0, 1)";
  context.lineWidth = 2;

  context.beginPath();
  context.rect(center[0] - holeSize, center[1] - holeSize, 100, 100);
  context.rect(0, 0, size[0], size[1]);
  context.fill("evenodd");
  context.stroke();

  context.restore();
});
