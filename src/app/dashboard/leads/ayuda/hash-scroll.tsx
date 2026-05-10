"use client"

import { useEffect } from "react"

export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return

    const timer = setTimeout(() => {
      const el = document.getElementById(hash)
      if (!el) return

      const trigger = el.querySelector('[data-slot="accordion-trigger"]')
      if (trigger && el.getAttribute("data-state") === "closed") {
        ;(trigger as HTMLElement).click()
      }

      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return null
}
