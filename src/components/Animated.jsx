'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './animated.module.scss';

export default function Animated(props) {
    const { children, mode='fromleft', clamp=true, threshold='all-in', strength=30 } = props;
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);

    const handleScroll = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const elementHeight = rect.height;
            const elementCenter = rect.top + elementHeight / 2;
            const viewportCenter = viewportHeight / 2;

            const calculateProgress = () => {
                let calculatedProgress = 0;

                switch (threshold) {
                    case 'all-in':
                        if (!clamp) {
                            // Map progress from 0 to 2 while the whole element is in the viewport
                            const start = elementHeight / 2;
                            const end = viewportHeight - elementHeight / 2
                            calculatedProgress = ((elementCenter - start) / (end - start)) * 2;
                        } else {
                            if (rect.top >= 0 && rect.bottom <= viewportHeight) {
                                // Element is fully within viewport - in focus
                                calculatedProgress = 1;
                            } else if (rect.bottom <= 0) {
                                // Element is completely above viewport
                                calculatedProgress = 0;
                            } else if (rect.top >= viewportHeight) {
                                // Element is completely below viewport
                                calculatedProgress = 2;
                            } else if (rect.bottom > 0 && rect.top < 0) {
                                // Element is partially entering from top
                                const visibleHeight = rect.bottom;
                                calculatedProgress = (visibleHeight / elementHeight) * 1; // Map from 0 to 1
                            } else if (rect.top < viewportHeight && rect.bottom > viewportHeight) {
                                // Element is partially exiting at bottom
                                const visibleHeight = viewportHeight - rect.top;
                                calculatedProgress = 1 + ((elementHeight - visibleHeight) / elementHeight) * 1; // Map from 1 to 2
                            }
                        }
                        break;

                    case 'edge':
                        if (!clamp) {
                            // Map progress from 0 to 2 when any part of the element is in the viewport
                            const start = -elementHeight;
                            const end = viewportHeight + elementHeight;
                            calculatedProgress = ((elementCenter - start) / (end - start)) * 2;
                        } else {
                            if (rect.bottom >= 0 && rect.top <= viewportHeight) {
                                // Any part of the element is in the viewport - in focus
                                calculatedProgress = 1;
                            } else if (rect.bottom < 0) {
                                // Element is completely above viewport
                                calculatedProgress = 0;
                            } else if (rect.top > viewportHeight) {
                                // Element is completely below viewport
                                calculatedProgress = 2;
                            } else if (rect.bottom < 0) {
                                // Before focus area
                                const distance = -rect.bottom;
                                const totalDistance = elementHeight;
                                calculatedProgress = (distance / totalDistance); // Map from 0 to 1
                            } else if (rect.top > viewportHeight) {
                                // After focus area
                                const distance = rect.top - viewportHeight;
                                const totalDistance = elementHeight;
                                calculatedProgress = 1 + (distance / totalDistance); // Map from 1 to 2
                            }
                        }
                        break;

                    case 'half-in':
                    default: 
                        if (!clamp) {
                            // Map progress from 0 to 2 when half of the element is in the viewport
                            const start = 0;
                            const end = viewportHeight;
                            calculatedProgress = ((elementCenter - start) / (end - start)) * 2;
                        } else {
                            const halfElementHeight = elementHeight / 2;
                            const visibleTop = Math.max(rect.top, 0);
                            const visibleBottom = Math.min(rect.bottom, viewportHeight);
                            const visibleHeight = visibleBottom - visibleTop;

                            if (visibleHeight >= halfElementHeight) {
                                // Half of the element is in the viewport - in focus
                                calculatedProgress = 1;
                            } else if (rect.bottom <= 0) {
                                // Element is entirely above the viewport
                                calculatedProgress = 0;
                            } else if (rect.top >= viewportHeight) {
                                // Element is entirely below the viewport
                                calculatedProgress = 2;
                            } else if (rect.top < 0 && rect.bottom > 0) {
                                // Element is entering from the top
                                calculatedProgress = (visibleHeight / halfElementHeight) * 1; // Map from 0 to 1
                            } else if (rect.top < viewportHeight && rect.bottom > viewportHeight) {
                                // Element is exiting at the bottom
                                const hiddenHeight = rect.bottom - viewportHeight;
                                const visibleHeightAtExit = elementHeight - hiddenHeight;
                                calculatedProgress = 1 + ((halfElementHeight - visibleHeightAtExit) / halfElementHeight) * 1; // Map from 1 to 2
                            } else {
                                // Other partial visibility cases
                                if (rect.top >= 0 && rect.bottom <= viewportHeight && visibleHeight < halfElementHeight) {
                                    // Element is entirely within the viewport but less than half is visible
                                    calculatedProgress = (visibleHeight / halfElementHeight) * 1; // Map from 0 to 1
                                } else {
                                    // Fallback
                                    calculatedProgress = 1;
                                }
                            }
                        }
                        break;
                }


                // Ensure progress is 1 when element center is at viewport center
                if (calculatedProgress !== 1) {
                    const centerOffset = Math.abs(elementCenter - viewportCenter);
                    if (centerOffset < 1) {
                        calculatedProgress = 1;
                    }
                }

                // Clamp progress between 0 and 2
                return Math.max(0, Math.min(2, calculatedProgress));
            };

            const progressValue = calculateProgress();
            setProgress(progressValue);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);


    const symmetricProgress = progress <= 1 ? progress : (2 - progress)

    const getStyle = () => {
        const getSymmetricTranslation = (start, end) => {
            if (progress <= 1) {
                return start * (1 - progress);
            } else {
                return end * (progress - 1);
            }
        };

        const opacity = symmetricProgress

        switch (mode) {
            case 'fromleft':
                return { '--translate-x': `${getSymmetricTranslation(strength, -strength)}%`, '--opacity': opacity };
            case 'fromright':
                return { '--translate-x': `${getSymmetricTranslation(-strength, strength)}%`, '--opacity': opacity };
            case 'fromtop':
                return { '--translate-y': `${getSymmetricTranslation(strength, -strength)}%`, '--opacity': opacity };
            case 'frombottom':
                return { '--translate-y': `${getSymmetricTranslation(-strength, strength)}%`, '--opacity': opacity };
            case 'flip':
                return { '--rotate': `${getSymmetricTranslation(-90, 90)}deg`, '--opacity': opacity}
            case 'blur':
                return { '--blur': `${(1-opacity)*10}px`, '--opacity': opacity}
            case 'fade': 
                return { '--opacity': opacity }
            default:
                return {};
        }
    };

    return (
        <div
            {...props}
            ref={ref}
            style={{ ...getStyle(), ...props.style }}
            className={`${styles.animated} ${styles[mode]} ${props.className}`}
        >
            {children}
        </div>
    );
}