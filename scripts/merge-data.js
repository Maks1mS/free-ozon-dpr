import fs from "node:fs/promises";
import { asyncMap } from "modern-async";
import { getDistance } from "ol/sphere.js";

function removeDuplicatesByUrl(points) {
  const uniquePoints = [];
  const urlSet = new Set();

  points.forEach((points) => {
    let isDuplicate = false;
    const link = points.link;

    if (urlSet.has(link)) {
      isDuplicate = true;
    }

    if (!isDuplicate) {
      uniquePoints.push(points);
      urlSet.add(link);
    }   
  });

  return uniquePoints;
}

function removeDuplicatesByRadius(points, radius) {
    const uniquePoints = [];
    const coordinatesSet = new Set();
  
    points.forEach((point) => {
      const lonLat = point.coordinates;
      let isDuplicate = false;
  
      coordinatesSet.forEach((setCoordinates) => {
        if (getDistance(setCoordinates, lonLat) <= radius) {
          isDuplicate = true;
        }
      });
  
      if (!isDuplicate) {
        uniquePoints.push(point);
        coordinatesSet.add(lonLat);
      }
    });
  
    return uniquePoints;
  }

function convert(data) {
  return data.points.map((p) => ({
    ...p,
    source: data.source,
    provider: data.name,
  }));
}

async function main() {
  const dataDir = await fs.readdir("./data");
  let data = await asyncMap(dataDir, async (filename) => {
    const fileContent = await fs.readFile(`./data/${filename}`);
    const data = JSON.parse(fileContent);
    return convert(data);
  });
  data = data.flatMap((v) => v);
  data = removeDuplicatesByUrl(data);
  data = removeDuplicatesByRadius(data, 10);
  await fs.writeFile("merged-data.json", JSON.stringify(data, undefined, 2));
}

main();
