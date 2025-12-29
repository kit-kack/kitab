export default defineContentScript({
  matches: ["<all_urls>"],
  async main() {
    // 解析当前网站是否存在icopass
    const host = window.location.host;
    if ((await storage.getItem(`local:icofetch-${host}`)) === null) {
      return;
    }
    console.log("icofetch", host);

    // 解析网站ico
    const icoUrl = (
      (document.querySelector('link[rel*="icon"]') ||
        document.querySelector(
          'link[rel*="shortcut"]'
        )) as HTMLLinkElement | null
    )?.href;
    if (icoUrl) {
      // fetch
      const url = new URL(icoUrl, window.location.href).href;
      // 远程请求
      const img = new Image();
      img.src = url;
      img.crossOrigin = "*";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx && ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL();
          // 存入缓存
          storage.setItem(`local:ico-${host}`, base64);
        } catch (_) {}
      };
    }
    // final remove icopass
    storage.removeItem(`local:icofetch-${host}`);
  },
});
