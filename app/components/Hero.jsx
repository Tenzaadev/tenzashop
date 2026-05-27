'use client'
import { Suspense, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useI18n } from '@/i18n'

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

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
          <ambientLight intensity={0.2} />
          <pointLight position={[3, 3, 3]} intensity={1.5} color="#ccff00" />
          <pointLight position={[-3, -2, 2]} intensity={0.8} color="#ffffff" />
          <Suspense fallback={null}>
            <FloatingRings />
            <Particles count={300} />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_80%)] z-[1] pointer-events-none" />

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
        >
          <h1 className="relative text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-6 select-none">
            <span className="relative text-white">
              TENZA
              <span className="absolute inset-0 text-[#ccff00] animate-pulse opacity-70" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 65%)', left: '-3px' }}>
                TENZA
              </span>
              <span className="absolute inset-0 text-red-500 animate-pulse opacity-50" style={{ clipPath: 'polygon(0 65%, 100% 35%, 100% 100%, 0 100%)', left: '3px' }}>
                TENZA
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 mb-8 max-w-xl mx-auto font-light leading-relaxed">
            {t('hero_subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#products"
            className="px-8 py-4 bg-[#ccff00] text-black font-bold rounded-full text-lg hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-shadow"
          >
            {t('view_collection')}
          </motion.a>

        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-[#ccff00] rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}