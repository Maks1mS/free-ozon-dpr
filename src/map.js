import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';
import { createXYZ } from 'ol/tilegrid';

const MAP_TARGET = 'map';
const MAP_CENTER = fromLonLat([37.57725139554275, 48.02287702854201]);
const MAP_ZOOM = 8.5;

const customTileSource = new TileLayer({
    source: new XYZ({
        // url: 'https://tile-server.ozon.ru/tile/default/{z}/{x}/{y}.png'

        tileUrlFunction: ([z, x, y]) => {
            const s = x % 4 + (y % 4) * 4
            return `https://i${s}.wikimapia.org/?x=${x}&y=${y}&zoom=${z}&type=map&lng=1`
        },
        maxZoom: 18,
    })
});

export const view = new View({
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
})

const map = new Map({
    target: MAP_TARGET,
    layers: [
        customTileSource
    ],
    view,
});

export default map;