'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Sparkles } from '@react-three/drei'
import { useRef, useEffect, Suspense, useMemo } from 'react'
import * as THREE from 'three'

function useScrollRef() {
  const ref = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      ref.current = window.scrollY / window.innerHeight
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return ref
}

function CameraRig() {
  const scroll = useScrollRef()
  const { camera } = useThree()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const targetZ = 7.5 - Math.min(scroll.current, 1.2) * 3.5
    const targetY = 3 - Math.min(scroll.current, 1) * 0.8
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04)
    camera.position.x = Math.sin(t * 0.1) * 0.2
    camera.lookAt(0, 0.5, 0)
  })

  return null
}

function Building() {
  const groupRef = useRef<THREE.Group>(null)
  const frontTex = useTexture('/building.jpg')
  const logoTex = useTexture('/logo.jpg')
  const scroll = useScrollRef()

  // Accurate colors from Google Earth aerial
  const brickFront = '#B05550' // pinkish-red brick
  const sideWall = '#2A2222' // very dark brown/black sides
  const roofTop = '#6B3535' // dark maroon roof
  const roofFascia = '#1A1818' // black roof edge trim
  const stoneColor = '#A09585' // stone entrance facade
  const windowColor = '#0A0808'
  const asphalt = '#484848'
  const grass = '#4A8B3A'
  const sidewalkColor = '#999088'
  const roadColor = '#555555'

  // Building body: right, left, top, bottom, front (photo), back
  const bodyMats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: sideWall, roughness: 0.95 }), // right (parking side)
      new THREE.MeshStandardMaterial({ color: sideWall, roughness: 0.95 }), // left (grass side)
      new THREE.MeshStandardMaterial({ color: roofFascia, roughness: 0.9 }), // top edge
      new THREE.MeshStandardMaterial({ color: '#3A2A2A', roughness: 0.95 }), // bottom
      new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.75 }), // front (photo)
      new THREE.MeshStandardMaterial({ color: brickFront, roughness: 0.9 }), // back
    ],
    [frontTex]
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.18 + scroll.current * Math.PI * 2
  })

  // Building dimensions (proportional to real building ~80ft x 45ft)
  const W = 4.8 // width (front face)
  const D = 2.8 // depth
  const H = 1.5 // wall height

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* === MAIN BUILDING BODY === */}
      <mesh position={[0, H / 2, 0]} material={bodyMats}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* === ROOF (flat, slight overhang) === */}
      <mesh position={[0, H + 0.08, 0]}>
        <boxGeometry args={[W + 0.2, 0.16, D + 0.2]} />
        <meshStandardMaterial color={roofTop} roughness={0.85} />
      </mesh>

      {/* Roof fascia strip (black edge all around) */}
      {/* Front fascia */}
      <mesh position={[0, H + 0.01, D / 2 + 0.01]}>
        <boxGeometry args={[W + 0.22, 0.14, 0.06]} />
        <meshStandardMaterial color={roofFascia} roughness={0.8} />
      </mesh>
      {/* Back fascia */}
      <mesh position={[0, H + 0.01, -(D / 2 + 0.01)]}>
        <boxGeometry args={[W + 0.22, 0.14, 0.06]} />
        <meshStandardMaterial color={roofFascia} roughness={0.8} />
      </mesh>

      {/* === FRONT FACE DETAILS (on top of photo texture) === */}
      {/* Stone entrance facade */}
      <mesh position={[0.4, H * 0.4, D / 2 + 0.02]}>
        <boxGeometry args={[1.3, H * 0.8, 0.12]} />
        <meshStandardMaterial color={stoneColor} roughness={0.85} />
      </mesh>
      {/* Door */}
      <mesh position={[0.4, 0.45, D / 2 + 0.09]}>
        <boxGeometry args={[0.5, 0.9, 0.04]} />
        <meshStandardMaterial color="#120E08" roughness={0.4} />
      </mesh>

      {/* Front windows (3 visible in photos) */}
      {[-1.6, -0.5, 1.6].map((x, i) => (
        <mesh key={`fw-${i}`} position={[x, H * 0.55, D / 2 + 0.01]}>
          <boxGeometry args={[0.6, 0.35, 0.03]} />
          <meshStandardMaterial color={windowColor} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}

      {/* === BACK WALL DETAILS === */}
      {/* Back windows */}
      {[-1.2, 0.8].map((x, i) => (
        <mesh key={`bw-${i}`} position={[x, H * 0.55, -(D / 2 + 0.01)]}>
          <boxGeometry args={[0.5, 0.3, 0.03]} />
          <meshStandardMaterial color={windowColor} roughness={0.3} />
        </mesh>
      ))}

      {/* === NEON GLOW (front window) === */}
      <mesh position={[-1.6, H * 0.55, D / 2 + 0.03]}>
        <planeGeometry args={[0.5, 0.25]} />
        <meshStandardMaterial
          color="#1A7A3A"
          emissive="#1A7A3A"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* === SIGN POLE (left of building, facing front) === */}
      <mesh position={[-3.2, 1.3, D / 2 - 0.3]}>
        <cylinderGeometry args={[0.04, 0.05, 2.8, 8]} />
        <meshStandardMaterial color="#555" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Logo sign on pole */}
      <mesh position={[-3.2, 2.5, D / 2 - 0.3]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshStandardMaterial
          map={logoTex}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Red illuminated sign below */}
      <mesh position={[-3.2, 1.75, D / 2 - 0.3]}>
        <boxGeometry args={[0.65, 0.22, 0.04]} />
        <meshStandardMaterial
          color="#CC3300"
          emissive="#CC3300"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* === GROUND PLANE === */}
      {/* Parking lot (front + right) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, -0.01, 1.5]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color={asphalt} roughness={0.95} />
      </mesh>

      {/* Parking lines */}
      {[-0.5, 1.0, 2.5, 4.0].map((x, i) => (
        <mesh
          key={`pl-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.002, 2.5]}
        >
          <planeGeometry args={[0.05, 1.6]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      ))}

      {/* Grass (left side) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, -0.005, 0]}>
        <planeGeometry args={[3, 5]} />
        <meshStandardMaterial color={grass} roughness={0.95} />
      </mesh>

      {/* Grass (front-left patch) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.8, -0.005, D / 2 + 0.8]}>
        <planeGeometry args={[2.5, 1.2]} />
        <meshStandardMaterial color={grass} roughness={0.95} />
      </mesh>

      {/* Sidewalk (front) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, D / 2 + 1.6]}>
        <planeGeometry args={[6, 0.6]} />
        <meshStandardMaterial color={sidewalkColor} roughness={0.9} />
      </mesh>

      {/* Road (W 38th St) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, D / 2 + 3]}>
        <planeGeometry args={[12, 2.5]} />
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </mesh>
      {/* Yellow center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, D / 2 + 3]}>
        <planeGeometry args={[10, 0.04]} />
        <meshStandardMaterial color="#C8A830" />
      </mesh>

      {/* Grass across road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, D / 2 + 5.5]}>
        <planeGeometry args={[12, 3]} />
        <meshStandardMaterial color="#5A9944" roughness={0.95} />
      </mesh>

      {/* === DUMPSTER (right-rear, visible in aerial) === */}
      <mesh position={[W / 2 + 0.5, 0.3, -(D / 2 - 0.5)]}>
        <boxGeometry args={[0.5, 0.6, 0.4]} />
        <meshStandardMaterial color="#2A5A2A" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 4]} intensity={0.9} color="#FFF5E8" />
      <directionalLight position={[-3, 6, -2]} intensity={0.3} color="#C8D0E0" />
      {/* Warm entrance light */}
      <pointLight
        position={[0.4, 0.8, 2.5]}
        intensity={0.6}
        color="#FFCC66"
        distance={4}
      />
      {/* Green neon glow */}
      <pointLight
        position={[-1.6, 0.8, 2]}
        intensity={0.4}
        color="#1A7A3A"
        distance={3}
      />
      {/* Sign light */}
      <pointLight
        position={[-3.2, 2.5, 2]}
        intensity={0.3}
        color="#1A7A3A"
        distance={4}
      />
    </>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 3, 7.5], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <CameraRig />
      <Lights />
      <Suspense fallback={null}>
        <Building />
      </Suspense>
      <Sparkles
        count={30}
        scale={18}
        size={1.2}
        speed={0.15}
        color="#1A7A3A"
        opacity={0.25}
      />
    </Canvas>
  )
}
