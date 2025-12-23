import { useEffect, useRef } from 'react'

/**
 * useSlotShuffleAnimationStable
 * Version stable de l'effet shuffle+scale : force le scale à 1 avant chaque nouvelle animation pour garantir la transition smooth à chaque fois.
 * @param trigger Dépendance pour déclencher l'animation (ex: bundleIndex)
 * @param onShuffleEnd Callback appelé avec l'index final à afficher
 * @param iconBundles Tableau des bundles d'icônes
 * @param shuffleDuration Durée totale de l'animation (ms)
 * @param shuffleInterval Intervalle entre chaque shuffle (ms)
 * @param setSlotStates Setter pour l'état d'animation de chaque slot (icône)
 */
export function useSlotShuffleAnimationStable({
  trigger,
  onShuffleEnd,
  iconBundles,
  shuffleDuration = 700,
  shuffleInterval = 60,
  setSlotStates,
}) {
  const shuffleTimeout = useRef(null)
  const shuffleStep = useRef(null)

  useEffect(() => {
    let elapsed = 0
    let current = 0
    if (shuffleTimeout.current) clearTimeout(shuffleTimeout.current)
    if (shuffleStep.current) clearTimeout(shuffleStep.current)

    function doShuffle() {
      // 1. Reset à 1
      setSlotStates && setSlotStates([0,0,0])
      // 2. Forcer un reflow puis shrink
      setTimeout(() => {
        setSlotStates && setSlotStates([1,1,1])
        setTimeout(() => {
          setSlotStates && setSlotStates([0,0,0])
        }, shuffleInterval/2)
      }, 10) // 10ms pour laisser le DOM appliquer le reset
      current = Math.floor(Math.random() * iconBundles.length)
      onShuffleEnd(current)
      elapsed += shuffleInterval
      if (elapsed < shuffleDuration) {
        shuffleStep.current = setTimeout(doShuffle, shuffleInterval)
      }
    }
    doShuffle()
    shuffleTimeout.current = setTimeout(() => {
      onShuffleEnd(trigger)
      setSlotStates && setSlotStates([0,0,0])
    }, shuffleDuration + shuffleInterval)
    return () => {
      if (shuffleTimeout.current) clearTimeout(shuffleTimeout.current)
      if (shuffleStep.current) clearTimeout(shuffleStep.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])
}
