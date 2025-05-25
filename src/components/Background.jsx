import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
  const blobRefs = useRef([])
  const sparkleRefs = useRef([])
  const particleRefs = useRef([])

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
      currentScroll = newScroll

      blobRefs.current.forEach((blob, index) => {
        const initialPos = initialPositions[index]
        const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340
        const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40
        const x = initialPos.x + xOffset
        const y = initialPos.y + yOffset
        blob.style.transform = `translate(${x}px, ${y}px)`
        blob.style.transition = "transform 1.4s ease-out"
      })

      particleRefs.current.forEach((p, i) => {
        const y = Math.sin(newScroll / 50 + i) * 10
        p.style.transform = `translateY(${y}px)`
      })

      sparkleRefs.current.forEach((s, i) => {
        const y = Math.cos(newScroll / 60 + i) * 6
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
      {/* 🌓 Setengah lingkaran terang di pojok kanan atas */}
      <div className="absolute -top-[220px] -right-[200px] w-[700px] h-[350px] rounded-b-full bg-gradient-to-tr from-orange-300 via-pink-400 to-purple-400 opacity-60 blur-2xl rotate-[20deg]"></div>

      {/* 🔮 Blob Gradasi terang */}
      <div className="absolute inset-0">
        <div
          ref={(ref) => (blobRefs.current[0] = ref)}
          className="absolute top-0 -left-10 md:w-[28rem] md:h-[28rem] w-72 h-72 bg-gradient-to-br from-fuchsia-400 to-purple-400 rounded-full mix-blend-screen filter blur-[120px] opacity-60"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[1] = ref)}
          className="absolute top-0 -right-10 w-[28rem] h-[28rem] bg-gradient-to-br from-cyan-300 to-sky-400 rounded-full mix-blend-screen filter blur-[120px] opacity-50 hidden sm:block"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[2] = ref)}
          className="absolute -bottom-16 left-[-30%] md:left-24 w-[28rem] h-[28rem] bg-gradient-to-tr from-pink-400 to-orange-300 rounded-full mix-blend-screen filter blur-[120px] opacity-60"
        ></div>
        <div
          ref={(ref) => (blobRefs.current[3] = ref)}
          className="absolute -bottom-16 right-24 w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-400 to-violet-400 rounded-full mix-blend-screen filter blur-[120px] opacity-50 hidden sm:block"
        ></div>
      </div>

      {/* ✨ Partikel besar dan terang */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            ref={(ref) => (particleRefs.current[i] = ref)}
            className="absolute w-[6px] h-[6px] rounded-full bg-white opacity-80 blur-sm animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* ✨ Sparkles lebih cerah */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            ref={(ref) => (sparkleRefs.current[i] = ref)}
            className="absolute w-[5px] h-[5px] rounded-full bg-white opacity-70 blur-[1.5px] animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 🔲 Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none"></div>
    </div>
  )
}

export default AnimatedBackground
