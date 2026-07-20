'use client'

import { useEffect, useRef, useState } from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting)
        },
        { threshold: 0, rootMargin: "-40% 0px -40% 0px", ...options }
      )

      observer.observe(el)
      return () => observer.disconnect()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return { ref, isInView }
}
