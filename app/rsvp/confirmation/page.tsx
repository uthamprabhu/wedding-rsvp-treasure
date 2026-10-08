'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Mail, Users, BedDouble, ArrowLeft, Heart, ExternalLink, CalendarDays } from 'lucide-react';
import PaperBackground from '@/components/PaperBackground';
import CelestialBackdrop, { AdaptiveLantern } from '@/components/CelestialBackdrop';
import DeferredButterflies from '@/components/DeferredButterflies';
import dynamic from 'next/dynamic';
import { formatDays } from '@/lib/wedding-days';
import { getLatestRsvp, readRawRsvps } from '@/lib/rsvp-storage';

const RsvpCelebration = dynamic(() => import('@/components/RsvpCelebration'), {
  ssr: false,
});

// Re-read when another tab changes the saved RSVPs.
const subscribeStorage = (cb: () => void) => {
  window.addEventListener('storage', cb);
  return () => window.removeEventListener('storage', cb);
};
// undefined = not read yet (server render / hydration), null = nothing saved.
const serverSnapshot = () => undefined;

export default function ConfirmationPage() {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribeStorage, readRawRsvps, serverSnapshot);
  const rsvp = useMemo(() => (raw === undefined ? undefined : getLatestRsvp(raw)), [raw]);

  useEffect(() => {
    if (rsvp === null) router.replace('/rsvp');
  }, [rsvp, router]);

  if (!rsvp) {
    return (
      <div className="simple-loader">
        <p>Loading your confirmation...</p>
      </div>
    );
  }

  const data = {
    name: rsvp.name,
    phone: rsvp.phone,
    email: rsvp.email ?? '',
    guestCount: rsvp.guest_count,
    accommodation: rsvp.accommodation_needed ? 'yes' : 'no',
  };
  const daysAttending = rsvp.days_attending;

  const firstName = data.name.trim().split(/\s+/)[0];
  const details = [
    { icon: Users, label: 'Your party', value: `${data.guestCount} ${data.guestCount === 1 ? 'guest' : 'guests'}` },
    { icon: BedDouble, label: 'Accommodation', value: data.accommodation === 'yes' ? 'Assistance requested' : 'Not needed' },
  ];
  if (daysAttending.length > 0) {
    // Confirms back what the guest actually selected — they picked which of
    // the three events they'll attend, and had no way to verify it stuck.
    details.unshift({ icon: CalendarDays, label: 'Attending', value: formatDays(daysAttending) });
  }
  if (data.email.trim()) {
    details.splice(1, 0, { icon: Mail, label: 'Confirmation email', value: data.email });
  }

  return (
    <main className="rsvp-page">
      <PaperBackground zIndex={0} />
      <CelestialBackdrop page="rsvp" />
      <DeferredButterflies />
      <AdaptiveLantern />
      <RsvpCelebration />
      
      <div className="rsvp-confirmation">
        <motion.div 
          className="rsvp-confirmation-wrap" 
          initial={{ opacity: 0, y: 14 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <button 
            type="button" 
            className="rsvp-back" 
            onClick={() => router.push('/')}
            style={{ marginBottom: '2rem' }}
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to invitation
          </button>

          <div className="rsvp-confirmation-mark">
            <Check size={22} strokeWidth={1.5} />
          </div>
          <p className="rsvp-kicker">The sweetest yes</p>
          <h1>Thank you, {firstName}.</h1>
          <p className="rsvp-confirmation-intro">
            Your place at our celebration is lovingly reserved. We cannot wait to share the day with you.
          </p>

          <div className="rsvp-confirmation-details">
            {details.map(({ icon: Icon, label, value }) => (
              <div className="rsvp-detail" key={label}>
                <Icon size={17} strokeWidth={1.5} />
                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              </div>
            ))}
          </div>

          <p className="rsvp-confirmation-note" style={{ marginTop: '2rem' }}>
            We have your RSVP details for {data.phone}.
          </p>

          <div className="rsvp-footer-block">
            <p className="rsvp-footer" style={{ marginTop: 0 }}>With love, Zoya & Arhaan <span>•</span> 2027</p>
            <a
              href="https://wa.me/919633693160"
              target="_blank"
              rel="noreferrer"
              className="zorscode-credit"
            >
              Made with <Heart size={11} className="zorscode-heart" aria-hidden="true" /> by <span className="zorscode-name">UNSP<ExternalLink size={10} className="zorscode-ext" aria-label="Open chat" strokeWidth={2} /></span>
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
