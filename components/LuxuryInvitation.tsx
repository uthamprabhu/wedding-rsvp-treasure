'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ExternalLink, Heart, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import PaperBackground from '@/components/PaperBackground';
import WeddingCountdown from '@/components/WeddingCountdown';
import { AdaptiveLantern } from '@/components/CelestialBackdrop';
import DeferredButterflies from '@/components/DeferredButterflies';

const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function CornerOrnaments() {
  const ornament = (
    <g fill="currentColor" stroke="none">
      <g transform="translate(24 27)">
        <circle cx="24" cy="10" r="10" opacity=".72" />
        <circle cx="38" cy="24" r="10" opacity=".72" />
        <circle cx="24" cy="38" r="10" opacity=".72" />
        <circle cx="10" cy="24" r="10" opacity=".72" />
        <circle cx="24" cy="24" r="6" fill="#b88a50" />
      </g>
      <g transform="translate(78 67) scale(.72)">
        <circle cx="24" cy="10" r="10" opacity=".65" />
        <circle cx="38" cy="24" r="10" opacity=".65" />
        <circle cx="24" cy="38" r="10" opacity=".65" />
        <circle cx="10" cy="24" r="10" opacity=".65" />
        <circle cx="24" cy="24" r="6" fill="#b88a50" />
      </g>
      <circle cx="72" cy="57" r="3" opacity=".5" />
      <circle cx="120" cy="104" r="3" opacity=".5" />
    </g>
  );
  return (
    <div className="invitation-ornaments" aria-hidden="true">
      <svg className="invitation-corner invitation-corner-tl" viewBox="0 0 180 180" fill="none">{ornament}</svg>
      <svg className="invitation-corner invitation-corner-tr" viewBox="0 0 180 180" fill="none">{ornament}</svg>
      <svg className="invitation-corner invitation-corner-bl" viewBox="0 0 180 180" fill="none">{ornament}</svg>
      <svg className="invitation-corner invitation-corner-br" viewBox="0 0 180 180" fill="none">{ornament}</svg>
    </div>
  );
}

function DeferredPaperBackground() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 180);
    return () => window.clearTimeout(timer);
  }, []);
  return ready ? <PaperBackground zIndex={0} /> : null;
}

// Demo build: stand-in photos from Unsplash (free licence), not the real couple.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=75`;
const PHOTOS = {
  bride: unsplash('1610173827043-9db50e0d8ef9'),
  groom: unsplash('1762708550230-1018abb0a30d'),
  memoryLeft: unsplash('1722952934708-749c22eb2e58'),
  memoryRight: unsplash('1727430256509-0f897d6f4765'),
  hands: unsplash('1542042161784-26ab9e041e89'),
};

/**
 * Portrait section — both bride and groom always visible side-by-side on
 * tablet/desktop. On mobile they stack vertically (bride then groom) so
 * guests see both without any tab interaction. The floating side-memory
 * thumbnails are hidden on mobile per the UX direction.
 */
function CouplePortraitStory() {
  return (
    <section className="couple-portrait-story" aria-label="Meet the couple">
      {/* Floating memory photos — desktop/tablet only */}
      <div className="portrait-memory portrait-memory-left" style={{ transform: 'rotate(-9deg)' }} aria-hidden="true">
        <Image src={PHOTOS.memoryLeft} alt="" fill
          sizes="(max-width: 640px) 0px, 190px" className="object-cover" />
      </div>
      <div className="portrait-memory portrait-memory-right" style={{ transform: 'rotate(8deg)' }} aria-hidden="true">
        <Image src={PHOTOS.memoryRight} alt="" fill
          sizes="(max-width: 640px) 0px, 185px" className="object-cover" />
      </div>

      {/* On desktop: side-by-side. On mobile: vertical stack, both visible. */}
      <div className="couple-presentation">
        <article className="couple-profile couple-profile-bride">
          <figure className="couple-portrait-frame">
            <Image src={PHOTOS.bride} alt="Zoya Rahman" fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 38vw, 390px" className="object-cover" />
          </figure>
          <p className="portrait-role">The bride</p>
          <h3>Zoya <span>Rahman</span></h3>
        </article>

        <div className="couple-union" aria-hidden="true">
          <span>✦</span><i /><p>two lives,<br />one prayer</p><i /><span>✦</span>
        </div>

        <article className="couple-profile couple-profile-groom">
          <figure className="couple-portrait-frame">
            <Image src={PHOTOS.groom} alt="Arhaan Qureshi" fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 38vw, 390px" className="object-cover" />
          </figure>
          <p className="portrait-role">The groom</p>
          <h3>Arhaan <span>Qureshi</span></h3>
        </article>
      </div>

      <figure className="couple-hands-portrait">
        <Image src={PHOTOS.hands} alt="Zoya and Arhaan holding hands"
          fill sizes="(max-width: 640px) 148px, 132px" className="object-cover" />
      </figure>

      {/* Quran 30:21 */}
      <div className="couple-verse">
        <p className="couple-verse-arabic" lang="ar" dir="rtl">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
        </p>
        <p className="couple-verse-text">
          &ldquo;And of His signs is that He created for you from yourselves mates,
          that you may find tranquillity in them.&rdquo;
        </p>
        <p className="couple-verse-ref">— Quran 30:21</p>
      </div>
    </section>
  );
}

export default function LuxuryInvitation() {
  return (
    <main className="luxury-invitation">
      <DeferredPaperBackground />
      <DeferredButterflies />
      <AdaptiveLantern />
      <CornerOrnaments />

      <div className="invitation-story">

        {/* ─── 1. OPENING SCREEN ──────────────────────────────────────── */}
        {/* Fabi logo below the lantern, then the couple names big,
            Bismillah small at the bottom — first thing every guest sees. */}
        <section className="invitation-opening">
          <div className="invitation-opening-inner">
            {/* Fabi logo — small, sits just below the lantern */}
            <motion.div
              className="invitation-fabi-logo"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/fabi-logo.webp"
                alt=""
                width={72}
                height={36}
                priority
                className="invitation-fabi-logo-img"
              />
            </motion.div>

            {/* Main title */}
            <motion.div
              className="invitation-opening-title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="invitation-hero-names">
                Zoya<br />
                <span className="invitation-hero-weds">weds</span><br />
                Arhaan
              </h1>
            </motion.div>

            {/* Bismillah — tiny, reverent, floats just above the scroll cue */}
            <motion.div
              className="invitation-opening-bismillah"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <p className="invitation-arabic" lang="ar" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <p className="invitation-translation">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.a
            href="#invitation-portraits"
            className="invitation-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            aria-label="Continue"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('invitation-portraits')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <span>Open the invitation</span>
            <ArrowDown size={14} />
          </motion.a>
        </section>

        {/* ─── 2. PORTRAIT SECTION (right after opening) ──────────────── */}
        <section id="invitation-portraits" className="invitation-portrait-section">
          <Reveal><CouplePortraitStory /></Reveal>
        </section>

        {/* ─── 3. FAMILY INVITATION (quote + family names) ────────────── */}
        <section id="invitation-message" className="invitation-message-section">
          <Reveal className="invitation-message">
            <p className="section-eyebrow">A family invitation</p>
            <blockquote>
              &ldquo;With hearts full of joy, we invite you and your family to be a part of the
              Nikah and Wedding Ceremony of our beloved daughter.&rdquo;
            </blockquote>
            <p className="invitation-from">
              With love from<br />
              <strong>Mr. Imtiaz Rahman<br />&amp; Mrs. Shabnam Rahman</strong>
              <span className="invitation-from-and">and</span>
              <span className="invitation-from-family">The groom&apos;s family</span>
              <strong>Mr. Faisal Qureshi<br />&amp; Mrs. Nusrat Qureshi</strong>
            </p>
          </Reveal>
        </section>

        {/* ─── 4. COUNTDOWN ────────────────────────────────────────────── */}
        <Reveal><WeddingCountdown /></Reveal>

        {/* ─── 6. SAVE THE DATE ────────────────────────────────────────── */}
        <section className="invitation-event-section">
          <Reveal className="event-heading">
            <p className="section-eyebrow">Save the date</p>
            <h2>Tuesday<br /><span>02 February 2027</span></h2>
            <p>25 Sha&apos;ban 1448 AH</p>
          </Reveal>
          <Reveal className="event-details" delay={.08}>
            <div><span>Nikah</span><strong>12:00 Noon – 12:30 PM</strong></div>
            <div>
              <span>Venue</span>
              <strong>The Imperial</strong>
              <p><MapPin size={14} /> Janpath, New Delhi</p>
            </div>
          </Reveal>
          <Reveal className="event-map" delay={.12}>
            <iframe
              title="Map to The Imperial, Janpath, New Delhi"
              src="https://maps.google.com/maps?q=The%20Imperial%2C%20Janpath%2C%20New%20Delhi&z=15&output=embed"
              allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
            />
            <a
              className="event-map-link"
              href="https://www.google.com/maps/search/?api=1&query=The%20Imperial%2C%20Janpath%2C%20New%20Delhi"
              target="_blank" rel="noreferrer"
            >
              Open in Google Maps <ExternalLink size={14} />
            </a>
          </Reveal>
        </section>

        {/* ─── 7. CLOSING ──────────────────────────────────────────────── */}
        <section className="invitation-closing">
          <Reveal>
            <p className="invitation-arabic invitation-closing-arabic" lang="ar" dir="rtl">
              بارك الله لكما وبارك عليكما وجمع بينكما في خير
            </p>
            <p className="closing-copy">
              We would be honoured to share this blessed beginning with you.
            </p>
            <div className="closing-links">
              <Link href="/itinerary">View the itinerary <ArrowRight size={16} /></Link>
              <Link href="/rsvp" className="closing-rsvp">Kindly RSVP</Link>
            </div>
            <a
              href="https://wa.me/919633693160"
              target="_blank"
              rel="noreferrer"
              className="zorscode-credit"
            >
              Made with <Heart size={11} className="zorscode-heart" aria-hidden="true" /> by <span className="zorscode-name">UNSP<ExternalLink size={10} className="zorscode-ext" aria-label="Open chat" strokeWidth={2} /></span>
            </a>
          </Reveal>
        </section>

      </div>
    </main>
  );
}
