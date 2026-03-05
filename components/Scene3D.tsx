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
    const targetZ = 7 - Math.min(scroll.current, 1.2) * 3.5
    const targetY = 2.5 - Math.min(scroll.current, 1) * 0.8
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04)
    camera.position.x = Math.sin(t * 0.12) * 0.25
    camera.lookAt(0, 0.6, 0)
  })

  return null
}

function Building() {
  const groupRef = useRef<THREE.Group>(null)
  const buildingTex = useTexture('/building.jpg')
  const logoTex = useTexture('/logo.jpg')
  const scroll = useScrollRef()

  // Brick-like color for sides
  const brick = '#7A6050'
  const brickDark = '#5C4538'
  const roofColor = '#2E1F15'
  const stone = '#9A9080'
  const asphalt = '#3A3A3A'

  // Side materials for main building box (right, left, top, bottom, front, back)
  const bodyMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: brick, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: brick, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: brickDark, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: buildingTex, roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: brickDark, roughness: 0.9 }),
    ],
    [buildingTex]
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.2 + scroll.current * Math.PI * 2
  })

  return (
    <group ref={groupRef}>
      {/* ---- MAIN BUILDING ---- */}
      <mesh position={[0, 0.8, 0]} material={bodyMaterials}>
        <boxGeometry args={[4.2, 1.6, 2.2]} />
      </mesh>

      {/* ---- ROOF OVERHANG ---- */}
      <mesh position={[0, 1.72, 0]}>
        <boxGeometry args={[4.5, 0.15, 2.5]} />
        <meshStandardMaterial color={roofColor} roughness={0.8} />
      </mesh>

      {/* ---- STONE ENTRANCE FACADE ---- */}
      <mesh position={[0.3, 0.65, 1.16]}>
        <boxGeometry args={[1.4, 1.3, 0.15]} />
        <meshStandardMaterial color={stone} roughness={0.85} />
      </mesh>
      {/* Door */}
      <mesh position={[0.3, 0.45, 1.25]}>
        <boxGeometry args={[0.55, 0.9, 0.05]} />
        <meshStandardMaterial color="#1A1208" roughness={0.5} />
      </mesh>

      {/* ---- NEON WINDOW (left of entrance) ---- */}
      <mesh position={[-0.8, 0.75, 1.12]}>
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#1A7A3A"
          emissive="#1A7A3A"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* ---- SIGN POLE ---- */}
      <mesh position={[-2.8, 1.2, 0.6]}>
        <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
        <meshStandardMaterial color="#666" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Sign crossbar */}
      <mesh position={[-2.8, 2.35, 0.6]}>
        <boxGeometry args={[0.06, 0.06, 0.5]} />
        <meshStandardMaterial color="#666" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Logo sign */}
      <mesh position={[-2.8, 2.35, 0.6]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshStandardMaterial
          map={logoTex}
          transparent
          side={THREE.DoubleSide}
          roughness={0.3}
        />
      </mesh>

      {/* ---- CAPTAIN MORGAN SIGN (below main sign) ---- */}
      <mesh position={[-2.8, 1.6, 0.6]}>
        <boxGeometry args={[0.7, 0.25, 0.05]} />
        <meshStandardMaterial
          color="#CC3300"
          emissive="#CC3300"
          emissiveIntensity={0.3}
          roughness={0.3}
        />
      </mesh>

      {/* ---- PARKING LOT ---- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0.5]}>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color={asphalt} roughness={0.95} />
      </mesh>

      {/* Parking lines */}
      {[-1.5, 0, 1.5].map((x) => (
        <mesh
          key={x}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.005, 2.8]}
        >
          <planeGeometry args={[0.06, 1.8]} />
          <meshStandardMaterial color="#888" roughness={0.9} />
        </mesh>
      ))}

      {/* ---- SIDEWALK ---- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 1.4]}>
        <planeGeometry args={[5, 0.5]} />
        <meshStandardMaterial color="#8A8478" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[0.3, 0.8, 2]}
        intensity={0.8}
        color="#FFCC66"
        distance={5}
      />
      <pointLight
        position={[-2.8, 2, 1.5]}
        intensity={0.5}
        color="#1A7A3A"
        distance={6}
      />
    </>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 7], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <CameraRig />
      <Lights />
      <Suspense fallback={null}>
        <Building />
      </Suspense>
      <Sparkles
        count={40}
        scale={16}
        size={1.5}
        speed={0.2}
        color="#1A7A3A"
        opacity={0.3}
      />
    </Canvas>
  )
}
