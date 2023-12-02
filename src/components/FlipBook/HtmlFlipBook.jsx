import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
// import { PageFlip } from 'page-flip'
import { PageFlip } from 'book-flip'

const HTMLFlipBookForward = React.forwardRef((props, ref) => {
  const htmlElementRef = useRef(null)
  const childRef = useRef([])
  const pageFlip = useRef()
  const [pages, setPages] = useState([])

  useImperativeHandle(ref, () => ({
    pageFlip: () => pageFlip.current
  }))

  const refreshOnPageDelete = useCallback(() => {
    if (pageFlip.current) {
      pageFlip.current.clear()
    }
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  const removeHandlers = useCallback(() => {
    const flip = pageFlip.current

    if (flip) {
      flip.off('flip')
      flip.off('changeOrientation')
      flip.off('changeState')
      flip.off('init')
      flip.off('update')
    }
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    childRef.current = []

    if (props.children) {
      const childList = React.Children.map(props.children, (child) =>
        React.cloneElement(child, {
          ref: (dom) => {
            if (dom) {
              childRef.current.push(dom)
            }
          }
        })
      )

      if (!props.renderOnlyPageLengthChange || pages.length !== childList.length) {
        if (childList.length < pages.length) {
          refreshOnPageDelete()
        }

        setPages(childList)
      }
    }
    removeHandlers()
  }, [props.children]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const setHandlers = () => {
      const flip = pageFlip.current

      if (flip) {
        if (props.onFlip) {
          flip.on('flip', (e) => props.onFlip(e))
        }

        if (props.onChangeOrientation) {
          flip.on('changeOrientation', (e) => props.onChangeOrientation(e))
        }

        if (props.onChangeState) {
          flip.on('changeState', (e) => props.onChangeState(e))
        }

        if (props.onInit) {
          flip.on('init', (e) => props.onInit(e))
        }

        if (props.onUpdate) {
          flip.on('update', (e) => props.onUpdate(e))
        }
      }
    }

    if (pages.length > 0 && childRef.current.length > 0) {
      removeHandlers()

      if (htmlElementRef.current && !pageFlip.current) {
        pageFlip.current = new PageFlip(htmlElementRef.current, props)
      }

      if (!pageFlip.current.getFlipController()) {
        pageFlip.current.loadFromHTML(childRef.current)
      } else {
        pageFlip.current.updateFromHtml(childRef.current)
      }

      setHandlers()
    }
  }, [pages]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={htmlElementRef} className={props.className} style={props.style}>
      {pages}
    </div>
  )
})

HTMLFlipBookForward.propTypes = {
  children: PropTypes.array,
  renderOnlyPageLengthChange: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
  onFlip: PropTypes.func,
  onChangeOrientation: PropTypes.func,
  onInit: PropTypes.func,
  onChangeState: PropTypes.func,
  onUpdate: PropTypes.func
}

const HTMLFlipBook = React.memo(HTMLFlipBookForward)
export default HTMLFlipBook
