import fs from "node:fs/promises";
import { asyncMap } from "modern-async";
import { JSDOM } from "jsdom";
import { getFinalURL } from "./utils.js";

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

const linkRegexp = new RegExp(/https:\/\/ozon\.ru\/point\/\d+/);

async function sevenDostavka() {
  const res = await fetch("https://dostavka.7telecom.ru");
  const htmlText = await res.text();

  const dom = new JSDOM(htmlText);
  const document = dom.window.document;
  const scripts = document.querySelectorAll("script");

  for (let script of scripts) {
    if (script.textContent.includes("ДОБАВИТЬ ПУНКТ ВЫДАЧИ В ПРИЛОЖЕНИЕ")) {
      let x = script.textContent.split("[\n{\n").pop().split("\n},\n]")[0];

      if (x) {
        const points = new Function(`return [{${x}}]`)();

        fs.writeFile(
          "data/99_sevenDostavka.json",
          JSON.stringify(
            {
              name: "7dostavka",
              source: "https://dostavka.7telecom.ru",
              points: points.map((point) => ({
                coordinates: [
                  parseFloat(point["lng"]),
                  parseFloat(point["lat"]),
                ],
                link: linkRegexp.exec(point.descr)[0],
                name: point.title,
                operationTime: "неизвестно",
              })),
            },
            undefined,
            4
          )
        );
      }
    }
  }
}

async function main() {
  await woyag();
  await sevenDostavka();
}

main();
