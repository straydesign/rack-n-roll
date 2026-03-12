"use client";

import { Component, Suspense, useRef, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// Error boundary — if WebGL/Three.js fails, render nothing instead of crashing the page
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

  componentDidCatch() {
    console.warn("SpinningLogo3D: WebGL/Three.js failed, hiding 3D logo");
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function LogoModel({ spinning = true }: { spinning?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/images/logo.glb");

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.1 / maxDim;

    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.set(
      -center.x * scale,
      -center.y * scale - 0.58,
      -center.z * scale
    );
  }, [clonedScene]);

  useFrame((_state, delta) => {
    if (groupRef.current && spinning) {
      groupRef.current.rotation.y += delta * 1.2;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.15, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function SpinningLogo3D({
  className = "",
  spinning = true,
  cameraZ = 4.5,
}: {
  className?: string;
  spinning?: boolean;
  cameraZ?: number;
}) {
  return (
    <WebGLErrorBoundary>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className={className}
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
            <LogoModel spinning={spinning} />
          </Suspense>
        </Canvas>
      </motion.div>
    </WebGLErrorBoundary>
  );
}
