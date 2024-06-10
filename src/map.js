import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { XYZ } from "ol/source";
import { Control, defaults as defaultControls } from "ol/control.js";
// import { createXYZ } from 'ol/tilegrid';
import { showPopup } from "./info-popup.js";

const MAP_TARGET = "map";
const MAP_CENTER = fromLonLat([37.57725139554275, 48.02287702854201]);
const MAP_ZOOM = 8.5;

const customTileSource = new TileLayer({
  source: new XYZ({
    attributionsCollapsible: false,
    attributions: ['&#169; <a href="https://wikimapia.org/">Wikimapia</a>'],
    tileUrlFunction: ([z, x, y]) => {
      const s = (x % 4) + (y % 4) * 4;
      return `https://i${s}.wikimapia.org/?x=${x}&y=${y}&zoom=${z}&type=map&lng=1`;
    },
    maxZoom: 18,
  }),
});

class InfoButton extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement("button");
    button.innerHTML = "i";

    const element = document.createElement("div");
    element.className = "info-button ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", this.showInfo.bind(this), false);
  }

  showInfo() {
    showPopup();
  }
}

export const view = new View({
  center: MAP_CENTER,
  zoom: MAP_ZOOM,
});

const map = new Map({
  controls: defaultControls().extend([new InfoButton()]),
  target: MAP_TARGET,
  layers: [customTileSource],
  view,
});

export default map;
