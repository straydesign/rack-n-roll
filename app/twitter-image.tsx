import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Rack N Roll — Erie's Premier Karaoke Bar Since '89"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Green glow orb top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,122,58,0.15) 0%, transparent 70%)',
          }}
        />
        {/* Green glow orb bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,122,58,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #1A7A3A, transparent)',
          }}
        />

        {/* Main title */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: 900,
            color: '#FAF7F2',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          RACK N ROLL
        </div>

        {/* Divider */}
        <div
          style={{
            width: '120px',
            height: '3px',
            background: '#1A7A3A',
            marginTop: '32px',
            marginBottom: '32px',
            borderRadius: '2px',
            display: 'flex',
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#22c55e',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          ERIE&apos;S PREMIER KARAOKE BAR
        </div>

        {/* Since line */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: 500,
            color: 'rgba(250,247,242,0.4)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginTop: '16px',
            display: 'flex',
          }}
        >
          SINCE &apos;89 &middot; COME AS YOU ARE
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #1A7A3A, transparent)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
