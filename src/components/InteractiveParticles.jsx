import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractiveParticles({ count = 1200 }) {
  const pointsRef = useRef();
  const { viewport } = useThree();

  // Create initial random particle positions and store their original home coordinates
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spawn particles randomly in a large bounding sphere/cube
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = THREE.MathUtils.randFloat(4, 25);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

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

    // Map mouse coordinates to 3D coordinate space near active plane
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

      // 1. Slow drift motion
      px += Math.sin(t * 0.15 + hx) * 0.004;
      py += Math.cos(t * 0.2 + hy) * 0.004;
      pz += Math.sin(t * 0.1 + hz) * 0.004;

      // 2. Cursor repulsion field
      dummyVec.set(px, py, pz);
      const dist = dummyVec.distanceTo(mouse3D);

      if (dist < 4.5) {
        const dir = dummyVec.sub(mouse3D).normalize();
        const force = (4.5 - dist) * 0.07;
        px += dir.x * force;
        py += dir.y * force;
        pz += dir.z * force;
      }

      // 3. Elastic return force
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
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
