import { ConfigEnv, defineConfig } from "wxt";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  srcDir: "src",
  manifest: {
    permissions: ["storage", "tabs", "activeTab", "browsingData", "scripting"],
    host_permissions: [
      "<all_urls>",
      "https://api.bing.com",
      "http://suggestion.baidu.com",
    ],
  },
  // @ts-ignore
  autoIcons: {
    baseIconPath: __dirname + "/src/assets/icon.svg",
  },
  webExt: {
    chromiumProfile: resolve(".wxt/chrome-data"),
    keepProfileChanges: true,
    startUrls: ["chrome://newtab/"],
  },
  // @ts-ignore
  vite: (env: ConfigEnv) => ({
    plugins: [tailwindcss()],
  }),
});
