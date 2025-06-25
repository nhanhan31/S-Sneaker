import React from 'react';
import { useResponsive } from '../hooks/useResponsive';

const ResponsiveDebugger = () => {
    const { windowSize, breakpoint, isMobile, isTablet, isDesktop, isXS, isSM, isMD, isLG, isXL } = useResponsive();

    if (process.env.NODE_ENV === 'production') {
        return null; // Don't show in production
    }

    return (
        <div className="responsive-debugger">
            <div className="debug-info">
                <div>Size: {windowSize.width}x{windowSize.height}</div>
                <div>Breakpoint: {breakpoint}</div>
                <div className="debug-breakpoints">
                    <span className={isXS ? 'text-green-400' : 'text-gray-400'}>XS</span>
                    <span className={isSM ? 'text-green-400' : 'text-gray-400'}>SM</span>
                    <span className={isMD ? 'text-green-400' : 'text-gray-400'}>MD</span>
                    <span className={isLG ? 'text-green-400' : 'text-gray-400'}>LG</span>
                    <span className={isXL ? 'text-green-400' : 'text-gray-400'}>XL</span>
                </div>
                <div className="debug-status">
                    <span className={isMobile ? 'text-blue-400' : 'text-gray-400'}>Mobile</span>
                    <span className={isTablet ? 'text-yellow-400' : 'text-gray-400'}>Tablet</span>
                    <span className={isDesktop ? 'text-purple-400' : 'text-gray-400'}>Desktop</span>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveDebugger;
