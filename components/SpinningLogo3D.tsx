"use client";

import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function LogoModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/images/logo.glb");

  // Clone so useGLTF cache doesn't cause issues
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Auto-fit to camera view
  useEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxDim;

    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );
  }, [clonedScene]);

  useFrame((_state, delta) => {
    if (groupRef.current) {
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
}: {
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className={className}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 30 }}
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
          <LogoModel />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
