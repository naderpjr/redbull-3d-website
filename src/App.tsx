import { useCallback, useState } from 'react'
import { CanCanvas } from './components/CanCanvas'
import { Callouts } from './components/Callouts'
import { Cursor } from './components/Cursor'
import { Header } from './components/Header'
import { Loader } from './components/Loader'
import { SideIndex } from './components/SlideIndex'
import { useReveal } from './hooks/useReveal'
import { Anatomy } from './sections/Anatomy'
import { Credits } from './sections/Credits'
import { Explore } from './sections/Explore'
import { Formula } from './sections/Formula'
import { Hero } from './sections/Hero'
import { canScene } from './three/CanScene'

export default function App() {
  const [modelReady, setModelReady] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useReveal(revealed)

  const handleReady = useCallback(() => setModelReady(true), [])

  const handleDone = useCallback(() => {
    setRevealed(true)
    canScene.startIntro()
  }, [])

  return (
    <>
      <Loader ready={modelReady} lifted={revealed} onDone={handleDone} />
      <CanCanvas onReady={handleReady} />
      <Callouts />
      <Cursor />
      <Header />
      <SideIndex />

      <main>
        <Hero />
        <Anatomy />
        <Formula />
        <Explore />
        <Credits />
      </main>
    </>
  )
}