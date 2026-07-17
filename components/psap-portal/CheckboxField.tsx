"use client";

export default function CheckboxField({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 hover:border-cyanGlow/30">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-cyanGlow focus:ring-cyanGlow"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-white/45">{hint}</span>}
      </span>
    </label>
  );
}
