'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
// drei no longer needed — plain lighting only
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

interface MeshData {
  geometry: THREE.BufferGeometry
  color: string
}

// CSS class → fill color from the SVG's <style> block
const CLASS_COLORS: Record<string, string> = {
  st0: '#2a2a2a',
  st1: '#1A7A3A',
  st2: '#FAF7F2',
}

function inlineSvgFills(svgText: string): string {
  let result = svgText
  for (const [cls, color] of Object.entries(CLASS_COLORS)) {
    result = result.replaceAll(`class="${cls}"`, `fill="${color}"`)
  }
  return result
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
        // Inline fill colors so SVGLoader can read them
        const inlined = inlineSvgFills(svgText)
        const loader = new SVGLoader()
        const data = loader.parse(inlined)

        const colorGroups = new Map<string, THREE.Shape[]>()

        for (const path of data.paths) {
          const hex = '#' + path.color.getHexString()
          const shapes = SVGLoader.createShapes(path)
          if (shapes.length === 0) continue
          if (!colorGroups.has(hex)) colorGroups.set(hex, [])
          colorGroups.get(hex)!.push(...shapes)
        }

        const extrudeSettings: THREE.ExtrudeGeometryOptions = {
          depth: 12,
          bevelEnabled: true,
          bevelThickness: 1.5,
          bevelSize: 1,
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
      .catch((err) => {
        console.error('Logo3D: Failed to load SVG', err)
      })
  }, [])

  useEffect(() => {
    if (!innerRef.current || meshData.length === 0) return

    const box = new THREE.Box3().setFromObject(innerRef.current)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y)
    const scale = 4 / maxDim

    innerRef.current.scale.set(scale, -scale, scale)
    innerRef.current.position.set(
      -center.x * scale,
      center.y * scale,
      -size.z * scale * 0.5
    )

    setCentered(true)
  }, [meshData])

  // Dispose geometries on unmount
  useEffect(() => {
    return () => {
      meshData.forEach((m) => m.geometry.dispose())
    }
  }, [meshData])

  // Static — no rotation

  return (
    <group ref={outerRef} rotation={[0.15, 0, 0]}>
      <group ref={innerRef} visible={centered}>
        {meshData.map((m, i) => (
          <mesh key={i} geometry={m.geometry}>
            <meshLambertMaterial color={m.color} />
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
        <ambientLight intensity={2.5} />

        <Suspense fallback={null}>
          <ExtrudedLogo />
        </Suspense>
      </Canvas>
    </div>
  )
}
