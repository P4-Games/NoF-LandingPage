import { useState } from 'react'

const FlipCard = () => {
  const [filped, setFliped] = useState(false)
  return (
    <div
      className={filped ? 'flip App' : 'App'}
      onClick={() => {
        setFliped(!filped)
      }}
    >
      <div className='front'>Card 3</div>
      <div className='back'>Wallet x</div>
    </div>
  )
}

export default FlipCard
