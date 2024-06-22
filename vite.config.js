import webfontDownload from "vite-plugin-webfont-dl";
import { VitePluginRadar } from "vite-plugin-radar";
import htmlPlugin from "vite-plugin-html-config";
import { viteStaticCopy } from "vite-plugin-static-copy";

const metas = [];
const headScripts = [];

console.log(process.env.YANDEX_METRICA_ID);

if (process.env.YANDEX_VERIFICATION) {
  metas.push({
    name: "yandex-verification",
    content: process.env.YANDEX_VERIFICATION,
  });
}

if (process.env.YANDEX_METRICA_ID) {
  headScripts.push(`window.YANDEX_METRICA_ID=${process.env.YANDEX_METRICA_ID}`);
}

const PUBLIC_URL =
  process.env.PUBLIC_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

if (PUBLIC_URL) {
  metas.push({
    name: "og:url",
    content: "https://" + PUBLIC_URL,
  });
}

export default {
  root: "src",
  build: {
    outDir: "../dist",
  },
  plugins: [
    webfontDownload(),
    VitePluginRadar({
      metrica: {
        id: process.env.YANDEX_METRICA_ID,
      },
    }),
    htmlPlugin({
      metas,
      headScripts,
    }),
    viteStaticCopy({
      targets: [
        {
          src: "../merged-data.json",
          dest: "",
        },
      ],
    }),
  ],
};
