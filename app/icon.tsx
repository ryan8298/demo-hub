import { ImageResponse } from 'next/og';

// Next.js automatically wires this as the site favicon — no <link> tag needed.
// Generated at request time and cached by the CDN.

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#020202',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#B2EEDA',
          fontFamily: 'serif',
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: '-0.05em',
        }}
      >
        E
      </div>
    ),
    { ...size }
  );
}
