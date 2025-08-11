import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TONES } from "./constants/tones";
import { TEMPLATE_BANK } from "./constants/templates";
import { EMOJIS } from "./constants/emojis";
import { pick, intensify, sprinkleEmojis, formatMessage } from "./utils/helpers";
import { useCopyToClipboard } from "./hooks/useCopyToClipboard";
import { Header } from "./components/Header";
import { ToneSelector } from "./components/ToneSelector";

function App() {
  const [name, setName] = useState("あなた");
  const [msg, setMsg] = useState("");
  const [tone, setTone] = useState("gentle");
  const [heat, setHeat] = useState(3);
  const [emojiOn, setEmojiOn] = useState(true);
  const [history, setHistory] = useState([]);
  const [copyOk, copyToClipboard] = useCopyToClipboard();
  
  const canSend = msg.trim().length > 0;
  const reply = useMemo(() => {
    if (!canSend) return "";
    return formatMessage(
      TEMPLATE_BANK[tone],
      name,
      msg,
      tone,
      heat,
      emojiOn,
      EMOJIS
    );
  }, [name, msg, tone, heat, emojiOn, canSend]);

  function handleSend() {
    if (!canSend) return;
    setHistory((h) => [
      { id: crypto.randomUUID(), in: msg.trim(), out: reply, ts: new Date() },
      ...h,
    ]);
    setMsg("");
  }

  function handleCopy() {
    const text = reply || history[0]?.out || "";
    if (text) copyToClipboard(text);
  }

  function randomizeTone() {
    const keys = TONES.map((t) => t.key);
    const next = pick(keys.filter((k) => k !== tone));
    setTone(next);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Header onRandomizeTone={randomizeTone} />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 bg-white rounded-2xl shadow p-4">
            <label className="block text-sm mb-1">名前（呼びかけ）</label>
            <input
              className="w-full border rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="あなた"
            />
            <label className="block text-sm mb-1">ネガティブなこと、どうぞ</label>
            <textarea
              className="w-full h-28 border rounded-xl px-3 py-2 focus:outline-none focus:ring"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="例：今日は何もできなかった…"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSend();
              }}
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">熱量</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={heat}
                  onChange={(e) => setHeat(Number(e.target.value))}
                />
                <span className="text-xs text-slate-500">{heat}</span>
              </div>

              <ToneSelector tone={tone} onToneChange={setTone} />

              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={emojiOn} 
                  onChange={(e) => setEmojiOn(e.target.checked)} 
                />
                絵文字ブースト
              </label>

              <div className="ml-auto flex gap-2">
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`px-4 py-2 rounded-xl text-white shadow ${
                    canSend ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  送信（⌘/Ctrl+Enter）
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-50"
                >
                  {copyOk ? "✓ コピー済" : "コピー"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-2">即レス</h2>
            <div className="text-xs text-slate-500 mb-2">
              入力すると自動でプレビュー。送信で履歴に追加。
            </div>
            <div className="min-h-[120px]">
              <AnimatePresence mode="wait">
                {reply && (
                  <motion.div
                    key={reply}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="p-3 rounded-xl bg-slate-50 border text-sm"
                  >
                    {reply}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              ※ 医療・専門助言は行いません。つらいときは専門窓口へ。
            </div>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">履歴</h2>
            <button
              onClick={() => setHistory([])}
              className="text-xs px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50"
            >
              クリア
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-sm text-slate-500">まだ履歴はありません。</div>
          ) : (
            <ul className="space-y-3">
              {history.map((h) => (
                <li key={h.id} className="bg-white rounded-2xl shadow p-4">
                  <div className="text-xs text-slate-400 mb-1">
                    {new Date(h.ts).toLocaleString()}
                  </div>
                  <div className="text-sm mb-2">
                    <span className="font-semibold">あなた：</span>
                    {h.in}
                  </div>
                  <div className="text-sm bg-slate-50 border rounded-xl p-3">
                    {h.out}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-10 text-center text-xs text-slate-500">
          © 励まし先生 – ネガティブ反転装置 / これはジョークアプリです。
        </footer>
      </div>
    </div>
  );
}

export default App;
