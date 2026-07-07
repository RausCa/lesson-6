import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

interface Options {
  /** Fraction of the element visible before triggering. */
  threshold?: number
  /** Only reveal once (default true). */
  once?: boolean
  /** Root margin passed to IntersectionObserver. */
  rootMargin?: string
}

/**
 * Tracks whether an element has scrolled into view.
 * Returns a template ref to attach and a reactive `isVisible` flag.
 */
export function useInView<T extends HTMLElement = HTMLElement>(options: Options = {}) {
  const { threshold = 0.2, once = true, rootMargin = '0px 0px -10% 0px' } = options
  const target = ref<T | null>(null) as Ref<T | null>
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // Respect reduced motion: reveal immediately.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (once && observer) observer.disconnect()
          } else if (!once) {
            isVisible.value = false
          }
        }
      },
      { threshold, rootMargin },
    )

    if (target.value) observer.observe(target.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { target, isVisible }
}
