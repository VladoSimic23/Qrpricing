export type SupportedCurrency = "EUR" | "BAM";

export const DEFAULT_EUR_TO_BAM = 1.95583;

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function normalizeCurrency(value?: string | null): SupportedCurrency {
  if (!value) return "EUR";

  const normalized = value.trim().toUpperCase();
  return normalized === "BAM" || normalized === "KM" ? "BAM" : "EUR";
}

export function normalizeExchangeRate(value?: number | null): number {
  if (!value || !Number.isFinite(value) || value <= 0) {
    return DEFAULT_EUR_TO_BAM;
  }

  return value;
}

export function convertPrice(
  amount: number,
  currency: string,
  eurToBamRate: number,
): { eur: number; bam: number } {
  const baseCurrency = normalizeCurrency(currency);
  const normalizedRate = normalizeExchangeRate(eurToBamRate);

  if (baseCurrency === "BAM") {
    const bam = roundTo2(amount);
    const eur = roundTo2(amount / normalizedRate);
    return { eur, bam };
  }

  const eur = roundTo2(amount);
  const bam = roundTo2(amount * normalizedRate);
  return { eur, bam };
}

export function formatPricePair(
  amount: number,
  currency: string,
  eurToBamRate: number,
): string {
  const { eur, bam } = convertPrice(amount, currency, eurToBamRate);
  return `${bam.toFixed(2)} KM / ${eur.toFixed(2)} EUR`;
}

export type SizeVariant = { label: string; price: number };

export function formatItemPriceLabel(
  item: { price: number; currency: string; sizeVariants?: SizeVariant[] },
  eurToBamRate: number,
): string {
  if (item.sizeVariants && item.sizeVariants.length > 0) {
    return item.sizeVariants
      .map(
        (v) =>
          `${v.label}: ${formatPricePair(v.price, item.currency, eurToBamRate)}`,
      )
      .join(" · ");
  }
  return formatPricePair(item.price, item.currency, eurToBamRate);
}
