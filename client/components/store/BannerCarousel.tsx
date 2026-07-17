'use client'

import { useState, useEffect, useCallback } from 'react'

function getSrc(slide) {
  if (typeof slide === 'string') return slide
  return slide.desktop || slide.mobile
}

function BannerImage({ slide, isActive }) {
  const src = getSrc(slide)
  const mobileSrc = typeof slide === 'object' ? slide.mobile : null

  return (
    <picture className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      {mobileSrc && <source media="(max-width: 768px)" srcSet={mobileSrc} />}
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
      />
    </picture>
  )
}

export function BannerCarousel({ images }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative w-full mx-auto" style={{ maxWidth: '80rem' }}>
      <img src={getSrc(images[0])} className="w-full h-auto invisible" />

      {images.map((slide, i) => (
        <BannerImage key={i} slide={slide} isActive={i === current} />
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i === current
                  ? 'var(--color-primary)'
                  : 'rgba(255,255,255,0.5)',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
