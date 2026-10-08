/**
 * Demo data for the admin dashboard.
 *
 * This build has no database: guest RSVPs are kept in the guest's own browser
 * (localStorage), and the admin panel shows these 20 made-up replies so
 * visitors can see what the dashboard looks like with real-ish numbers.
 * Names, phones and emails are fictional.
 */

export interface RsvpSubmission {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  guest_count: number;
  accommodation_needed: boolean;
  days_attending: string[];
  created_at: string;
}

/** Timestamps are relative to "now" so the "last 7 days" stat never goes stale. */
const daysAgo = (days: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, (days * 17) % 60, 0, 0);
  return d.toISOString();
};

type Row = [name: string, email: string | null, guests: number, stay: boolean, days: string[], ago: number, hour: number];

const ROWS: Row[] = [
  ['Ayaan Malik', 'ayaan.malik@example.com', 4, false, ['day1', 'day2', 'day3'], 1, 10],
  ['Sana Sheikh', 'sana.sheikh@example.com', 2, true, ['day2', 'day3'], 1, 19],
  ['Rohan Kapoor', null, 3, false, ['day3'], 2, 13],
  ['Mehreen Ansari', 'mehreen.a@example.com', 5, true, ['day1', 'day2', 'day3'], 3, 21],
  ['Kabir Mehta', 'kabir.mehta@example.com', 1, false, ['day2'], 4, 9],
  ['Fatima Khan', null, 6, false, ['day1', 'day3'], 5, 17],
  ['Imran Siddiqui', 'imran.s@example.com', 2, true, ['day3'], 6, 12],
  ['Aditi Sharma', 'aditi.sharma@example.com', 2, false, ['day2', 'day3'], 8, 20],
  ['Zainab Hussain', 'zainab.h@example.com', 3, true, ['day1', 'day2', 'day3'], 9, 11],
  ['Arjun Verma', null, 1, false, ['day3'], 10, 15],
  ['Nida Farooqui', 'nida.f@example.com', 4, false, ['day1', 'day2'], 12, 18],
  ['Yusuf Rizvi', 'yusuf.rizvi@example.com', 2, true, ['day2', 'day3'], 13, 22],
  ['Priya Nair', 'priya.nair@example.com', 2, true, ['day3'], 15, 14],
  ['Hamza Qureshi', null, 5, false, ['day1', 'day2', 'day3'], 16, 10],
  ['Alina Mirza', 'alina.mirza@example.com', 1, false, ['day1'], 18, 16],
  ['Vikram Singh', 'vikram.singh@example.com', 3, true, ['day3'], 20, 19],
  ['Rukhsar Begum', null, 4, false, ['day1', 'day3'], 22, 12],
  ['Danish Akhtar', 'danish.akhtar@example.com', 2, false, ['day2', 'day3'], 24, 20],
  ['Meera Iyer', 'meera.iyer@example.com', 2, true, ['day2'], 27, 9],
  ['Saif Pathan', 'saif.pathan@example.com', 3, false, ['day1', 'day2', 'day3'], 30, 17],
];

export const DUMMY_RSVPS: RsvpSubmission[] = ROWS.map(([name, email, guests, stay, days, ago, hour], i) => ({
  id: `demo-${String(i + 1).padStart(2, '0')}`,
  name,
  phone: `+9190000100${String(i + 1).padStart(2, '0')}`,
  email,
  guest_count: guests,
  accommodation_needed: stay,
  days_attending: days,
  created_at: daysAgo(ago, hour),
}));
