import fs from "node:fs/promises";

import { JSDOM } from "jsdom";
import { asyncMap } from "modern-async";
import { getTelegramMessage } from "../utils.js";
import { collapseWhiteSpace } from "collapse-white-space";

const OUTPUT_FILE = "data/02_global-express.json";
const MAIN_URL = "https://t.me/Mariupol_global_express/1977";

/*
function generateReadableSchedule(schedule) {
  const dayMappings = {
    mon: "Пн",
    tue: "Вт",
    wed: "Ср",
    thu: "Чт",
    fri: "Пт",
    sat: "Сб",
    sun: "Вс",
  };

  let readableSchedule = "";

  Object.keys(dayMappings).forEach((key) => {
    const day = dayMappings[key];
    const daySchedule = schedule[key];

    if (
      daySchedule &&
      daySchedule.open_time !== null &&
      daySchedule.close_time !== null
    ) {
      const openTime = formatTime(daySchedule.open_time);
      const closeTime = formatTime(daySchedule.close_time);
      const breakStart = daySchedule.break_open_time
        ? daySchedule.break_open_time
        : daySchedule.close_time;
      const breakEnd = daySchedule.break_close_time
        ? daySchedule.break_close_time
        : daySchedule.close_time;

      if (breakStart === daySchedule.close_time) {
        readableSchedule += `${day} ${openTime} - ${closeTime}\n`;
      } else {
        const breakStartFormatted = formatTime(breakStart);
        const breakEndFormatted = formatTime(breakEnd);
        readableSchedule += `${day} ${openTime} - ${breakStartFormatted}, ${breakEndFormatted} - ${closeTime}\n`;
      }
    } else {
      readableSchedule += `${day} Выходной\n`;
    }
  });

  return readableSchedule.trim();
}

function formatTime(minutes) {
  if (minutes < 0) return "00:00"; // Время меньше 0, возвращаем 00:00
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${padZero(hours)}:${padZero(mins)}`;
}

function padZero(num) {
  return num.toString().padStart(2, "0");
}
*/

async function getPVZFromPost(post) {
  const message = await getTelegramMessage(post);

  const dom = new JSDOM(message.text);
  const document = dom.window.document;

  // Ищем координаты, которые всегда в скобках, возможно с пробелами
  const coordinatesNode = Array.from(document.querySelectorAll("br"))
    .map((br) => br.nextSibling)
    .find(
      (node) =>
        node &&
        node.nodeType === 3 &&
        /\(\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?\s*\)/.test(node.nodeValue.trim())
    );

  let coordinates = null;
  if (coordinatesNode) {
    const matches = coordinatesNode.nodeValue.trim().match(/\(\s*([^)]*)\s*\)/);
    if (matches) {
      const [lat, lng] = matches[1]
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      coordinates = [lng, lat];
    }
  }

  // Ищем ссылку, которая начинается с https://ozon.ru/point
  const linkNode = document.querySelector('a[href^="https://ozon.ru/point"]');
  const link = linkNode ? linkNode.href : null;

  return {
    coordinates,
    link,
  };
}

async function getFromTelegram() {
  const message = await getTelegramMessage(MAIN_URL);

  const dom = new JSDOM(message.text);
  const document = dom.window.document;

  const addressesSection = Array.from(document.querySelectorAll("b")).find(
    (b) => b.textContent.includes("Наши адреса ПВЗ с OZON")
  );
  const privilegesSection = Array.from(document.querySelectorAll("u")).find(
    (u) => u.textContent.includes("Какие привилегии")
  );

  const links = [];
  let currentElement = addressesSection.nextElementSibling;

  while (currentElement && currentElement !== privilegesSection) {
    if (currentElement.tagName === "A") {
      links.push(currentElement);
    }
    currentElement = currentElement.nextElementSibling;
  }

  const data = await asyncMap(links, async (link) => {
    const textContent = collapseWhiteSpace(
      link.innerHTML.replace(/<br\s*\/?>/gi, " ")
    );
    const pvzData = await getPVZFromPost(link.href);

    return {
      ...pvzData,
      name: textContent,
      address: textContent,
    };
  });

  return data;
}

/*
async function getFromVK() {
  const group_id = 124759560;
  const access_token = "";
  const v = "5.199";

  const res = await fetch(
    `https://api.vk.com/method/groups.getAddresses?group_id=${group_id}&access_token=${access_token}&count=999&v=${v}`,
    {
      headers: {
        "Accept-Language": "ru,en;q=0.9",
      },
    }
  );

  const items = (await res.json()).response.items;

  return items.map((item) => ({
    address: `${item.city.title}, ${item.address}`,
    timetable: item.timetable,
  }));
}
*/

async function globalExpress() {
  const points = await getFromTelegram();
  // const points = await getFromVK();

  fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      {
        name: "Global Express",
        source: MAIN_URL,
        points: points.map((p) => ({
          ...p,
          operationTime: `<a href="https://vk.com/aliexpress___delivery?w=address-124759560_72654">ГРАФИК РАБОТЫ</a>`,
        })),
      },
      undefined,
      4
    )
  );
}

export default globalExpress;
