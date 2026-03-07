import { useRef, useEffect } from 'react'
import { initGame } from './game/sketch.js'
import { FaceTracker } from './face/faceTracker.jsx'
import './face/inputBus.jsx'
import './App.css'

function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const { stop } = initGame(canvas)
    return () => stop()
  }, [])

  return (
    <div className="app-layout">
      <aside className="game-ui">
        <div className="game-ui-header">Face controls</div>
        <div className="face-tracker-wrap">
          <FaceTracker showVideo />
        </div>
        <p className="game-ui-hint">Move your head left/right to move. Open mouth to shoot.</p>
      </aside>
      <div className="game-wrap">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ display: 'block', background: '#0a0a12', width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  )
}

export default App
