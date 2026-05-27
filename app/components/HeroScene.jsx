'use client'
import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function FloatingRings() {
  const group = useRef()
  const rings = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    radius: 1.5 + i * 0.8,
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    speed: 0.2 + i * 0.15,
    color: i === 0 ? '#ccff00' : '#ffffff',
  })), [])

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.1
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5
    }
  })

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={ring.rotation}>
          <torusGeometry args={[ring.radius, 0.02, 16, 100]} />
          <meshStandardMaterial color={ring.color} emissive={ring.color} emissiveIntensity={0.8} roughness={0.1} metalness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Particles({ count = 200 }) {
  const points = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05
      points.current.rotation.x = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ccff00" sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#ccff00" />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#ffffff" />
      <Suspense fallback={null}>
        <FloatingRings />
        <Particles count={300} />
      </Suspense>
    </Canvas>
  )
}
