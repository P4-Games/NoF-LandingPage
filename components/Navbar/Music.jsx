import React, { useState } from 'react'
import audio from './music/Dungeon.mp3'

function Music () {
  const PlayButton = ({}) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [play, { stop }] = useSound(galaxySfx)
    function playSong() {
      setIsPlaying(true)
      play()
    }
    function stopSong() {
      setIsPlaying(false)
      stop()
    }
  }
  return (
    <div className={styles.playButton}>
      <button
        data-aos-offset='100'
        onClick={isPlaying ? stopSong : playSong}
      >
        🎺
      </button>
    </div>
  )
}

export default Music
