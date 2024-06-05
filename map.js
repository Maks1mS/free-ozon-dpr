import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';

const MAP_TARGET = 'map';
const MAP_CENTER = fromLonLat([37.57725139554275, 48.02287702854201]);
const MAP_ZOOM = 8.5;

const customTileSource = new TileLayer({
    source: new XYZ({
        url: 'https://tile-server.ozon.ru/tile/default/{z}/{x}/{y}.png'
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