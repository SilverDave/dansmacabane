import { nextTick, onMounted, onUnmounted, watch, type Ref } from 'vue'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
  className?: string
}

/**
 * Observe elements and add a CSS class when they enter the viewport.
 * Usage: bind `data-reveal` attribute on target elements, then call this composable.
 */
export function useScrollReveal(
  containerRef?: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {},
  triggerRef?: Ref<unknown> 
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -60px 0px',
    once = true,
    className = 'is-visible',
  } = options

  let observer: IntersectionObserver | null = null

  async function observe() {
    await nextTick()
    const root = containerRef?.value ?? document
    const targets = root.querySelectorAll('[data-reveal]')

    observer?.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(className)
            if (once) observer?.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove(className)
          }
        })
      },
      { threshold, rootMargin }
    )

    targets.forEach((el) => observer!.observe(el))
  }

  onMounted(() => observe())
  onUnmounted(() => observer?.disconnect())

  if (triggerRef) {
    watch(triggerRef, () => observe())
  }

  return { observe }
}
