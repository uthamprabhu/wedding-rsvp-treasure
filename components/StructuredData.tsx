export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Zoya & Arhaan Wedding',
    description: 'Join us for the wedding celebration of Zoya and Arhaan. A blessed occasion filled with love, joy, and cherished moments.',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Person',
      name: 'Zoya & Arhaan',
    },
    image: [
      'https://zoya-arhaan.vercel.app/opengraph-image',
      'https://zoya-arhaan.vercel.app/opengraph-image'
    ],
    url: 'https://zoya-arhaan.vercel.app',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
