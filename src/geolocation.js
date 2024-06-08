import map, { view } from "./map";
import Feature from "ol/Feature.js";
import Geolocation from "ol/Geolocation.js";
import Point from "ol/geom/Point.js";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";

const geolocation = new Geolocation({
  tracking: true,
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
});

const positionFeature = new Feature();
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: "#3399CC",
      }),
      stroke: new Stroke({
        color: "#fff",
        width: 2,
      }),
    }),
  })
);

const accuracyFeature = new Feature();
geolocation.on("change:accuracyGeometry", function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

geolocation.on("change:position", function () {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
});

new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
});
