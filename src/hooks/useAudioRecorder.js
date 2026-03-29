import { useState, useRef, useCallback } from 'react'

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [error, setError] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      chunksRef.current = []

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)

    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const clearRecording = useCallback(() => {
    setAudioBlob(null)
    setError(null)
    chunksRef.current = []
  }, [])

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  }
}