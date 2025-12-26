"use client"

import React from "react";
import { formatNumberVN } from "../../../../../lib/format";

type Props = {
  value?: string | number | null;
  onChange: (raw: string) => void;
  placeholder?: string;
  className?: string;
};

function findCaretPos(formatted: string, digitsBefore: number) {
  if (!formatted) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/[0-9]/.test(formatted[i])) count++;
    if (count === digitsBefore) return i + 1;
  }
  return formatted.length;
}

export default function MoneyInput({ value, onChange, placeholder, className }: Props) {
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef<HTMLInputElement | null>(null);

  const display = typeof value === 'number' ? (value != null ? formatNumberVN(Number(value)) : '') : (value ? String(value) : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target as HTMLInputElement;
    const sel = typeof el.selectionStart === 'number' ? el.selectionStart : el.value.length;
    const raw = String(el.value).replace(/[^0-9]/g, '');
    onChange(raw);
    const digitsBefore = (el.value.slice(0, sel).match(/\d/g) || []).length;
    const formatted = raw ? formatNumberVN(Number(raw)) : '';
    setTimeout(() => {
      try {
        const pos = findCaretPos(formatted, digitsBefore);
        if (ref.current) ref.current.setSelectionRange(pos, pos);
      } catch (err) {}
    }, 0);
  };

  return (
    <input
      ref={ref}
      inputMode="numeric"
      className={className}
      placeholder={placeholder}
      value={focused ? (typeof value === 'number' ? (value != null ? String(value) : '') : (value || '')) : display}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={handleChange}
    />
  );
}
