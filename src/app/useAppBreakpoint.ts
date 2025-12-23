import { useIsMobile } from '@/components/ui/use-mobile'

export function useAppBreakpoint() {
  // Simple breakpoint identique à Landing : mobile < 768px
  return useIsMobile()
}
