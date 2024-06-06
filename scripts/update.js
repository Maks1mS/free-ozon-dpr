import fs from "node:fs/promises";
import { asyncMap } from "modern-async";
import { getFinalURL } from "./utils.js";
import ozonWbDpr from "./update/ozon-wb-dpr.js";
import sevenDostavka from "./update/sevenDostavka.js";

async function woyag() {
  const apiResponse = await fetch("https://login.woyag.ru/ajax/pvz-list");
  const json = await apiResponse.json();

  let points = json.filter((point) => !!point.link);

  points = await asyncMap(points, async (point) => {
    const link = await getFinalURL(point.link).then(u => {
        const final = new URL(u);
        final.search = '';
        return final.toString();
    })

    return {
      coordinates: [parseFloat(point["geo_lng"]), parseFloat(point["geo_lat"])],
      name: point.name,
      address: point.address,
      link,
      operationTime: "пн-вс с 9:00 до 17:45",
    };
  });

  await fs.writeFile(
    "data/01_woyag.json",
    JSON.stringify(
      {
        name: "WOЯЖ",
        source: "https://login.woyag.ru/map",
        points,
      },
      undefined,
      4
    )
  );
}

async function main() {
  // await woyag();
  await sevenDostavka();
  // await ozonWbDpr();
}

main();
