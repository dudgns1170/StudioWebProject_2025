import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedCard = ({ 
  children, 
  className = '', 
  animation = 'fadeUp',
  delay = 0,
  duration = 0.5,
  threshold = 0.1
}) => {
  const { ref, isVisible } = useScrollAnimation(threshold);

  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
    },
    slideRight: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  const selectedAnimation = animations[animation] || animations.fadeUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={selectedAnimation.initial}
      animate={isVisible ? selectedAnimation.animate : selectedAnimation.initial}
      transition={{
        duration,
        delay: isVisible ? delay : 0,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
