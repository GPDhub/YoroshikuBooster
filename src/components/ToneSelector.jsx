import { TONES } from '../constants/tones';

export function ToneSelector({ tone, onToneChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">トーン</span>
      <select
        className="border rounded-lg px-2 py-1"
        value={tone}
        onChange={(e) => onToneChange(e.target.value)}
      >
        {TONES.map((t) => (
          <option key={t.key} value={t.key}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
