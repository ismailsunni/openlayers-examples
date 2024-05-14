// map.js

import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import { getRenderPixel } from "ol/render";

// Create a map and set it to fill the entire screen
var map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([2.3522, 48.8566]), // Coordinates for Paris
    zoom: 12,
  }),
});

// Add a 100x100 square hole to the polygon dynamically on vectorLayer postrender
map
  .getAllLayers()
  .at(0)
  .on("postrender", function (event) {
    const context = event.context;
    const size = map.getSize();
    const [width, height] = size;
    const [minx, miny] = size.map((n) => n * 0.25);
    const [maxx, maxy] = size.map((n) => n * 0.75);

    context.save();
    context.beginPath();
    // Outside polygon, must be clockwise
    context.moveTo(...getRenderPixel(event, [0, 0]));
    context.lineTo(...getRenderPixel(event, [width, 0]));
    context.lineTo(...getRenderPixel(event, [width, height]));
    context.lineTo(...getRenderPixel(event, [0, height]));
    // Inner polygon, must be counter-clockwise
    context.moveTo(...getRenderPixel(event, [minx, miny]));
    context.lineTo(...getRenderPixel(event, [minx, maxy]));
    context.lineTo(...getRenderPixel(event, [maxx, maxy]));
    context.lineTo(...getRenderPixel(event, [maxx, miny]));

    context.closePath();
    context.fillStyle = "rgba(0, 5, 25, 0.75)";
    context.fill();
    context.restore();
  });
