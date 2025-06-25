import { useState, useEffect } from 'react';

// Custom hook for responsive design
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });

      // Set breakpoint based on Tailwind CSS breakpoints
      if (width < 480) {
        setBreakpoint('mobile'); // Very small mobile
      } else if (width >= 480 && width < 640) {
        setBreakpoint('sm'); // Small mobile
      } else if (width >= 640 && width < 768) {
        setBreakpoint('md'); // Large mobile / small tablet
      } else if (width >= 768 && width < 1024) {
        setBreakpoint('tablet'); // Tablet
      } else if (width >= 1024 && width < 1280) {
        setBreakpoint('lg'); // Small desktop
      } else {
        setBreakpoint('desktop'); // Large desktop
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Set initial values
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    breakpoint,
    isMobile: breakpoint === 'mobile' || breakpoint === 'sm',
    isTablet: breakpoint === 'tablet', // Only true for 768-1024px
    isDesktop: breakpoint === 'desktop' || breakpoint === 'lg',
    isSmall: breakpoint === 'mobile' || breakpoint === 'sm',
    isLarge: breakpoint === 'lg' || breakpoint === 'desktop',
    isXS: windowSize.width < 480,
    isSM: windowSize.width >= 480 && windowSize.width < 640,
    isMD: windowSize.width >= 640 && windowSize.width < 768,
    isTabletRange: windowSize.width >= 768 && windowSize.width < 1024, // Explicit tablet range
    isLG: windowSize.width >= 1024 && windowSize.width < 1280,
    isXL: windowSize.width >= 1280,
    // More specific breakpoints
    isVerySmall: windowSize.width < 480,
    isSmallMobile: windowSize.width >= 480 && windowSize.width < 640,
    isLargeMobile: windowSize.width >= 640 && windowSize.width < 768,
    isSmallTablet: windowSize.width >= 768 && windowSize.width < 1024,
    // Helper for non-desktop
    isNonDesktop: windowSize.width < 1024
  };
};

// Responsive utility functions
export const getResponsiveValue = (values, breakpoint) => {
  const breakpointOrder = ['mobile', 'sm', 'tablet', 'lg', 'desktop'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const key = breakpointOrder[i];
    if (values[key] !== undefined) {
      return values[key];
    }
  }
  
  return values.default || values.desktop;
};

// Screen size constants
export const BREAKPOINTS = {
  mobile: 640,
  sm: 640,
  tablet: 768,
  lg: 1024,
  desktop: 1280,
  xl: 1536
};

export const SCREEN_SIZES = {
  isMobile: (width) => width < BREAKPOINTS.sm,
  isTablet: (width) => width >= BREAKPOINTS.tablet && width < BREAKPOINTS.lg,
  isDesktop: (width) => width >= BREAKPOINTS.lg,
  isSmall: (width) => width < BREAKPOINTS.tablet,
  isLarge: (width) => width >= BREAKPOINTS.lg
};
