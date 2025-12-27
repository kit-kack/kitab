import "./style.css";
interface Website {
  el: HTMLLIElement;
  url: string;
  name: string;
  title: string;
  citeEl?: HTMLElement;
  controlBtn?: HTMLButtonElement;
}

const classPrefix = "kitap-bing";

/**
 * 读取Bing搜索结果网站列表
 */
function readBingWebsiteList(): Website[] {
  const list = document.querySelectorAll(
    "#b_content #b_results li.b_algo"
  ) as NodeListOf<HTMLLIElement>;
  const webSiteList: Website[] = [];
  for (const el of list) {
    // 查询website url
    const tptxtEl = el.querySelector("div.tptxt");
    const name = tptxtEl?.querySelector("div.tptt")?.textContent || "";
    const citeEl = tptxtEl?.querySelector("cite") as HTMLElement | undefined;
    const title = el.querySelector("h2 > a")?.textContent || "";
    const url = citeEl?.textContent || "";
    if (url) {
      webSiteList.push({ el, url, name, citeEl, title });
    }
  }
  return webSiteList;
}

function isIgnoreWebsite(website: Website, ignoreList: string[]) {
  return ignoreList.some((ignore) => website.url.includes(ignore));
}

function configureWebsiteOnResume(website: Website) {
  website.el.classList.remove(`${classPrefix}-ignore`);
  if (website.controlBtn && website.controlBtn.textContent === "恢复") {
    website.controlBtn.textContent = "屏蔽";
  }
  let ignoreEl = website.el.firstElementChild as HTMLDivElement | null;
  if (ignoreEl && ignoreEl.className.includes(`${classPrefix}-ignore-title`)) {
    // 已有元素，则移除该元素
    ignoreEl.remove();
    return;
  }
}

function configureWebsiteOnIgnore(website: Website) {
  website.el.classList.add(`${classPrefix}-ignore`);
  if (website.controlBtn && website.controlBtn.textContent === "屏蔽") {
    website.controlBtn.textContent = "恢复";
  }
  // 插入元素
  let ignoreEl = website.el.firstElementChild as HTMLDivElement | null;
  if (ignoreEl && ignoreEl.className.includes(`${classPrefix}-ignore-title`)) {
    // 已有元素
    return;
  }
  // 不存在元素，新建一个插入
  ignoreEl = document.createElement("div") as HTMLDivElement;
  ignoreEl.className = `${classPrefix}-ignore-title`;
  ignoreEl.textContent = "🔍" + website.title + " on " + website.url;
  website.el.insertBefore(ignoreEl, website.el.firstChild);
  ignoreEl.onclick = () => {
    // 控制展开
    website.el.classList.toggle(`${classPrefix}-open`);
  };
}

function resolveBaseUrl(url: string) {
  // Bing格式如下: http://xxxx.com > dfd > dfdfdf
  const index = url.indexOf(" ");
  if (index > 0) {
    return url.slice(0, index);
  }
  return url;
}

function changeIgnoreList(
  ignoreList: string[],
  baseUrl: string,
  ignore: boolean
) {
  const index = ignoreList.indexOf(baseUrl);
  if (ignore) {
    if (index !== -1) {
      return;
    }
    ignoreList.push(baseUrl);
  } else {
    if (index === -1) {
      return;
    }
    ignoreList.splice(index, 1);
  }
  // 更新
  storage.setItem("local:ignoreList", ignoreList);
}

function controlWebSiteList(
  webSiteList: Website[],
  ignoreList: string[],
  first: boolean
) {
  for (const website of webSiteList) {
    const isIgnore = isIgnoreWebsite(website, ignoreList);
    if (isIgnore) {
      configureWebsiteOnIgnore(website);
    } else if (!first) {
      configureWebsiteOnResume(website);
    }
    // 设置屏蔽按钮
    if (!website.citeEl || !first) {
      continue;
    }
    if (
      website.citeEl!!.nextElementSibling &&
      website.citeEl!!.nextElementSibling.classList.contains(
        `${classPrefix}-control`
      )
    ) {
      // 已经有按钮，跳过
      continue;
    }
    const btn = document.createElement("button");
    btn.className = `${classPrefix}-control`;
    btn.textContent = isIgnore ? "恢复" : "屏蔽";
    btn.onclick = (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      // 切换屏蔽状态
      const isNewIgnore = website.el.classList.toggle(`${classPrefix}-ignore`);
      // 切换按钮文本
      btn.textContent = isNewIgnore ? "恢复" : "屏蔽";
      if (isNewIgnore) {
        configureWebsiteOnIgnore(website);
      } else {
        configureWebsiteOnResume(website);
      }
      // 解析url
      const baseUrl = resolveBaseUrl(website.url);
      changeIgnoreList(ignoreList, baseUrl, isNewIgnore);
      // 触发当前页面下的所有同网站变动
      const sameWebsiteList = webSiteList.filter((web) =>
        web.url.includes(baseUrl)
      );
      controlWebSiteList(sameWebsiteList, ignoreList, false);
    };
    website.controlBtn = btn;
    website.citeEl!!.parentElement!!.appendChild(btn);
  }
}

export default defineContentScript({
  matches: ["https://*.bing.com/search*"],
  async main(ctx) {
    const action = async () => {
      // 获取Bing搜索结果网站列表
      const webSiteList = readBingWebsiteList();
      if (webSiteList.length === 0) {
        return;
      }
      // 获取忽略黑名单列表
      const ignoreList = await storage.getItem<string[]>("local:ignoreList", {
        fallback: [],
      });
      controlWebSiteList(webSiteList, ignoreList, true);
    };

    const observer = new MutationObserver(action);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    ctx.onInvalidated(() => {
      observer.disconnect();
    });
  },
});
