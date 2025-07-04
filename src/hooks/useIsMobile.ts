// src/hooks/useIsMobile.ts
import { useEffect, useState } from 'react';

//Deprecated: useIsMobile hook detects if the current device is mobile based on window width
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isMobile;
};
