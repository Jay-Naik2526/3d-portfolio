import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractiveParticles({ count = 1200 }) {
  const pointsRef = useRef();
  const { viewport } = useThree();

  // Create initial random particle positions, restricting them to the background 
  // and keeping the center area clear of particles to avoid text overlap.
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;
      let valid = false;

      while (!valid) {
        // Spawn particles in a background bounding volume
        x = THREE.MathUtils.randFloat(-24, 24);
        y = THREE.MathUtils.randFloat(-14, 14);
        z = THREE.MathUtils.randFloat(-30, -6); // Strictly behind active panels (Z = 0)

        // Exclude the central screen region to prevent overlapping with front-facing text panels
        if (Math.abs(x) > 7.5 || Math.abs(y) > 4.5) {
          valid = true;
        }
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      home[i * 3] = x;
      home[i * 3 + 1] = y;
      home[i * 3 + 2] = z;
    }

    return [pos, home];
  }, [count]);

  const dummyVec = new THREE.Vector3();
  const mouse3D = new THREE.Vector3();

  useFrame((state) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const t = state.clock.getElapsedTime();

    // Map mouse screen coordinates to the active Z=0 plane
    mouse3D.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0
    );

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let px = posAttr.array[idx];
      let py = posAttr.array[idx + 1];
      let pz = posAttr.array[idx + 2];

      const hx = initialPositions[idx];
      const hy = initialPositions[idx + 1];
      const hz = initialPositions[idx + 2];

      // 1. Slow, organic background drift
      px += Math.sin(t * 0.12 + hx) * 0.003;
      py += Math.cos(t * 0.18 + hy) * 0.003;
      pz += Math.sin(t * 0.08 + hz) * 0.003;

      // 2. Cursor repulsion calculated in 2D (X/Y projection)
      const dist2D = Math.hypot(px - mouse3D.x, py - mouse3D.y);

      if (dist2D < 4.0) {
        const dx = px - mouse3D.x;
        const dy = py - mouse3D.y;
        const len = Math.hypot(dx, dy) || 1;
        const force = (4.0 - dist2D) * 0.06;
        
        px += (dx / len) * force;
        py += (dy / len) * force;
      }

      // 3. Elastic return force to pull particles back to original coordinates
      px += (hx - px) * 0.015;
      py += (hy - py) * 0.015;
      pz += (hz - pz) * 0.015;

      posAttr.array[idx] = px;
      posAttr.array[idx + 1] = py;
      posAttr.array[idx + 2] = pz;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        sizeAttenuation={true}
        color="#00f3ff"
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
