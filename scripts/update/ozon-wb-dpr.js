import { distance } from "fastest-levenshtein";
import { getFinalURL, getTelegramMessage } from "../utils.js";
import { JSDOM } from "jsdom";
import { asyncMap } from "modern-async";
import fs from "node:fs/promises";

const OUTPUT_FILE = "data/03_ozon-wb-dpr.json";

const MAIN_URL = "https://t.me/ozon_wb_dpr/627";

const QR_FOR_PVZ_STRING = "QR для ПВЗ";

const closestObj = (str, arr, key) => {
  let min_distance = Infinity;
  let min_index = 0;
  for (let i = 0; i < arr.length; i++) {
    const dist = distance(str, arr[i][key]);
    if (dist < min_distance) {
      min_distance = dist;
      min_index = i;
    }
  }
  return arr[min_index];
};

async function getPVZFromPost(post) {
  const message = await getTelegramMessage(post);
  const dom = new JSDOM(message.text);
  const document = dom.window.document;

  const linkElement = document.querySelector(
    'a[href*="vk.cc"],a[href*="ozon.ru"]'
  );

  const link = await getFinalURL(linkElement["href"]).then((u) => {
    const final = new URL(u);
    final.search = "";
    return final.toString();
  });

  return link;
}

async function getFromTelegram() {
  const message = await getTelegramMessage(MAIN_URL);

  const dom = new JSDOM(message.text);
  const document = dom.window.document;

  const links = document.querySelectorAll("a");

  return (
    await asyncMap(links, async (link) => {
      const textContent = link.textContent;

      if (textContent.startsWith(QR_FOR_PVZ_STRING)) {
        const address = textContent.replace(QR_FOR_PVZ_STRING, "").trim();

        let postLink = link["href"];
        // TEMP FIX
        if (address === "г.Донецк, ул.Университетская, 76") {
          postLink = "https://t.me/ozon_wb_dpr/774";
        }

        return {
          name: `ПВЗ ${address}`,
          address,
          link: await getPVZFromPost(postLink),
          operationTime: "пн-вс с 9:00 до 17:45",
        };
      }
    })
  ).filter(Boolean);
}

async function getFromSite() {
  const res = await fetch("https://ozon-wb-dpr.ru/");
  const html = await res.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const scripts = document.querySelectorAll("script");

  for (let script of scripts) {
    if (script.textContent.includes('descr:"Бесплатный озон')) {
      let x = script.textContent.split("[{").pop().split("},]")[0];

      if (x) {
        const points = new Function(`return [{${x}}]`)();
        return points;
      }
    }
  }
}

async function ozonWbDpr() {
  const telegramPoints = await getFromTelegram();
  let points = (await getFromSite()).map((point) => ({
    coordinates: [parseFloat(point["lng"]), parseFloat(point["lat"])],
    name: point.title,
  }));

  points = points.map((point) => {
    const obj = closestObj(point.name, telegramPoints, "name");
    return {
      coordinates: point.coordinates,
      ...obj,
    };
  });

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      {
        name: "ПВЗ ДНР",
        source: MAIN_URL,
        points,
      },
      undefined,
      4
    )
  );
}

export default ozonWbDpr;
