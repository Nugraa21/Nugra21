import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
  const blobRefs = useRef([])
  const particleRefs = useRef([])
  const sparkleRefs = useRef([])

  const initialPositions = [
    { x: -4, y: 0 },
    { x: -4, y: 0 },
    { x: 20, y: -8 },
    { x: 20, y: -8 },
  ]

  useEffect(() => {
    let currentScroll = 0
    let requestId

    const handleScroll = () => {
      const newScroll = window.pageYOffset
      const scrollDelta = newScroll - currentScroll
      currentScroll = newScroll

      // Animate blobs
      blobRefs.current.forEach((blob, index) => {
        const initialPos = initialPositions[index]
        const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340
        const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40
        const x = initialPos.x + xOffset
        const y = initialPos.y + yOffset

        blob.style.transform = `translate(${x}px, ${y}px)`
        blob.style.transition = "transform 1.4s ease-out"
      })

      // Move particles upward slightly
      particleRefs.current.forEach((p, i) => {
        const y = -newScroll * 0.1 + i * 20
        p.style.transform = `translateY(${y}px)`
      })

      // Sparkle shimmer scroll effect
      sparkleRefs.current.forEach((s, i) => {
        const y = Math.sin(newScroll / 60 + i) * 10
        s.style.transform = `translateY(${y}px)`
      })

      requestId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(requestId)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Blobs */}
      <div className="absolute inset-0">
        <div
          ref={(ref) => (blobRefs.current[0] = ref)}
          className="absolute top-0 -left-10 md:w-[28rem] md:h-[28rem] w-72 h-72 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-full mix-blend-screen filter blur-[140px] opacity-40 md:opacity-30"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[1] = ref)}
          className="absolute top-0 -right-10 w-[28rem] h-[28rem] bg-gradient-to-br from-cyan-400 to-sky-500 rounded-full mix-blend-screen filter blur-[140px] opacity-40 md:opacity-30 hidden sm:block"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[2] = ref)}
          className="absolute -bottom-16 left-[-30%] md:left-24 w-[28rem] h-[28rem] bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full mix-blend-screen filter blur-[140px] opacity-50 md:opacity-30"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[3] = ref)}
          className="absolute -bottom-16 right-24 w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-500 to-violet-400 rounded-full mix-blend-screen filter blur-[140px] opacity-30 md:opacity-20 hidden sm:block"
        ></div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            ref={(ref) => (particleRefs.current[i] = ref)}
            className="absolute w-24 h-24 rounded-full opacity-10 bg-white blur-2xl transition-transform duration-[3000ms] ease-in-out"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
              animation: "float 6s ease-in-out infinite",
              animationDelay: `${i * 0.5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            ref={(ref) => (sparkleRefs.current[i] = ref)}
            className="absolute w-2 h-2 rounded-full bg-white opacity-60 blur-sm animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none"></div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-20px) }
          100% { transform: translateY(0px) }
        }
      `}</style>
    </div>
  )
}

export default AnimatedBackground
