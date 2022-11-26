import React from 'react'
// import audio from './music/Dungeon.mp3'

function Music () {
  const btnPlay = document.getElementById('btnPlay')
  // FIXME:
  // const audioPlayer = new Audio(audio)
  btnPlay.addEventListener('click', (e) => {
    audioPlayer.play()
  })
  return (
    <div className='navbar__corner__audio'>
      <button id='btnPlay'>
        <></>
      </button>
    </div>
  )
}

export default Music
