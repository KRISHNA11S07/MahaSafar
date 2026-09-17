// MahaSafar — GSAP Configuration
// Register all GSAP plugins once here

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

// Register useGSAP hook
gsap.registerPlugin(useGSAP);

// Default ease for all MahaSafar animations
gsap.defaults({
  ease: 'power2.out',
  duration: 0.6,
});

export { gsap, ScrollTrigger, useGSAP };
