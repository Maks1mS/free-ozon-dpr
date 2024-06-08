import map from "./map";
import { Overlay } from "ol";
import QRCode from "qrcode";
import { el } from "./utils";
import { toLonLat } from "ol/proj";

const container = el("popup");
const closer = el("popup-closer");

const popupName = el("popup-name");
const popupAddress = el("popup-address");
const popupLink = el("popup-link");
const popupCanvas = el("popup-canvas");
const popupSource = el("popup-source");
const popupOperationTime = el("popup-operation-time");

const overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

map.addOverlay(overlay);

function close() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
}

function onClick(event) {
  const feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
    return feature;
  });

  if (!feature) return close();

  const coordinates = feature.getGeometry().getCoordinates();

  const [lon, lat] = toLonLat(coordinates);

  popupName.textContent = feature.get("name");
  popupAddress.textContent = feature.get("address");
  popupAddress.href = `https://yandex.ru/maps/?whatshere[point]=${lon},${lat}&whatshere[zoom]=18&l=map`
  popupLink.href = feature.get("link");
  popupSource.href = feature.get("source");
  popupOperationTime.innerHTML = feature.get("operationTime") ?? "неизвестно";

  QRCode.toCanvas(popupCanvas, feature.get("link"), function (error) {
    if (error) console.error(error);
    console.log("success!");
  });

  overlay.setPosition(coordinates);
}

closer.addEventListener("click", close);
map.on("singleclick", onClick);
