import React from 'react'
import Link from 'next/link'

const OfflinePage = () => {

  return (
    <div>
      <p>Website Currently offline or not internet connection is available</p>
      <div>
        <Link href='/' passHref>Go to Home</Link>
      </div>
    </div>
  )
}

export default OfflinePage

