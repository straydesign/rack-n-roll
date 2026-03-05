'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Sparkles } from '@react-three/drei'
import { useRef, useEffect, Suspense } from 'react'
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
    const target = 5 - Math.min(scroll.current, 1.2) * 3.5
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, target, 0.05)
    camera.position.x = Math.sin(t * 0.15) * 0.15
    camera.position.y = Math.cos(t * 0.1) * 0.1
  })

  return null
}

function Logo() {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture('/logo.jpg')
  const scroll = useScrollRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y = t * 0.35 + scroll.current * Math.PI * 3
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.08
    meshRef.current.rotation.z = Math.cos(t * 0.15) * 0.03
    const pulse = 1 + Math.sin(t * 0.5) * 0.015
    meshRef.current.scale.setScalar(pulse)
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2.6, 2.6, 0.12]} />
      <meshStandardMaterial
        map={texture}
        transparent
        roughness={0.3}
        metalness={0.15}
      />
    </mesh>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <CameraRig />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <pointLight position={[0, 0, -3]} intensity={2.5} color="#1A7A3A" distance={12} />
      <pointLight position={[-3, 2, 3]} intensity={0.8} color="#1A7A3A" />
      <pointLight position={[3, -2, 2]} intensity={0.4} color="#145C2C" />
      <Suspense fallback={null}>
        <Logo />
      </Suspense>
      <Sparkles
        count={60}
        scale={14}
        size={2}
        speed={0.3}
        color="#1A7A3A"
        opacity={0.4}
      />
    </Canvas>
  )
}
