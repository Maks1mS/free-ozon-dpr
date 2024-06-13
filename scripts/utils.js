import { JSDOM } from "jsdom";

async function resolveVKcc(url) {
  const response = await fetch(url);
  const text = await response.text();

  const match = new RegExp(/value=["']([^"']+)["']/).exec(text);

  if (match && match.length > 1) {
    return match[1];
  } else {
    return;
  }
}

export async function getFinalURL(url) {
  if (url?.startsWith('https://vk.cc')) {
    url = await resolveVKcc(url);
  }

  if (!url) {
    return;
  }

  let response = await fetch(url, {
    method: "HEAD",
    redirect: "manual",
  });
  while (
    response.status >= 300 &&
    response.status < 400 &&
    response.headers.get("location") &&
    !url.startsWith('https://ozon.ru/point/')
  ) {
    url = response.headers.get("location");
    if (!url.startsWith("http")) {
      const baseUrl = new URL(response.url);
      url = `${baseUrl.protocol}//${baseUrl.host}${url}`;
    }
    response = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
    });
  }
  return url;
}

export async function getTelegramMessage(input) {
  const url = new URL(input);

  url.search = "?embed=1&mode=tme";

  const res = await fetch(url);
  const htmlText = await res.text();

  const dom = new JSDOM(htmlText);

  const document = dom.window.document;
  const message = document.querySelector(".tgme_widget_message");

  return {
    text: message.querySelector("div.tgme_widget_message_text.js-message_text")
      .innerHTML,
  };
}

/**
 * Извлекает идентификатор пункта выдачи OZON из ссылки
 * @param {string} url 
 */
export function extractIDFromURL(url) {
  const match = url.match(/https:\/\/ozon\.ru\/point\/([0-9]+)/);
  if (match) {
    return match[1];
  }
  return null;
}