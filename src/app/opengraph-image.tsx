import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'OneMalad - Community Foundation for Malad, Mumbai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(20, 184, 166, 0.1)',
            display: 'flex',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 800,
            }}
          >
            1
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontSize: '42px', fontWeight: 800, letterSpacing: '-1px' }}>
              OneMalad
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>
              Community Foundation
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '28px',
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
            marginBottom: '40px',
          }}
        >
          Community Service. Volunteer Drives.
          Building a Better Malad, Together.
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
          }}
        >
          {[
            { num: '5', label: 'Wards' },
            { num: '500+', label: 'Volunteers' },
            { num: '5', label: 'Places' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 32px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ color: '#38bdf8', fontSize: '36px', fontWeight: 800 }}>{stat.num}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(90deg, #2563eb, #14b8a6, #38bdf8)',
            display: 'flex',
          }}
        />

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          onemalad.in
        </div>
      </div>
    ),
    { ...size }
  );
}
