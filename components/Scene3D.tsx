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
    const targetZ = 8.5 - Math.min(scroll.current, 1.2) * 3.5
    const targetY = 3.5 - Math.min(scroll.current, 1) * 0.8
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04)
    camera.position.x = Math.sin(t * 0.1) * 0.25
    camera.lookAt(0, 0.6, 0)
  })

  return null
}

// Generate a procedural brick normal map texture
function useBrickMaterial(baseColor: string) {
  return useMemo(() => {
    // Create a canvas for the brick pattern (bump/normal source)
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Base mortar color
    ctx.fillStyle = '#706058'
    ctx.fillRect(0, 0, size, size)

    // Brick dimensions
    const brickW = 64
    const brickH = 28
    const mortarGap = 3

    // Draw bricks
    for (let row = 0; row < size / brickH; row++) {
      const offset = row % 2 === 0 ? 0 : brickW / 2
      for (let col = -1; col < size / brickW + 1; col++) {
        const x = col * brickW + offset + mortarGap
        const y = row * brickH + mortarGap

        // Vary brick color slightly
        const variation = Math.random() * 30 - 15
        const r = parseInt(baseColor.slice(1, 3), 16) + variation
        const g = parseInt(baseColor.slice(3, 5), 16) + variation * 0.6
        const b = parseInt(baseColor.slice(5, 7), 16) + variation * 0.4
        ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, r))},${Math.max(0, Math.min(255, g))},${Math.max(0, Math.min(255, b))})`
        ctx.fillRect(x, y, brickW - mortarGap * 2, brickH - mortarGap * 2)
      }
    }

    const colorTex = new THREE.CanvasTexture(canvas)
    colorTex.wrapS = THREE.RepeatWrapping
    colorTex.wrapT = THREE.RepeatWrapping

    // Create bump map (same pattern, grayscale)
    const bumpCanvas = document.createElement('canvas')
    bumpCanvas.width = size
    bumpCanvas.height = size
    const bCtx = bumpCanvas.getContext('2d')!

    // Mortar = dark (recessed)
    bCtx.fillStyle = '#333'
    bCtx.fillRect(0, 0, size, size)

    // Bricks = lighter (raised)
    for (let row = 0; row < size / brickH; row++) {
      const offset = row % 2 === 0 ? 0 : brickW / 2
      for (let col = -1; col < size / brickW + 1; col++) {
        const x = col * brickW + offset + mortarGap
        const y = row * brickH + mortarGap
        const brightness = 180 + Math.random() * 40
        bCtx.fillStyle = `rgb(${brightness},${brightness},${brightness})`
        bCtx.fillRect(x, y, brickW - mortarGap * 2, brickH - mortarGap * 2)
      }
    }

    const bumpTex = new THREE.CanvasTexture(bumpCanvas)
    bumpTex.wrapS = THREE.RepeatWrapping
    bumpTex.wrapT = THREE.RepeatWrapping

    return { colorTex, bumpTex }
  }, [baseColor])
}

function Building() {
  const groupRef = useRef<THREE.Group>(null)
  const frontTex = useTexture('/building.jpg')
  const logoTex = useTexture('/logo.jpg')
  const scroll = useScrollRef()

  // Colors from Google Earth aerial
  const brickFront = '#B05550'
  const sideWall = '#2A2222'
  const roofColor = '#6B3535'
  const roofFascia = '#1A1818'
  const stoneColor = '#A09585'
  const windowColor = '#0A0808'
  const asphalt = '#484848'
  const grassColor = '#4A8B3A'
  const sidewalkColor = '#999088'
  const roadColor = '#555555'

  // Procedural brick textures that react to light
  const frontBrick = useBrickMaterial(brickFront)
  const sideBrick = useBrickMaterial(sideWall)

  // Building dimensions
  const W = 4.8
  const D = 2.8
  const H = 1.5
  const roofPeak = 0.7 // gable height above walls

  // Gable roof geometry (triangular prism)
  const roofGeo = useMemo(() => {
    const hw = (W + 0.3) / 2
    const hd = (D + 0.3) / 2
    const overhang = 0.15

    // Roof is two slopes meeting at a ridge
    const geo = new THREE.BufferGeometry()

    const vertices = new Float32Array([
      // Left slope (front-left-bottom, front-ridge-top, back-ridge-top, back-left-bottom)
      -hw, 0, hd + overhang,
      0, roofPeak, hd + overhang,
      0, roofPeak, -(hd + overhang),
      -hw, 0, -(hd + overhang),

      // Right slope
      hw, 0, hd + overhang,
      0, roofPeak, hd + overhang,
      0, roofPeak, -(hd + overhang),
      hw, 0, -(hd + overhang),

      // Front gable triangle
      -hw, 0, hd + overhang,
      hw, 0, hd + overhang,
      0, roofPeak, hd + overhang,

      // Back gable triangle
      -hw, 0, -(hd + overhang),
      hw, 0, -(hd + overhang),
      0, roofPeak, -(hd + overhang),
    ])

    const indices = [
      // Left slope
      0, 1, 2, 0, 2, 3,
      // Right slope
      4, 6, 5, 4, 7, 6,
      // Front gable
      8, 9, 10,
      // Back gable
      11, 13, 12,
    ]

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()

    return geo
  }, [W, D, roofPeak])

  // Body materials: right, left, top, bottom, front, back
  const bodyMats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        map: sideBrick.colorTex,
        bumpMap: sideBrick.bumpTex,
        bumpScale: 0.3,
        roughness: 0.9,
      }),
      new THREE.MeshStandardMaterial({
        map: sideBrick.colorTex,
        bumpMap: sideBrick.bumpTex,
        bumpScale: 0.3,
        roughness: 0.9,
      }),
      new THREE.MeshStandardMaterial({ color: roofFascia, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: '#3A2A2A', roughness: 0.95 }),
      new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.75 }),
      new THREE.MeshStandardMaterial({
        map: frontBrick.colorTex,
        bumpMap: frontBrick.bumpTex,
        bumpScale: 0.35,
        roughness: 0.85,
      }),
    ],
    [frontTex, frontBrick, sideBrick]
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.18 + scroll.current * Math.PI * 2
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* === MAIN BUILDING BODY === */}
      <mesh position={[0, H / 2, 0]} material={bodyMats}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* === GABLE ROOF === */}
      <mesh position={[0, H, 0]} geometry={roofGeo}>
        <meshStandardMaterial color={roofColor} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Roof fascia (ridge cap) */}
      <mesh position={[0, H + roofPeak + 0.02, 0]}>
        <boxGeometry args={[0.12, 0.06, D + 0.35]} />
        <meshStandardMaterial color={roofFascia} roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Eave trim - front */}
      <mesh position={[0, H - 0.02, D / 2 + 0.16]}>
        <boxGeometry args={[W + 0.32, 0.1, 0.06]} />
        <meshStandardMaterial color={roofFascia} roughness={0.8} />
      </mesh>
      {/* Eave trim - back */}
      <mesh position={[0, H - 0.02, -(D / 2 + 0.16)]}>
        <boxGeometry args={[W + 0.32, 0.1, 0.06]} />
        <meshStandardMaterial color={roofFascia} roughness={0.8} />
      </mesh>

      {/* === FRONT FACE DETAILS === */}
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

      {/* Front windows */}
      {[-1.6, -0.5, 1.6].map((x, i) => (
        <mesh key={`fw-${i}`} position={[x, H * 0.55, D / 2 + 0.01]}>
          <boxGeometry args={[0.6, 0.35, 0.03]} />
          <meshStandardMaterial color={windowColor} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}

      {/* === BACK WALL DETAILS === */}
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

      {/* === SIGN — CENTERED IN FRONT, DOUBLE-SIDED (faces both road directions) === */}
      {/* Sign pole */}
      <mesh position={[0, 1.5, D / 2 + 1.8]}>
        <cylinderGeometry args={[0.05, 0.06, 3.2, 8]} />
        <meshStandardMaterial color="#555" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Logo - front face (facing camera / road direction 1) */}
      <mesh position={[0, 2.8, D / 2 + 1.8]}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshStandardMaterial map={logoTex} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Red illuminated sign below logo */}
      <mesh position={[0, 2.0, D / 2 + 1.8]}>
        <boxGeometry args={[0.8, 0.25, 0.08]} />
        <meshStandardMaterial
          color="#CC3300"
          emissive="#CC3300"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* "RACK N ROLL" text sign below — also double-sided */}
      <mesh position={[0, 1.55, D / 2 + 1.8]}>
        <boxGeometry args={[0.9, 0.18, 0.06]} />
        <meshStandardMaterial
          color="#1A7A3A"
          emissive="#1A7A3A"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* === GROUND — BIGGER PARKING LOT === */}
      {/* Main parking lot (extends further out front and right) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.0, -0.01, 2.5]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={asphalt} roughness={0.95} />
      </mesh>

      {/* Parking lot behind building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.0, -0.01, -2.5]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color={asphalt} roughness={0.95} />
      </mesh>

      {/* Parking lines — front lot (more spaces) */}
      {[-2.5, -1.2, 0.1, 1.4, 2.7, 4.0, 5.3].map((x, i) => (
        <mesh
          key={`pl-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.002, 3.5]}
        >
          <planeGeometry args={[0.05, 2.0]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      ))}

      {/* Parking lines — side lot */}
      {[0, 1.3, 2.6, 3.9].map((z, i) => (
        <mesh
          key={`pls-${i}`}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[W / 2 + 1.5, 0.002, z - 0.5]}
        >
          <planeGeometry args={[0.05, 1.8]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      ))}

      {/* Grass (left side) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, -0.005, 0]}>
        <planeGeometry args={[4, 8]} />
        <meshStandardMaterial color={grassColor} roughness={0.95} />
      </mesh>

      {/* Grass strip between lot and sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, -0.005, D / 2 + 0.6]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial color={grassColor} roughness={0.95} />
      </mesh>

      {/* Sidewalk (front) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, D / 2 + 5.2]}>
        <planeGeometry args={[14, 0.7]} />
        <meshStandardMaterial color={sidewalkColor} roughness={0.9} />
      </mesh>

      {/* Road (W 38th St) — wider */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, D / 2 + 7]}>
        <planeGeometry args={[16, 3]} />
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </mesh>
      {/* Yellow center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, D / 2 + 7]}>
        <planeGeometry args={[14, 0.04]} />
        <meshStandardMaterial color="#C8A830" />
      </mesh>

      {/* Grass across road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, D / 2 + 10]}>
        <planeGeometry args={[16, 4]} />
        <meshStandardMaterial color="#5A9944" roughness={0.95} />
      </mesh>

      {/* === DUMPSTER (right-rear) === */}
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
      <ambientLight intensity={0.5} />
      {/* Main sun — warm, casts across the brick */}
      <directionalLight position={[6, 10, 4]} intensity={1.0} color="#FFF5E8" />
      {/* Fill — cool side light to catch brick texture */}
      <directionalLight position={[-4, 6, -3]} intensity={0.4} color="#C8D0E0" />
      {/* Low-angle light to rake across brick and show texture */}
      <directionalLight position={[3, 1.5, 5]} intensity={0.3} color="#FFDDAA" />
      {/* Warm entrance light */}
      <pointLight position={[0.4, 0.8, 2.5]} intensity={0.6} color="#FFCC66" distance={4} />
      {/* Green neon glow */}
      <pointLight position={[-1.6, 0.8, 2]} intensity={0.4} color="#1A7A3A" distance={3} />
      {/* Sign light — centered now */}
      <pointLight position={[0, 3, 3.5]} intensity={0.5} color="#1A7A3A" distance={5} />
    </>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 3.5, 8.5], fov: 38 }}
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
        scale={20}
        size={1.2}
        speed={0.15}
        color="#1A7A3A"
        opacity={0.2}
      />
    </Canvas>
  )
}
