/**
 * Guest RSVPs for the demo build, stored only in the guest's own browser.
 *
 * The RSVP form writes here and the confirmation page reads back from here,
 * so personal details never travel in the URL (no history, server logs,
 * analytics or Referer leaks, and a confirmation page can't be faked by
 * editing a link). localStorage is user-editable, so everything read back is
 * validated and anything malformed is ignored.
 *
 * To use a real backend, replace these functions with API calls; the pages
 * only depend on their signatures.
 */

import { z } from 'zod';
import { isDayId } from './wedding-days';

const STORAGE_KEY = 'demo-rsvps-v1';

const storedRsvpSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().nullable(),
  guest_count: z.number().int().min(1).max(10),
  accommodation_needed: z.boolean(),
  days_attending: z.array(z.string().refine(isDayId)).min(1),
  created_at: z.string(),
});

export type StoredRsvp = z.infer<typeof storedRsvpSchema>;

/** All valid saved RSVPs keyed by phone. Corrupt or tampered entries are dropped. */
function readAll(raw: string | null): Record<string, StoredRsvp> {
  let data: unknown;
  try {
    data = JSON.parse(raw ?? '{}');
  } catch {
    return {};
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};

  const valid: Record<string, StoredRsvp> = {};
  for (const [phone, value] of Object.entries(data)) {
    const parsed = storedRsvpSchema.safeParse(value);
    if (parsed.success && parsed.data.phone === phone) valid[phone] = parsed.data;
  }
  return valid;
}

export function hasRsvp(phone: string): boolean {
  return phone in readAll(localStorage.getItem(STORAGE_KEY));
}

/** Throws if storage is unavailable (blocked cookies / full quota). */
export function saveRsvp(rsvp: Omit<StoredRsvp, 'created_at'>): void {
  const all = readAll(localStorage.getItem(STORAGE_KEY));
  all[rsvp.phone] = { ...rsvp, created_at: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/** The most recently submitted RSVP in this browser, or null. */
export function getLatestRsvp(raw: string | null): StoredRsvp | null {
  const all = Object.values(readAll(raw));
  return all.reduce<StoredRsvp | null>((latest, r) => (!latest || r.created_at > latest.created_at ? r : latest), null);
}

/** Raw stored value, for use as a `useSyncExternalStore` snapshot (stable string). */
export function readRawRsvps(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
