import React from 'react'
import Image from 'next/image'

function Book () {
  return (
    <div className='book' id='Nosotros'>
      <div className='book__album'>
        <Image
          src='/../public/Book/book.png'
          alt=''
          width={900}
          height={750}
        />
      </div>
    </div>
  )
}

export default Book
