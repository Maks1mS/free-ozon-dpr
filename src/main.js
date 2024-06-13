import "./style.css";

import map from "./map";

import "./info-popup";
import "./popup";
import "./analytics";

import mergedData from "../merged-data.json";
import { createFeatures } from "./features";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

const features = createFeatures(mergedData);
const vectorSource = new VectorSource({
  features,
});
const vectorLayer = new VectorLayer({
  source: vectorSource,
});
map.addLayer(vectorLayer);
