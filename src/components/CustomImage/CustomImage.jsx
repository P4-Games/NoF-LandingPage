import React, { useState } from 'react'
import PropTypes from 'prop-types'

function CustomImage({ src, alt, className }) {
  const [error, setError] = useState(false)
  const defaultImage = '/images/common/no-image.png'

  const handleError = () => {
    setError(true)
  }

  return error ? (
    <img src={defaultImage} alt='default image' className={className} />
  ) : (
    <img src={src} alt={alt || 'img'} className={className} onError={handleError} />
  )
}

CustomImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string
}

export default CustomImage
