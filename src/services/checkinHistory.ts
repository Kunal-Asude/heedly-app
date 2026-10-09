import HeedlyNative from "@/services/heedlyNative";


export { editableEarlierDate } from "./checkinDate";

export function dayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
}

export async function hasCheckIn(date: string): Promise<boolean> {
  try {
    return (await HeedlyNative.getCheckIn(date)) !== null;
  } catch {
    return false;
  }
}
