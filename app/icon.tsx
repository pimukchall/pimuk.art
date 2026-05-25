import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a1a',
        }}
      >
        <span
          style={{
            color: '#c9a96e',
            fontSize: 148,
            fontFamily: 'Georgia, serif',
            fontWeight: 300,
            letterSpacing: '-2px',
            lineHeight: 1,
          }}
        >
          Pimuk
        </span>
      </div>
    ),
    { ...size },
  );
}
