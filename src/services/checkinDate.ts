/** Local calendar-day rules for check-ins. No storage, no bridge, so the
 *  dates can be tested without a device.
 *
 *  Brief §7.3 asks the three questions in the present tense ("How is your
 *  energy right now?"), so a check-in records the day it is made. Only the
 *  verdict looks back (§4.3, "How did yesterday land?"), and it is a separate
 *  row with its own date — never the check-in's. */

/** Formats a Date to a local YYYY-MM-DD string. */
export function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's calendar date. */
export function getTodayDateString(referenceDate: Date = new Date()): string {
  return formatDateString(referenceDate);
}

/** The day a standard daily check-in records: the day it is made. */
export function getCheckInDate(referenceDate: Date = new Date()): string {
  return formatDateString(referenceDate);
}

function previousDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return formatDateString(new Date(y, m - 1, d - 1));
}

/** The day a check-in's verdict rates: the day before it. */
export function verdictDateFor(
  checkInDate: string = getCheckInDate(),
): string {
  return previousDay(checkInDate);
}

/** The one editable earlier day: the day before the current check-in's. */
export function editableEarlierDate(
  checkInDate: string = getCheckInDate(),
): string {
  return previousDay(checkInDate);
}
