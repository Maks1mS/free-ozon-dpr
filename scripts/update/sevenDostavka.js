import fs from "node:fs/promises";
import { JSDOM } from "jsdom";

const OUTPUT_FILE = "data/99_sevenDostavka.json";

const linkRegexp = new RegExp(/https:\/\/ozon\.ru\/point\/\d+/);

async function sevenDostavka() {
  const res = await fetch(
    "https://yandex.ru/maps/?from=mapframe&ll=37.686304%2C47.189563&mode=usermaps&source=mapframe&um=constructor%3A3126b0c176a2b846a523a2cd2488869ea2f984ec51bcb43b2807ff27a2de39f4&utm_source=share&z=11",
    {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Host': 'yandex.ru',
        'Pragma': 'no-cache',
        'Referer': 'https://yandex.ru/',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }
  );
  const htmlText = await res.text();

  console.log(htmlText)

  const dom = new JSDOM(htmlText);
  const document = dom.window.document;
  const scripts = document.querySelectorAll("script");

  for (let script of scripts) {
    if (script.textContent.includes("ДОБАВИТЬ ПУНКТ ВЫДАЧИ В ПРИЛОЖЕНИЕ")) {
      let x = script.textContent.split("[\n{\n").pop().split("\n},\n]")[0];

      if (x) {
        const points = new Function(`return [{${x}}]`)();

        fs.writeFile(
          OUTPUT_FILE,
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
                address: point.title,
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

export default sevenDostavka;
