export function formatMoneyAmount(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(amount);
  } catch {
    return `${amount} ${currencyCode}`;
  }
}
