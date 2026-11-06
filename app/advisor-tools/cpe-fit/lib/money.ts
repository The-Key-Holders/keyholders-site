export function money(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function statusClass(status: string): string {
  return status.toLowerCase().replace(/ /g, "-");
}
