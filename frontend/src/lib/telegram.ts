// Telegram WebApp SDK bilan ishlash uchun wrapper
declare global {
  interface Window {
    Telegram: any;
  }
}

export function getTelegramWebApp() {
  if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

export function initTelegramApp() {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#0e1726");
    tg.setBackgroundColor("#0e1726");
  }
  return tg;
}

export function getInitData(): string {
  const tg = getTelegramWebApp();
  return tg?.initData || "";
}

export function requestContact(onSuccess: (phone: string) => void) {
  const tg = getTelegramWebApp();
  if (!tg) return;
  tg.requestContact((granted: boolean, contact: any) => {
    if (granted && contact?.responseUnsafe?.contact?.phone_number) {
      onSuccess(contact.responseUnsafe.contact.phone_number);
    }
  });
}

export function showMainButton(text: string, onClick: () => void) {
  const tg = getTelegramWebApp();
  if (!tg) return;
  tg.MainButton.setText(text);
  tg.MainButton.show();
  tg.MainButton.onClick(onClick);
}

export function hideMainButton() {
  const tg = getTelegramWebApp();
  tg?.MainButton?.hide();
}

export function hapticFeedback(style: "light" | "medium" | "heavy" = "light") {
  const tg = getTelegramWebApp();
  tg?.HapticFeedback?.impactOccurred(style);
}
