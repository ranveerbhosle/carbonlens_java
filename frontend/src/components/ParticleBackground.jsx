import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const particles = [];
    const count = 30;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = Math.random() * 15 + 10;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${left}%;
        bottom: -20px;
        opacity: ${Math.random() * 0.4 + 0.1};
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
      `;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach(p => p.remove());
  }, []);

  return <div className="particle-container" ref={containerRef} />;
};

export default ParticleBackground;
