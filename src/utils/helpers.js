export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function intensify(text, level) {
  // 熱量(1〜5)に応じて語尾と装飾を強める
  const marks = "!".repeat(Math.max(0, level - 1));
  const booster = ["（無理しない）", "（ぼちぼち）", "（やればできる）", "（全開）", "（神）"][level - 1] || "";
  return `${text}${marks} ${booster}`.trim();
}

export function sprinkleEmojis(text, on, level, emojis) {
  if (!on) return text;
  const n = Math.min(level, 4);
  const chosen = Array.from({ length: n }, () => pick(emojis)).join(" ");
  return `${chosen} ${text} ${chosen}`;
}

export function formatMessage(template, name, msg, tone, heat, emojiOn, emojis) {
  if (!template || !msg.trim()) return "";
  
  const base = pick(template);
  const filled = base
    .replaceAll("{name}", name || "あなた")
    .replaceAll("{msg}", msg.trim());
  const pumped = intensify(filled, heat);
  return sprinkleEmojis(pumped, emojiOn, heat, emojis);
}
