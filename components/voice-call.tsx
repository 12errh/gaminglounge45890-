import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface VoiceCallProps {
  channel: string
}

export function VoiceCall({ channel }: VoiceCallProps) {
  const [isCalling, setIsCalling] = useState(false)
  const localAudioRef = useRef<HTMLAudioElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    const subscription = supabase
      .channel('voice_signaling')
      .on('broadcast', { event: 'voice_offer' }, handleOffer)
      .on('broadcast', { event: 'voice_answer' }, handleAnswer)
      .on('broadcast', { event: 'voice_ice_candidate' }, handleIceCandidate)
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [channel])

  const startCall = async () => {
    try {
      console.log('Starting call...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log('Got user media stream:', stream)
      
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream
      }

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })
      console.log('Created RTCPeerConnection')

      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream)
        }
      })

      peerConnectionRef.current.ontrack = (event) => {
        console.log('Received remote track:', event.track)
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0]
        }
      }

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate)
          supabase.channel('voice_signaling').send({
            type: 'broadcast',
            event: 'voice_ice_candidate',
            payload: { candidate: event.candidate, channel }
          })
        }
      }

      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)
      console.log('Created and set local offer:', offer)

      supabase.channel('voice_signaling').send({
        type: 'broadcast',
        event: 'voice_offer',
        payload: { offer: offer, channel }
      })

      setIsCalling(true)
    } catch (error) {
      console.error('Error starting call:', error)
      setIsCalling(false)
    }
  }

  const handleOffer = async (event: any) => {
    if (event.payload.channel !== channel) return

    try {
      console.log('Received offer:', event.payload.offer)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream
      }

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })

      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream)
        }
      })

      peerConnectionRef.current.ontrack = (event) => {
        console.log('Received remote track:', event.track)
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0]
        }
      }

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate)
          supabase.channel('voice_signaling').send({
            type: 'broadcast',
            event: 'voice_ice_candidate',
            payload: { candidate: event.candidate, channel }
          })
        }
      }

      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(event.payload.offer))
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)
      console.log('Created and set local answer:', answer)

      supabase.channel('voice_signaling').send({
        type: 'broadcast',
        event: 'voice_answer',
        payload: { answer: answer, channel }
      })

      setIsCalling(true)
    } catch (error) {
      console.error('Error handling offer:', error)
    }
  }

  const handleAnswer = async (event: any) => {
    if (event.payload.channel !== channel) return

    try {
      console.log('Received answer:', event.payload.answer)
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(event.payload.answer))
      }
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }

  const handleIceCandidate = (event: any) => {
    if (event.payload.channel !== channel) return

    try {
      console.log('Received ICE candidate:', event.payload.candidate)
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(event.payload.candidate))
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error)
    }
  }

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    if (localAudioRef.current) {
      const stream = localAudioRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setIsCalling(false)
  }

  return (
    <div className="flex items-center justify-center space-x-4">
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
      {!isCalling ? (
        <Button onClick={startCall} className="bg-green-600 hover:bg-green-500">
          <Phone className="mr-2 h-4 w-4" /> Start Call
        </Button>
      ) : (
        <Button onClick={endCall} className="bg-red-600 hover:bg-red-500">
          <PhoneOff className="mr-2 h-4 w-4" /> End Call
        </Button>
      )}
    </div>
  )
}

