import { useEffect, useRef } from 'react'

/**
 * useShuffleAnimation
 * Lance une animation de shuffle (mélange rapide) sur un tableau d'icônes avant d'afficher la nouvelle valeur.
 * @param trigger Dépendance pour déclencher l'animation (ex: bundleIndex)
 * @param onShuffleEnd Callback appelé avec l'index final à afficher
 * @param iconBundles Tableau des bundles d'icônes
 * @param shuffleDuration Durée totale de l'animation (ms)
 * @param shuffleInterval Intervalle entre chaque shuffle (ms)
 */
export function useShuffleAnimation({
  trigger,
  onShuffleEnd,
  iconBundles,
  shuffleDuration = 700,
  shuffleInterval = 60,
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
      elapsed += shuffleInterval
      if (elapsed < shuffleDuration) {
        shuffleStep.current = setTimeout(doShuffle, shuffleInterval)
      }
    }
    doShuffle()
    shuffleTimeout.current = setTimeout(() => {
      onShuffleEnd(trigger) // Affiche le vrai index à la fin
    }, shuffleDuration + shuffleInterval)
    return () => {
      if (shuffleTimeout.current) clearTimeout(shuffleTimeout.current)
      if (shuffleStep.current) clearTimeout(shuffleStep.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])
}
