import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

const iconStyle = new Style({
  image: new CircleStyle({
    radius: 8,
    fill: new Fill({
      color: "#c90036",
    }),
    stroke: new Stroke({
      color: "#fff",
      width: 2,
    }),
  }),
});

function createFeatures(places) {
  return places.map((place) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat(place.coordinates)),
      name: `[${place.provider}] ${place.name}`,
      address: place.address,
      link: place.link,
      source: place.source,
      operationTime: place.operationTime,
    });
    feature.setStyle(iconStyle);
    return feature;
  });
}

export { createFeatures };
