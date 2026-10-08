'use client';

/**
 * Fixed bottom-left share button (mirrors the music toggle on the right),
 * plus a tiny gem that links to the developer. Its label peeks out once per
 * visit, then tucks away so it never sits on top of the invitation.
 *
 * Always shares the invitation's home page, never the current URL, so a
 * guest sharing from their confirmation page doesn't send that page around.
 * Uses the native share sheet where available (phones), else copies the link.
 */

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Gem, Share2 } from 'lucide-react';

const DEVELOPER_CONTACT = `https://wa.me/919633693160?text=${encodeURIComponent(
  'Hi! I saw the wedding invitation demo and would love one for my wedding.',
)}`;

export default function ShareInvite() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  // The couple's private dashboard is not something to share.
  if (pathname.startsWith('/admin')) return null;

  const share = async () => {
    const url = `${window.location.origin}/`;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, text: "You're invited to Zoya & Arhaan's wedding", url });
      } catch {
        /* guest closed the share sheet */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Copy this link to share the invitation:', url);
    }
  };

  return (
    <div className="share-invite">
      <button
        type="button"
        onClick={share}
        className="music-toggle share-invite-button"
        aria-label="Share this invitation"
        title="Share"
      >
        <Share2 aria-hidden="true" strokeWidth={1.6} />
      </button>
      <a
        href={DEVELOPER_CONTACT}
        target="_blank"
        rel="noreferrer"
        className="dev-contact"
        aria-label="Want this invite? Contact the developer"
        title="Want this invite? Contact the developer"
      >
        <Gem aria-hidden="true" strokeWidth={1.6} />
        <span className="dev-contact-label" aria-hidden="true">Want this invite? Contact the developer</span>
      </a>
      <span className="share-invite-toast" role="status" aria-live="polite">
        {copied ? 'Link copied' : ''}
      </span>
    </div>
  );
}
