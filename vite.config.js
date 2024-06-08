import webfontDownload from "vite-plugin-webfont-dl";
import { VitePluginRadar } from "vite-plugin-radar";
import htmlPlugin from 'vite-plugin-html-config'

const metas = []

if (process.env.YANDEX_VERIFICATION) {
  metas.push({
    name: 'yandex-verification',
    content: process.env.YANDEX_VERIFICATION
  })
}

const PUBLIC_URL = process.env.PUBLIC_URL || process.env.VERCEL_URL

if (PUBLIC_URL) {
  metas.push({
    name: 'og:url',
    content: 'https://' + PUBLIC_URL
  })
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
    },)
  ],
};
