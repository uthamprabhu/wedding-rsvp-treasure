import { DUMMY_RSVPS, type RsvpSubmission } from './dummy-rsvps';
import {
  DAY_IDS,
  type DayId,
  formatDays,
  normaliseDays,
} from './wedding-days';

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export interface DayStat {
  id: DayId;
  /** Number of RSVP submissions that include this day. */
  responses: number;
  /** Total head count across those submissions — the catering number. */
  guests: number;
}

export interface DashboardStats {
  totalResponses: number;
  totalGuests: number;
  accommodationNeeded: number;
  averagePartySize: number;
  recentResponses: number; // Last 7 days
  /** Attendance broken down per wedding day, in chronological order. */
  perDay: DayStat[];
}

export interface RsvpWithDetails extends Omit<RsvpSubmission, 'days_attending'> {
  /** Validated + chronologically ordered, never null. */
  days_attending: DayId[];
  formatted_date: string;
  days_attending_labels: string;
}

/** How to combine multiple selected days in the filter. */
export type DayMatchMode = 'any' | 'all';

export type SortBy = 'date_desc' | 'date_asc' | 'name_asc' | 'guests_desc';
export type AccommodationFilter = 'all' | 'yes' | 'no';

export interface RsvpFilters {
  searchTerm?: string;
  accommodationFilter?: AccommodationFilter;
  sortBy?: SortBy;
  /** Empty array means "no day filter". */
  days?: DayId[];
  dayMatchMode?: DayMatchMode;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

function formatDate(value: string | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', DATE_FORMAT);
}

function normaliseRow(row: RsvpSubmission): RsvpWithDetails {
  const days = normaliseDays(row.days_attending);
  return {
    ...row,
    days_attending: days,
    formatted_date: formatDate(row.created_at),
    days_attending_labels: formatDays(days),
  };
}

/* ------------------------------------------------------------------ *
 * Stats
 * ------------------------------------------------------------------ */

/**
 * Aggregate dashboard statistics across *all* responses.
 *
 * Deliberately unfiltered: these are the headline numbers the couple plans
 * catering against, so they must not silently shift when the admin narrows
 * the table below them.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const rows = DUMMY_RSVPS;

  const totalResponses = rows.length;
  const totalGuests = rows.reduce((sum, r) => sum + (r.guest_count ?? 0), 0);
  const accommodationNeeded = rows.filter((r) => r.accommodation_needed).length;
  const averagePartySize = totalResponses > 0 ? totalGuests / totalResponses : 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentResponses = rows.filter((r) => new Date(r.created_at) >= sevenDaysAgo).length;

  // Per-day tallies in a single pass over the rows.
  const counters = new Map<DayId, { responses: number; guests: number }>(
    DAY_IDS.map((id) => [id, { responses: 0, guests: 0 }]),
  );

  for (const row of rows) {
    const guests = row.guest_count ?? 0;
    for (const id of normaliseDays(row.days_attending)) {
      const bucket = counters.get(id);
      if (!bucket) continue;
      bucket.responses += 1;
      bucket.guests += guests;
    }
  }

  return {
    totalResponses,
    totalGuests,
    accommodationNeeded,
    averagePartySize: Math.round(averagePartySize * 10) / 10,
    recentResponses,
    perDay: DAY_IDS.map((id) => ({ id, ...counters.get(id)! })),
  };
}

/* ------------------------------------------------------------------ *
 * Listing
 * ------------------------------------------------------------------ */

/**
 * RSVP submissions with search, accommodation, day selection and sorting
 * applied in memory over the demo data.
 */
export async function getAllRsvps(filters?: RsvpFilters): Promise<RsvpWithDetails[]> {
  let rows = DUMMY_RSVPS.map(normaliseRow);

  /* Search across name / phone / email. */
  const term = filters?.searchTerm?.trim().toLowerCase();
  if (term) {
    rows = rows.filter((r) =>
      [r.name, r.phone, r.email ?? ''].some((v) => v.toLowerCase().includes(term)),
    );
  }

  /* Accommodation. */
  if (filters?.accommodationFilter && filters.accommodationFilter !== 'all') {
    const wanted = filters.accommodationFilter === 'yes';
    rows = rows.filter((r) => r.accommodation_needed === wanted);
  }

  /* Day selection: 'any' = attending at least one selected day, 'all' = every one. */
  const days = normaliseDays(filters?.days);
  if (days.length > 0) {
    rows = rows.filter((r) =>
      filters?.dayMatchMode === 'all'
        ? days.every((d) => r.days_attending.includes(d))
        : days.some((d) => r.days_attending.includes(d)),
    );
  }

  /* Sorting, with newest-first as the tie-breaker. */
  const newest = (a: RsvpWithDetails, b: RsvpWithDetails) => b.created_at.localeCompare(a.created_at);
  const compare: Record<SortBy, (a: RsvpWithDetails, b: RsvpWithDetails) => number> = {
    date_desc: newest,
    date_asc: (a, b) => -newest(a, b),
    name_asc: (a, b) => a.name.localeCompare(b.name) || newest(a, b),
    guests_desc: (a, b) => b.guest_count - a.guest_count || newest(a, b),
  };
  return rows.sort(compare[filters?.sortBy ?? 'date_desc']);
}
