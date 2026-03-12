import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

export const useScrollAnimationMultiple = (threshold = 0.1) => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const refs = useRef({});

  const setRef = (key) => (element) => {
    if (element) {
      refs.current[key] = element;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    Object.values(refs.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      Object.values(refs.current).forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [threshold]);

  return { setRef, isVisible: (key) => visibleElements.has(refs.current[key]) };
};
