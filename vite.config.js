import webfontDownload from 'vite-plugin-webfont-dl';
import { VitePluginRadar } from 'vite-plugin-radar'

export default {
  plugins: [
    webfontDownload(),
    VitePluginRadar({    
      metrica: {
        id: process.env.YANDEX_METRICA_ID
      },
    })
  ],
};