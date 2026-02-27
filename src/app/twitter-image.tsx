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
          <span style={{ color: 'white', fontSize: '48px', fontWeight: 800, letterSpacing: '-1px' }}>
            OneMalad
          </span>
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '24px',
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          Community Service. Volunteer Drives. Building a Better Malad.
        </div>
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
