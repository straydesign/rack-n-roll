'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

interface MeshData {
  geometry: THREE.BufferGeometry
  color: string
}

function ExtrudedLogo() {
  const outerRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)
  const [meshData, setMeshData] = useState<MeshData[]>([])
  const [centered, setCentered] = useState(false)

  useEffect(() => {
    fetch('/logo.svg')
      .then((r) => r.text())
      .then((svgText) => {
        const loader = new SVGLoader()
        const data = loader.parse(svgText)

        // Group shapes by fill color
        const colorGroups = new Map<string, THREE.Shape[]>()

        for (const path of data.paths) {
          const hex = '#' + path.color.getHexString()
          const shapes = SVGLoader.createShapes(path)
          if (shapes.length === 0) continue
          if (!colorGroups.has(hex)) colorGroups.set(hex, [])
          colorGroups.get(hex)!.push(...shapes)
        }

        // Extrude each color group into a single merged mesh
        // SVG is 825x825, depth ~1/8 of height = ~103
        const extrudeSettings: THREE.ExtrudeGeometryOptions = {
          depth: 103,
          bevelEnabled: true,
          bevelThickness: 6,
          bevelSize: 3,
          bevelSegments: 3,
        }

        const result: MeshData[] = []

        colorGroups.forEach((shapes, color) => {
          const geometries = shapes.map(
            (s) => new THREE.ExtrudeGeometry(s, extrudeSettings)
          )
          const merged = mergeGeometries(geometries, false)
          if (merged) {
            result.push({ geometry: merged, color })
          }
          geometries.forEach((g) => g.dispose())
        })

        setMeshData(result)
      })
  }, [])

  // Center and scale after geometry is ready
  useEffect(() => {
    if (!innerRef.current || meshData.length === 0) return

    const box = new THREE.Box3().setFromObject(innerRef.current)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y)
    const scale = 4 / maxDim

    // SVG Y is flipped vs Three.js — scale Y negative
    innerRef.current.scale.set(scale, -scale, scale)
    innerRef.current.position.set(
      -center.x * scale,
      center.y * scale,
      -size.z * scale * 0.5
    )

    setCentered(true)
  }, [meshData])

  // Slow auto-rotation
  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.3
    }
  })

  const getMaterial = (color: string) => {
    const isGreen = color === '#22c55e'
    const isDark = color === '#1a1a1a'

    return (
      <meshStandardMaterial
        color={color}
        metalness={isGreen ? 0.5 : isDark ? 0.7 : 0.3}
        roughness={isGreen ? 0.25 : isDark ? 0.3 : 0.4}
        emissive={isGreen ? '#22c55e' : '#000000'}
        emissiveIntensity={isGreen ? 0.15 : 0}
      />
    )
  }

  return (
    <group ref={outerRef}>
      <group ref={innerRef} visible={centered}>
        {meshData.map((m, i) => (
          <mesh key={i} geometry={m.geometry}>
            {getMaterial(m.color)}
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function Logo3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight
          position={[-3, -2, 4]}
          intensity={0.4}
          color="#22c55e"
        />
        <pointLight
          position={[0, 0, 6]}
          intensity={0.5}
          color="#22c55e"
          distance={15}
        />
        <Suspense fallback={null}>
          <ExtrudedLogo />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
