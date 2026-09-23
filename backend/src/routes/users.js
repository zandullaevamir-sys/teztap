import crypto from "crypto";

// Telegram WebApp initData ni tekshirish (rasmiy hujjat bo'yicha)
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
export function verifyTelegramInitData(initData, botToken) {
  if (!initData || typeof initData !== "string" || !botToken) return null;

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  if (!hash) return null;

  urlParams.delete("hash");

  const dataCheckArr = [];
  for (const [key, value] of [...urlParams.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    dataCheckArr.push(`${key}=${value}`);
  }
  const dataCheckString = dataCheckArr.join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (computedHash !== hash) return null;

  const userStr = urlParams.get("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}
