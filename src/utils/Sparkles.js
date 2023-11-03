/*
import { useEffect, useRef } from 'react';

const Starshine = () => {
  const starshineRef = useRef(null);
  const templateRef = useRef(null);

  useEffect(() => {
    const body = starshineRef.current;
    const template = templateRef.current;
    const stars = 500;
    const sparkle = 20;
    let size = 'small';

    const createStar = () => {
      const star = template.cloneNode(true);
      star.removeAttribute('id');
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.webkitAnimationDelay = `${Math.random() * sparkle}s`;
      star.style.mozAnimationDelay = `${Math.random() * sparkle}s`;
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
    <div id="starshine" ref={starshineRef}>
      <div className="template shine" ref={templateRef} />
    </div>
  );
};
*/