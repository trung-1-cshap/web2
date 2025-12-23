export function formatNumberVN(value?: number | string | null) {
  const n = Number(value ?? NaN);
  if (!isFinite(n)) return "-";
  try {
    return n.toLocaleString("vi-VN");
  } catch {
    return String(n);
  }
}

export function formatVND(value?: number | string | null) {
  const s = formatNumberVN(value);
  return s === "-" ? s : `${s} ₫`;
}

export default formatNumberVN;
