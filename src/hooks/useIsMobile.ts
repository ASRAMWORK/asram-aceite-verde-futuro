
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Set initial value based on window width
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Use matchMedia for better performance
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Set initial value
    checkMobile();
    
    // Add event listener using matchMedia
    const handleChange = () => checkMobile();
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
