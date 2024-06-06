import fs from "node:fs/promises";
import { JSDOM } from "jsdom";

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