export async function getFinalURL(url) {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
    });
    while (
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.get("location") &&
      new URL(url).hostname !== 'ozon.ru'
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