import map from "./map";
import { Overlay } from "ol";
import QRCode from "qrcode";
import { el } from "./utils";
import { toLonLat } from "ol/proj";

const popup = el("popup");
const closer = el("popup-closer");

const popupName = el("popup-name");
const popupAddress = el("popup-address");
const popupLink = el("popup-link");
const popupPVZId = el("popup-pvz-id");
const popupCanvas = el("popup-canvas");
const popupSource = el("popup-source");
const popupOperationTime = el("popup-operation-time");


const overlay = new Overlay({
  element: popup,
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


  const pvzId = feature.get("id");

  const link = `https://ozon.ru/point/${pvzId}`;

  popupName.textContent = feature.get("name");
  popupAddress.textContent = feature.get("address");
  popupAddress.href = `https://yandex.ru/maps/?whatshere[point]=${lon},${lat}&whatshere[zoom]=18&l=map`;
  popupLink.href = link;
  popupSource.href = feature.get("source");
  popupOperationTime.innerHTML = feature.get("operationTime") ?? "неизвестно";
  popupPVZId.innerText = pvzId;

  QRCode.toCanvas(popupCanvas, link, function (error) {
    if (error) console.error(error);
  });

  overlay.setPosition(coordinates);
}

closer.addEventListener("click", close);
map.on("singleclick", onClick);
