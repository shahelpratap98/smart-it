import { useEffect, useRef } from 'react';

// Live ref (not state): read inside useFrame without re-rendering the tree.
export function useReducedMotionRef() {
  const ref = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => { ref.current = e.matches; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return ref;
}
