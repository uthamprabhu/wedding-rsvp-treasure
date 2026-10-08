import { ImageResponse } from 'next/og';

export const alt = 'Zoya & Arhaan - Wedding Invitation';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ebe1d6',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(212, 165, 116, 0.15), transparent 50%), radial-gradient(circle at 75% 75%, rgba(195, 161, 108, 0.1), transparent 50%)',
          position: 'relative',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '2px solid rgba(166, 129, 78, 0.3)',
            borderRadius: '8px',
            display: 'flex',
          }}
        />
        
        {/* Inner border */}
        <div
          style={{
            position: 'absolute',
            top: '52px',
            left: '52px',
            right: '52px',
            bottom: '52px',
            border: '1px solid rgba(191, 152, 94, 0.25)',
            borderRadius: '6px',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px 100px 70px',
          }}
        >
          {/* Top ornament */}
          <div
            style={{
              width: '22px',
              height: '22px',
              background: '#a6814e',
              transform: 'rotate(45deg)',
              marginBottom: '28px',
              display: 'flex',
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: '24px',
              color: '#a6814e',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            You Are Invited
          </div>

          {/* Names */}
          <div
            style={{
              fontSize: '84px',
              fontWeight: '400',
              color: '#433b34',
              lineHeight: '0.95',
              marginBottom: '16px',
              display: 'flex',
              fontFamily: 'serif',
            }}
          >
            Zoya
          </div>
          
          <div
            style={{
              fontSize: '52px',
              color: '#c3a16c',
              fontStyle: 'italic',
              marginBottom: '16px',
              display: 'flex',
              fontFamily: 'serif',
            }}
          >
            &
          </div>

          <div
            style={{
              fontSize: '84px',
              fontWeight: '400',
              color: '#433b34',
              lineHeight: '0.95',
              marginBottom: '36px',
              display: 'flex',
              fontFamily: 'serif',
            }}
          >
            Arhaan
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '28px',
              color: '#76695d',
              lineHeight: '1.6',
              maxWidth: '800px',
              marginBottom: '20px',
              display: 'flex',
              fontFamily: 'serif',
            }}
          >
            Join us for this blessed occasion
          </div>

          {/* Bottom ornament */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: '#a6814e',
            }}
          >
            <div style={{ width: '60px', height: '1px', background: 'rgba(166, 129, 78, 0.4)', display: 'flex' }} />
            <div style={{ width: '14px', height: '14px', border: '2px solid #a6814e', transform: 'rotate(45deg)', display: 'flex' }} />
            <div style={{ width: '60px', height: '1px', background: 'rgba(166, 129, 78, 0.4)', display: 'flex' }} />
          </div>
        </div>

        {/* Website URL at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            fontSize: '20px',
            color: '#93867a',
            letterSpacing: '0.1em',
            display: 'flex',
            fontFamily: 'serif',
          }}
        >
          zoya-arhaan.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
