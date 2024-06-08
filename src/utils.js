import { toLonLat } from "ol/proj";
import { getDistance } from "ol/sphere";


export function el(id) {
  return document.getElementById(id);
}

export function removeDuplicatesByRadius(features, radius) {
  const uniqueFeatures = [];
  const coordinatesSet = new Set();

  features.forEach((feature) => {
    const coordinates = feature.getGeometry().getCoordinates();
    const lonLat = toLonLat(coordinates);
    let isDuplicate = false;

    coordinatesSet.forEach((setCoordinates) => {
      if (getDistance(setCoordinates, lonLat) <= radius) {
        isDuplicate = true;
      }
    });

    if (!isDuplicate) {
      uniqueFeatures.push(feature);
      coordinatesSet.add(lonLat);
    }
  });

  return uniqueFeatures;
}

export function removeDuplicatesByUrl(features) {
  const uniqueFeatures = [];
  const urlSet = new Set();

  features.forEach((feature) => {
    let isDuplicate = false;
    const link = feature.get("link");

    if (urlSet.has(link)) {
      isDuplicate = true;
    }

    if (!isDuplicate) {
      uniqueFeatures.push(feature);
      urlSet.add(link);
    }
  });

  return uniqueFeatures;
}