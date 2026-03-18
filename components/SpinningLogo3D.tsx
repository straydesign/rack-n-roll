"use client";

import { Component, Suspense, useRef, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import Image from "next/image";
import * as THREE from "three";

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function StaticLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <div className="w-2/3 h-2/3 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
        <Image
          src="/logo.jpg"
          alt="Rack N Roll"
          width={200}
          height={200}
          className="w-3/4 h-3/4 object-contain"
          priority
        />
      </div>
    </div>
  );
}

function LogoModel({ spinning = true, onReady }: { spinning?: boolean; onReady?: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const readyFired = useRef(false);
  const { scene } = useGLTF("/images/logo.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.5 / maxDim;
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.set(
      -center.x * scale,
      -center.y * scale - 0.09,
      -center.z * scale
    );
  }, [clonedScene]);

  useFrame((_state, delta) => {
    if (groupRef.current && spinning) {
      groupRef.current.rotation.y += delta * 1.2;
    }
    // Signal ready after the first frame with the model actually rendering
    if (!readyFired.current && groupRef.current) {
      readyFired.current = true;
      onReady?.();
    }
  });

  return (
    <group ref={groupRef} rotation={[0.15, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/images/logo.glb");

export default function SpinningLogo3D({
  className = "",
  spinning = true,
  cameraZ = 3.8,
}: {
  className?: string;
  spinning?: boolean;
  cameraZ?: number;
}) {
  const [canvasReady, setCanvasReady] = useState(false);

  return (
    <WebGLErrorBoundary fallback={<StaticLogo className={className} />}>
      <div className={`relative ${className}`}>
        {/* Static placeholder — sits behind, visible until canvas paints over it */}
        {!canvasReady && (
          <div className="absolute inset-0 z-[1]">
            <StaticLogo className="w-full h-full" />
          </div>
        )}

        {/* 3D Canvas — fades in on top */}
        <div
          className="w-full h-full relative z-[2] transition-opacity duration-700"
          style={{ opacity: canvasReady ? 1 : 0 }}
        >
          <Canvas
            camera={{ position: [0, 0, cameraZ], fov: 30 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
          >
            <Environment preset="sunset" environmentIntensity={3.0} />
            <ambientLight intensity={3.0} />
            <directionalLight position={[5, 8, 5]} intensity={8.0} />
            <directionalLight position={[-5, 5, 3]} intensity={5.0} />
            <directionalLight position={[0, -3, 5]} intensity={4.0} />
            <directionalLight position={[3, 0, -4]} intensity={3.0} />
            <directionalLight position={[0, 5, 0]} intensity={4.0} />

            <Suspense fallback={null}>
              <LogoModel spinning={spinning} onReady={() => setCanvasReady(true)} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </WebGLErrorBoundary>
  );
}
