import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zoya & Arhaan Wedding Invitation',
    short_name: 'Z&A Wedding',
    description: 'You are cordially invited to celebrate the wedding of Zoya and Arhaan',
    start_url: '/',
    display: 'standalone',
    background_color: '#ebe1d6',
    theme_color: '#a6814e',
    orientation: 'portrait',
    icons: [
      {
        src: '/images/monogram.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/monogram.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/monogram.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
