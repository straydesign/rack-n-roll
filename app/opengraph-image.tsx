/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Rack N Roll — Erie's Premier Karaoke Bar Since '89"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [logoData, buildingData] = await Promise.all([
    fetch(new URL('../public/facebook/logo.jpg', import.meta.url)).then((res) =>
      res.arrayBuffer()
    ),
    fetch(new URL('../public/building.jpg', import.meta.url)).then((res) =>
      res.arrayBuffer()
    ),
  ])

  const logoSrc = `data:image/jpeg;base64,${Buffer.from(logoData).toString('base64')}`
  const buildingSrc = `data:image/jpeg;base64,${Buffer.from(buildingData).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0A0A0A',
        }}
      >
        {/* Building photo — darkened background */}
        <img
          src={buildingSrc}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.2,
          }}
        />

        {/* Dark gradient overlay for text legibility */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.9) 100%)',
            display: 'flex',
          }}
        />

        {/* Top green accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background:
              'linear-gradient(90deg, #1A7A3A, #22c55e, #1A7A3A)',
            display: 'flex',
          }}
        />

        {/* Bottom green accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '5px',
            background:
              'linear-gradient(90deg, #1A7A3A, #22c55e, #1A7A3A)',
            display: 'flex',
          }}
        />

        {/* Green glow behind logo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '220px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
            transform: 'translateY(-50%)',
            display: 'flex',
          }}
        />

        {/* Main content layout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: '60px 80px',
            gap: '60px',
            position: 'relative',
          }}
        >
          {/* Logo in a white rounded card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '280px',
              height: '280px',
              borderRadius: '32px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 40px rgba(34,197,94,0.2)',
              flexShrink: 0,
              overflow: 'hidden',
              padding: '20px',
            }}
          >
            <img
              src={logoSrc}
              alt="Rack N Roll"
              style={{
                width: '240px',
                height: '240px',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Text content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 900,
                color: '#FAF7F2',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                display: 'flex',
              }}
            >
              Rack N Roll
            </div>

            {/* Green divider */}
            <div
              style={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #22c55e, #1A7A3A)',
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
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              Erie&apos;s Premier Karaoke Bar
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '22px',
                fontWeight: 400,
                color: 'rgba(250,247,242,0.6)',
                lineHeight: 1.5,
                display: 'flex',
              }}
            >
              Karaoke 6 nights a week · Great specials · Good food
            </div>

            {/* Since badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#22c55e',
                  letterSpacing: '0.1em',
                  display: 'flex',
                }}
              >
                SINCE &apos;89
              </div>
              <div
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(250,247,242,0.06)',
                  border: '1px solid rgba(250,247,242,0.1)',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: 'rgba(250,247,242,0.5)',
                  letterSpacing: '0.08em',
                  display: 'flex',
                }}
              >
                COME AS YOU ARE
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
