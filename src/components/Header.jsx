export function Header({ onRandomizeTone }) {
  return (
    <header className="flex items-baseline justify-between mb-6">
      <h1 className="text-3xl font-bold">
        励まし先生 <span className="text-slate-400 text-base">ver. 適当MAX</span>
      </h1>
      <button
        onClick={onRandomizeTone}
        className="text-sm px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50 shadow"
        title="トーンをシャッフル"
      >
        🎲 トーンおまかせ
      </button>
    </header>
  );
}
