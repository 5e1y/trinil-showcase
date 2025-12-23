import { useEffect, useRef } from 'react'

/**
 * useSlotShuffleAnimation
 * Combine un effet de shuffle rapide (mélange) avec une animation de "machine à sous" (slide vertical) pour chaque icône.
 * @param trigger Dépendance pour déclencher l'animation (ex: bundleIndex)
 * @param onShuffleEnd Callback appelé avec l'index final à afficher
 * @param iconBundles Tableau des bundles d'icônes
 * @param shuffleDuration Durée totale de l'animation (ms)
 * @param shuffleInterval Intervalle entre chaque shuffle (ms)
 * @param setSlotStates Setter pour l'état d'animation de chaque slot (icône)
 */
export function useSlotShuffleAnimation({
  trigger,
  onShuffleEnd,
  iconBundles,
  shuffleDuration = 700,
  shuffleInterval = 60,
  setSlotStates,
}) {
  const shuffleTimeout = useRef<NodeJS.Timeout | null>(null)
  const shuffleStep = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let elapsed = 0
    let current = 0
    if (shuffleTimeout.current) clearTimeout(shuffleTimeout.current)
    if (shuffleStep.current) clearTimeout(shuffleStep.current)

    function doShuffle() {
      current = Math.floor(Math.random() * iconBundles.length)
      onShuffleEnd(current)
      // Pour chaque slot, on déclenche une animation de slide
      setSlotStates && setSlotStates([
        Math.random(),
        Math.random(),
        Math.random()
      ])
      elapsed += shuffleInterval
      if (elapsed < shuffleDuration) {
        shuffleStep.current = setTimeout(doShuffle, shuffleInterval)
      }
    }
    doShuffle()
    shuffleTimeout.current = setTimeout(() => {
      onShuffleEnd(trigger) // Affiche le vrai index à la fin
      setSlotStates && setSlotStates([0,0,0]) // Reset animation
    }, shuffleDuration + shuffleInterval)
    return () => {
      if (shuffleTimeout.current) clearTimeout(shuffleTimeout.current)
      if (shuffleStep.current) clearTimeout(shuffleStep.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])
}
