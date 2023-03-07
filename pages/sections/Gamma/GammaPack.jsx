import StarShine from "../../../utils/Sparkles"
import { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion"
import { AiOutlineCloseCircle } from 'react-icons/ai'
import PackFiguritas from "../../../utils/PackFiguritas";

const GammaPack = ({ setOpenPack }) => {
    const [openPackage, setOpenPackage] = useState(false)
    const starshineRef = useRef(null);
    const templateRef = useRef(null);


    useEffect(() => {
        const body = starshineRef.current;
        const template = templateRef.current;
        const stars = 200;
        const sparkle = 20;
        let size = 'small';

        const createStar = () => {
            const star = template.cloneNode(true);
            star.removeAttribute('id');
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * sparkle}s`;
            star.classList.add(size);
            body.appendChild(star);
        };

        for (let i = 0; i < stars; i++) {
            if (i % 2 === 0) {
                size = 'small';
            } else if (i % 3 === 0) {
                size = 'medium';
            } else {
                size = 'large';
            }

            createStar();
        }

    }, []);


    return (
        <>
            <div className='packcontainer'>
                <div id="starshine" ref={starshineRef}>
                    <div className="template shine" ref={templateRef}></div>
                </div>
                <motion.div
                    animate={openPackage ? { display: 'none' } : ''}
                    transition={{ delay: 5 }}
                    onClick={() => { setOpenPackage(true), console.log('probando') }}
                    className="pack">
                    <motion.img
                        animate={openPackage ? { opacity: 0, x: -275, zIndex: 111111 } : ''}
                        transition={{ duration: 2, delay: 0 }} id='top' src="/assets/gamma/SobreTop.png" alt="" />
                    <motion.img
                        animate={openPackage ? { opacity: 0, zIndex: 111111 } : ''}
                        transition={{ duration: 1, delay: 3 }} id='bottom' src="/assets/gamma/SobreBottom.png" alt="" />
                    <motion.img
                        animate={openPackage ? { y: -100, } : ''}
                        transition={{ duration: 3, delay: 1 }}
                        id='imagetest' src={`https://storage.googleapis.com/nof-gamma/T1/${1}.png`} alt="img" />
                </motion.div>
                <AiOutlineCloseCircle onClick={() => setOpenPack(false)} className="closebutton" />
                {openPackage && <PackFiguritas openPackage={openPackage} />}


            </div>
        </>
    )
}
export default GammaPack