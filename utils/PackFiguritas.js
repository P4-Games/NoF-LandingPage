import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js';
import { Draggable } from "gsap/dist/Draggable";
import { useEffect } from 'react';
import { motion } from "framer-motion"


function PackFiguritas({ openPackage, cardsNumbers }) {
    useEffect(() => {
        if (typeof window !== "undefined") {


            gsap.registerPlugin(ScrollTrigger)
            gsap.registerPlugin(Draggable)

            gsap.set('.box', {
                yPercent: -50,
            })

            const STAGGER = 0.1
            const DURATION = 1
            const OFFSET = 0
            const BOXES = gsap.utils.toArray('.box')

            const LOOP = gsap.timeline({
                paused: true,
                repeat: -1,
                ease: 'none',
            })

            const SHIFTS = [...BOXES, ...BOXES, ...BOXES]

            SHIFTS.forEach((BOX, index) => {
                const BOX_TL = gsap
                    .timeline()
                    .set(BOX, {
                        xPercent: 250,
                        rotateY: -50,
                        opacity: 0,
                        scale: 0.5,
                    })
                    // Opacity && Scale
                    .to(
                        BOX,
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.1,
                        },
                        0
                    )
                    .to(
                        BOX,
                        {
                            opacity: 0,
                            scale: 0.5,
                            duration: 0.1,
                        },
                        0.9
                    )
                    // Panning
                    .fromTo(
                        BOX,
                        {
                            xPercent: 250,
                        },
                        {
                            xPercent: -350,
                            duration: 1,
                            immediateRender: false,
                            ease: 'power1.inOut',
                        },
                        0
                    )
                    // Rotations
                    .fromTo(
                        BOX,
                        {
                            rotateY: -50,
                        },
                        {
                            rotateY: 50,
                            immediateRender: false,
                            duration: 1,
                            ease: 'power4.inOut',
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
                            yoyo: true,
                        },
                        0.4
                    )
                    .fromTo(
                        BOX,
                        {
                            zIndex: 1,
                        },
                        {
                            zIndex: BOXES.length,
                            repeat: 1,
                            yoyo: true,
                            ease: 'none',
                            duration: 0.5,
                            immediateRender: false,
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
                    totalTime: START_TIME,
                },
                {
                    totalTime: `+=${CYCLE_DURATION}`,
                    duration: 1,
                    ease: 'none',
                    repeat: -1,
                    paused: true,
                }
            )

            const PLAYHEAD = {
                position: 0,
            }

            const POSITION_WRAP = gsap.utils.wrap(0, LOOP_HEAD.duration())

            const SCRUB = gsap.to(PLAYHEAD, {
                position: 0,
                onUpdate: () => {
                    LOOP_HEAD.totalTime(POSITION_WRAP(PLAYHEAD.position))
                },
                paused: true,
                duration: 0.25,
                ease: 'power3',
            })

            let iteration = 0
            const TRIGGER = ScrollTrigger.create({
                start: 0,
                end: '+=2000',
                horizontal: false,
                pin: '.boxes',
                onUpdate: self => {
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
                },
            })

            const WRAP = (iterationDelta, scrollTo) => {
                iteration += iterationDelta
                TRIGGER.scroll(scrollTo)
                TRIGGER.update()
            }

            const SNAP = gsap.utils.snap(1 / BOXES.length)

            const progressToScroll = progress =>
                gsap.utils.clamp(
                    1,
                    TRIGGER.end - 1,
                    gsap.utils.wrap(0, 1, progress) * TRIGGER.end
                )

            const scrollToPosition = position => {
                const SNAP_POS = SNAP(position)
                const PROGRESS =
                    (SNAP_POS - LOOP_HEAD.duration() * iteration) / LOOP_HEAD.duration()
                const SCROLL = progressToScroll(PROGRESS)
                if (PROGRESS >= 1 || PROGRESS < 0) return WRAP(Math.floor(PROGRESS), SCROLL)
                TRIGGER.scroll(SCROLL)
            }

            ScrollTrigger?.addEventListener('scrollEnd', () =>
                scrollToPosition(SCRUB.vars.position)
            )

            const NEXT = () => scrollToPosition(SCRUB.vars.position - 1 / BOXES.length)
            const PREV = () => scrollToPosition(SCRUB.vars.position + 1 / BOXES.length)

            document.addEventListener('keydown', event => {
                if (event.code === 'ArrowLeft' || event.code === 'KeyA') NEXT()
                if (event.code === 'ArrowRight' || event.code === 'KeyD') PREV()
            })

            document.querySelector('.boxes').addEventListener('click', e => {
                const BOX = e.target.closest('.box')
                if (BOX) {
                    let TARGET = BOXES.indexOf(BOX)
                    let CURRENT = gsap.utils.wrap(
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

            // Dragging
            // let startX = 0
            // let startOffset = 0

            // const onPointerMove = e => {
            //   e.preventDefault()
            //   SCRUB.vars.position = startOffset + (startX - e.pageX) * 0.001
            //   SCRUB.invalidate().restart() // same thing as we do in the ScrollTrigger's onUpdate
            // }

            // const onPointerUp = e => {
            //   document.removeEventListener('pointermove', onPointerMove)
            //   document.removeEventListener('pointerup', onPointerUp)
            //   document.removeEventListener('pointercancel', onPointerUp)
            //   scrollToPosition(SCRUB.vars.position)
            // }

            // // when the user presses on anything except buttons, start a drag...
            // document.addEventListener('pointerdown', e => {
            //   if (e.target.tagName.toLowerCase() !== 'button') {
            //     document.addEventListener('pointermove', onPointerMove)
            //     document.addEventListener('pointerup', onPointerUp)
            //     document.addEventListener('pointercancel', onPointerUp)
            //     startX = e.pageX
            //     startOffset = SCRUB.vars.position
            //   }
            // })

            gsap.set('.box', { display: 'block' })

            gsap.set('button', {
                z: 200,
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
                },
            })
        }
    }, [])

    function generateRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }
    const randomNumber = generateRandomNumber();

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={openPackage ? { opacity: 1 } : ''}
                transition={{ delay: 5 }}
                className="boxes">
                <motion.div
                    initial={{ display: 'none' }}
                    animate={openPackage ? { display: 'flex' } : ''}
                    transition={{ delay: 5 }} className="boxes">
                    {(cardsNumbers.length > 0 && cardsNumbers.map((cardNumber, i) => {
                        return (
                            <div className="box" key={i} style={{ "--src": `url(https://storage.googleapis.com/nof-gamma/T1/${cardNumber}.png)` }}>
                                <span>{cardNumber}</span>
                                <img src={`https://storage.googleapis.com/nof-gamma/T1/${cardNumber}.png`} />
                            </div>        
                        )
                    }))}
                </motion.div>
                <div className="controls"><button className="next"><span>Previous album</span><svg viewBox="0 0 448 512" width="100" title="Previous Album">
                    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
                </svg></button><button className="prev"><span>Next album</span><svg viewBox="0 0 448 512" width="100" title="Next Album">
                    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
                </svg></button></div>
            </motion.div>
            {/* <svg className="scroll-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 6H23L19 2L15 6H18V18H15L19 22L23 18H20V6M9 3.09C11.83 3.57 14 6.04 14 9H9V3.09M14 11V15C14 18.3 11.3 21 8 21S2 18.3 2 15V11H14M7 9H2C2 6.04 4.17 3.57 7 3.09V9Z"></path>
            </svg> */}
            <div className="drag-proxy"></div>
        </>
    )
}
export default PackFiguritas