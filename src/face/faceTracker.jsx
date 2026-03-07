/**
 * Face tracker: uses MediaPipe Face Mesh to drive InputBus from head movement.
 * - isLeft / isRight from horizontal head position (nose x)
 * - isShooting from mouth open (vertical distance between lip landmarks)
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { FaceMesh } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'
import { InputBus } from './inputBus.jsx'

// Nose tip (horizontal head position). MediaPipe 468: 4 = nose tip.
const NOSE_TIP_INDEX = 4
// Upper lip / lower lip for mouth open. MediaPipe: 13 upper, 14 lower (inner lip).
const UPPER_LIP_INDEX = 13
const LOWER_LIP_INDEX = 14

// Head position thresholds: use InputBus.deadZone for the center band (face only).
const CENTER_LEFT = 0.5 - InputBus.deadZone / 2
const CENTER_RIGHT = 0.5 + InputBus.deadZone / 2

// Selfie camera: when you move head left, nose moves right on screen → invert
const MIRROR_SELFIE = true

// Mouth open threshold: above this = shooting
const MOUTH_OPEN_THRESHOLD = 0.03

export function useFaceTracker(videoRef, videoReady) {
  const faceMeshRef = useRef(null)
  const cameraRef = useRef(null)

  useEffect(() => {
    if (!videoReady) return
    const video = videoRef?.current
    if (!video) return

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
    })

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    faceMesh.onResults((results) => {
      const landmarks = results.multiFaceLandmarks?.[0]
      if (!landmarks || landmarks.length < 16) {
        InputBus.isLeft = false
        InputBus.isRight = false
        InputBus.isShooting = false
        return
      }

      const nose = landmarks[NOSE_TIP_INDEX]
      const noseX = (nose && typeof nose.x === 'number') ? nose.x : 0.5

      if (MIRROR_SELFIE) {
        InputBus.isLeft = noseX > CENTER_RIGHT
        InputBus.isRight = noseX < CENTER_LEFT
      } else {
        InputBus.isLeft = noseX < CENTER_LEFT
        InputBus.isRight = noseX > CENTER_RIGHT
      }

      const upperLip = landmarks[UPPER_LIP_INDEX]
      const lowerLip = landmarks[LOWER_LIP_INDEX]
      const upperY = (upperLip && typeof upperLip.y === 'number') ? upperLip.y : 0.5
      const lowerY = (lowerLip && typeof lowerLip.y === 'number') ? lowerLip.y : 0.5
      const mouthOpen = Math.abs(lowerY - upperY)
      InputBus.isShooting = mouthOpen > MOUTH_OPEN_THRESHOLD
    })

    faceMeshRef.current = faceMesh

    const camera = new Camera(video, {
      onFrame: async () => {
        await faceMesh.send({ image: video })
      },
      facingMode: 'user',
      width: 320,
      height: 240,
    })

    cameraRef.current = camera
    camera.start()

    return () => {
      camera.stop()
      faceMesh.close()
      InputBus.isLeft = false
      InputBus.isRight = false
      InputBus.isShooting = false
    }
  }, [videoRef, videoReady])
}

export function FaceTracker({ videoRef: externalRef, showVideo = false }) {
  const internalRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = externalRef ?? internalRef

  const setVideoRef = useCallback((el) => {
    internalRef.current = el
    setVideoReady(!!el)
  }, [])

  useFaceTracker(videoRef, videoReady)

  return (
    <div className="face-tracker">
      <video
        ref={externalRef ?? setVideoRef}
        playsInline
        muted
        autoPlay
        width={320}
        height={240}
        style={{
          width: showVideo ? 320 : 1,
          height: showVideo ? 240 : 1,
          objectFit: 'cover',
          opacity: showVideo ? 1 : 0,
          position: showVideo ? 'relative' : 'absolute',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
