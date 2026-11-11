// Opening hours and pickup slots in the restaurant's own time zone.
import type { Brand } from '../types/brand.js';
import type { PickupWindow, Slot } from '../types/order.js';

const SLOT_MINUTES = 15;

interface LocalDay {
  y: number;
  m: number;
  d: number;
  weekday: number;
  minutes: number;
}

/** Wall-clock parts of `date` in `timeZone`. */
function zoned(date: Date, timeZone: string): LocalDay {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    }).formatToParts(date).map((p) => [p.type, p.value]),
  );
  return {
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday!),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
  };
}

const toMinutes = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** UTC Date for a wall-clock time on the given local day. */
function atLocal({ y, m, d }: LocalDay, minutes: number, timeZone: string): Date {
  const guess = new Date(Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60));
  const offset = zoned(guess, timeZone).minutes - minutes;
  const wrapped = ((offset + 720 + 1440) % 1440) - 720;
  return new Date(guess.getTime() - wrapped * 60_000);
}

export const formatTime = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(date);

export const formatDay = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long', month: 'short', day: 'numeric' }).format(date);

/**
 * Whether the kitchen is taking ASAP orders now, plus quarter-hour pickup
 * slots for today and tomorrow. The last slot is 15 minutes before close.
 */
export function pickupWindow(brand: Brand, now = new Date()): PickupWindow {
  const slots: Slot[] = [];
  const earliest = now.getTime() + brand.prepMinutes * 60_000;
  let openNow = false;
  for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
    const day = zoned(new Date(now.getTime() + dayOffset * 86_400_000), brand.timeZone);
    const [open, close] = brand.hours[day.weekday]!.map(toMinutes) as [number, number];
    if (dayOffset === 0) {
      const local = zoned(now, brand.timeZone).minutes;
      openNow = local >= open && local < close - SLOT_MINUTES;
    }
    const first = Math.ceil((open + brand.prepMinutes) / SLOT_MINUTES) * SLOT_MINUTES;
    for (let t = first; t <= close - SLOT_MINUTES; t += SLOT_MINUTES) {
      const at = atLocal(day, t, brand.timeZone);
      if (at.getTime() >= earliest) slots.push({ at: at.toISOString(), label: `${dayOffset ? 'Tomorrow' : 'Today'}, ${formatTime(at, brand.timeZone)}` });
    }
  }
  return { openNow, asapMinutes: brand.prepMinutes, slots: slots.slice(0, 80) };
}
