import gsap from 'gsap'
import PropTypes from 'prop-types'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js'
import { Draggable } from 'gsap/dist/Draggable'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { storageUrlGamma } from '../../config'

const GammaPackOpenCards = ({ openPackage, cardsNumbers }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)
    gsap.registerPlugin(Draggable)

    gsap.set('.box', {
      yPercent: -50
    })

    const STAGGER = 0.1
    const DURATION = 1
    const OFFSET = 0
    const BOXES = gsap.utils.toArray('.box')

    const LOOP = gsap.timeline({
      paused: true,
      repeat: -1,
      ease: 'none'
    })

    const SHIFTS = [...BOXES, ...BOXES, ...BOXES]

    SHIFTS.forEach((BOX, index) => {
      const BOX_TL = gsap
        .timeline()
        .set(BOX, {
          xPercent: 250,
          rotateY: -50,
          opacity: 0,
          scale: 0.5
        })
        // Opacity && Scale
        .to(
          BOX,
          {
            opacity: 1,
            scale: 1,
            duration: 0.1
          },
          0
        )
        .to(
          BOX,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.1
          },
          0.9
        )
        // Panning
        .fromTo(
          BOX,
          {
            xPercent: 250
          },
          {
            xPercent: -350,
            duration: 1,
            immediateRender: false,
            ease: 'power1.inOut'
          },
          0
        )
        // Rotations
        .fromTo(
          BOX,
          {
            rotateY: -50
          },
          {
            rotateY: 50,
            immediateRender: false,
            duration: 1,
            ease: 'power4.inOut'
          },
          0
        )
        // Scale && Z
        .to(
          BOX,
          {
            z: 100,
            scale: 1.25,
            duration: 0.1,
            repeat: 1,
            yoyo: true
          },
          0.4
        )
        .fromTo(
          BOX,
          {
            zIndex: 1
          },
          {
            zIndex: BOXES.length,
            repeat: 1,
            yoyo: true,
            ease: 'none',
            duration: 0.5,
            immediateRender: false
          },
          0
        )
      LOOP.add(BOX_TL, index * STAGGER)
    })

    const CYCLE_DURATION = STAGGER * BOXES.length
    const START_TIME = CYCLE_DURATION + DURATION * 0.5 + OFFSET

    const LOOP_HEAD = gsap.fromTo(
      LOOP,
      {
        totalTime: START_TIME
      },
      {
        totalTime: `+=${CYCLE_DURATION}`,
        duration: 1,
        ease: 'none',
        repeat: -1,
        paused: true
      }
    )

    const PLAYHEAD = {
      position: 0
    }

    const POSITION_WRAP = gsap.utils.wrap(0, LOOP_HEAD.duration())

    const SCRUB = gsap.to(PLAYHEAD, {
      position: 0,
      onUpdate: () => {
        LOOP_HEAD.totalTime(POSITION_WRAP(PLAYHEAD.position))
      },
      paused: true,
      duration: 0.25,
      ease: 'power3'
    })

    let iteration = 0
    const TRIGGER = ScrollTrigger.create({
      start: 0,
      end: '+=2000',
      horizontal: false,
      pin: '.boxes',
      onUpdate: (self) => {
        const SCROLL = self.scroll()
        if (SCROLL > self.end - 1) {
          // Go forwards in time
          WRAP(1, 1)
        } else if (SCROLL < 1 && self.direction < 0) {
          // Go backwards in time
          WRAP(-1, self.end - 1)
        } else {
          const NEW_POS = (iteration + self.progress) * LOOP_HEAD.duration()
          SCRUB.vars.position = NEW_POS
          SCRUB.invalidate().restart()
        }
      }
    })

    const WRAP = (iterationDelta, scrollTo) => {
      iteration += iterationDelta
      TRIGGER.scroll(scrollTo)
      TRIGGER.update()
    }

    const SNAP = gsap.utils.snap(1 / BOXES.length)

    const progressToScroll = (progress) =>
      gsap.utils.clamp(1, TRIGGER.end - 1, gsap.utils.wrap(0, 1, progress) * TRIGGER.end)

    const scrollToPosition = (position) => {
      const SNAP_POS = SNAP(position)
      const PROGRESS = (SNAP_POS - LOOP_HEAD.duration() * iteration) / LOOP_HEAD.duration()
      const SCROLL = progressToScroll(PROGRESS)
      if (PROGRESS >= 1 || PROGRESS < 0) {
        return WRAP(Math.floor(PROGRESS), SCROLL)
      }
      TRIGGER.scroll(SCROLL)
    }

    ScrollTrigger?.addEventListener('scrollEnd', () => scrollToPosition(SCRUB.vars.position))

    const NEXT = () => scrollToPosition(SCRUB.vars.position - 1 / BOXES.length)
    const PREV = () => scrollToPosition(SCRUB.vars.position + 1 / BOXES.length)

    document.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') NEXT()
      if (event.code === 'ArrowRight' || event.code === 'KeyD') PREV()
    })

    document.querySelector('.boxes').addEventListener('click', (e) => {
      const BOX = e.target.closest('.box')
      if (BOX) {
        const TARGET = BOXES.indexOf(BOX)
        const CURRENT = gsap.utils.wrap(
          0,
          BOXES.length,
          Math.floor(BOXES.length * SCRUB.vars.position)
        )
        let BUMP = TARGET - CURRENT
        if (TARGET > CURRENT && TARGET - CURRENT > BOXES.length * 0.5) {
          BUMP = (BOXES.length - BUMP) * -1
        }
        if (CURRENT > TARGET && CURRENT - TARGET > BOXES.length * 0.5) {
          BUMP = BOXES.length + BUMP
        }
        scrollToPosition(SCRUB.vars.position + BUMP * (1 / BOXES.length))
      }
    })

    window.BOXES = BOXES

    document.querySelector('.next').addEventListener('click', NEXT)
    document.querySelector('.prev').addEventListener('click', PREV)
    gsap.set('.box', { display: 'block' })
    gsap.set('button', {
      z: 200
    })

    Draggable.create('.drag-proxy', {
      type: 'x',
      trigger: '.box',
      onPress() {
        this.startOffset = SCRUB.vars.position
      },
      onDrag() {
        SCRUB.vars.position = this.startOffset + (this.startX - this.x) * 0.001
        SCRUB.invalidate().restart() // same thing as we do in the ScrollTrigger's onUpdate
      },
      onDragEnd() {
        scrollToPosition(SCRUB.vars.position)
      }
    })
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={openPackage ? { opacity: 1 } : ''}
        transition={{ delay: 5 }}
        className='boxes'
      >
        <motion.div
          initial={{ display: 'none' }}
          animate={openPackage ? { display: 'flex' } : ''}
          transition={{ delay: 5 }}
          className='boxes'
        >
          {cardsNumbers.length > 0 &&
            cardsNumbers.map((cardNumber, i) => (
              <div
                className='box'
                key={i}
                style={{
                  '--src': `url(${storageUrlGamma}/T1/${cardNumber}.png)`
                }}
              >
                <span>{cardNumber}</span>
                <img alt='img' src={`${storageUrlGamma}/T1/${cardNumber}.png`} />
              </div>
            ))}
        </motion.div>
        <div className='controls'>
          <button className='next'>
            <span>Previous album</span>
            <svg viewBox='0 0 448 512' width='100' title='Previous Album'>
              <path d='M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z' />
            </svg>
          </button>
          <button className='prev'>
            <span>Next album</span>
            <svg viewBox='0 0 448 512' width='100' title='Next Album'>
              <path d='M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z' />
            </svg>
          </button>
        </div>
      </motion.div>
      <div className='drag-proxy' />
    </>
  )
}

GammaPackOpenCards.propTypes = {
  openPackage: PropTypes.bool,
  cardsNumbers: PropTypes.array
}

export default GammaPackOpenCards
