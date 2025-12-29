// utils/isIntranetUrl.ts

function isPrivateIp(ip: string): boolean {
  // 处理 IPv4
  if (ip.includes(":")) {
    // IPv6
    const lower = ip.toLowerCase();
    if (lower === "::1") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // fc00::/7
    if (lower.startsWith("fe80:")) return true; // fe80::/10 (简化判断)
    return false;
  }

  // IPv4: 拆分为数字
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;

  const [a, b] = parts;

  // 127.0.0.0/8
  if (a === 127) return true;

  // 10.0.0.0/8
  if (a === 10) return true;

  // 172.16.0.0/12 → 172.16.0.0 ~ 172.31.255.255
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (链路本地)
  if (a === 169 && b === 254) return true;

  return false;
}

function isLocalhost(hostname: string): boolean {
  return hostname.toLowerCase() === "localhost";
}

export function isInternalUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname;

    // 判断是否为 localhost
    if (isLocalhost(hostname)) return true;

    // 尝试判断是否为 IP 地址
    // 简单方法：如果包含非数字和非冒号/点的字符，可能是域名
    if (!/^[0-9.:]+$/.test(hostname)) {
      // 是域名（如 intranet.example.com），无法确定是否内网
      // 默认视为“非内网”或根据需求自定义逻辑（如匹配特定域名）
      return false;
    }

    // 是 IP 地址，判断是否私有
    return isPrivateIp(hostname);
  } catch (e) {
    // 无效 URL
    return false;
  }
}
