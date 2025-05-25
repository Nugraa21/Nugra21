import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
	const blobRefs = useRef([])
	const initialPositions = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	]

	useEffect(() => {
		const handleScroll = () => {
			const newScroll = window.pageYOffset

			blobRefs.current.forEach((blob, index) => {
				if (!blob) return

				const initialPos = initialPositions[index]
				const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 120 // lebih kecil
				const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 30

				const x = initialPos.x + xOffset
				const y = initialPos.y + yOffset

				// Batasi posisi agar tidak keluar dari viewport
				const clampedX = Math.max(-300, Math.min(300, x))
				const clampedY = Math.max(-200, Math.min(200, y))

				blob.style.transform = `translate(${clampedX}px, ${clampedY}px)`
			})
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
			<div className="absolute inset-0">
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className="absolute top-0 -left-4 w-72 h-72 md:w-96 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 md:opacity-20 will-change-transform transition-transform duration-1000 ease-out"
				/>
				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className="absolute top-0 -right-4 w-72 h-72 md:w-96 md:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 md:opacity-20 hidden sm:block will-change-transform transition-transform duration-1000 ease-out"
				/>
				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className="absolute -bottom-8 left-[-40%] md:left-20 w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 md:opacity-20 will-change-transform transition-transform duration-1000 ease-out"
				/>
				<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className="absolute -bottom-10 right-20 w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 md:opacity-10 hidden sm:block will-change-transform transition-transform duration-1000 ease-out"
				/>
			</div>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]" />
		</div>
	)
}

export default AnimatedBackground
