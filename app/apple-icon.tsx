import { ImageResponse } from 'next/og';

// Larger icon for iOS home screen / Safari pinned tabs.

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 140,
          letterSpacing: '-0.05em',
        }}
      >
        E
      </div>
    ),
    { ...size }
  );
}
