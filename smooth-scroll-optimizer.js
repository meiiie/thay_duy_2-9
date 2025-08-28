// Smooth Scroll Optimizer - Simple and safe optimization
// This file only optimizes existing Lenis instances without breaking anything

document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for existing Lenis instances to be created
  setTimeout(() => {
    optimizeExistingLenis();
  }, 1000);
});

function optimizeExistingLenis() {
  // Only optimize if Lenis exists and is working
  if (window.lenis && window.lenis.isLenis) {
    console.log('Optimizing existing Lenis instance...');
    
    // Optimize wheel scrolling for smoother experience
    if (window.lenis.options) {
      // Reduce wheel sensitivity slightly for smoother scrolling
      if (window.lenis.options.wheelMultiplier > 0.6) {
        window.lenis.options.wheelMultiplier = 0.8;
      }
      
      // Optimize touch scrolling for mobile
      if (window.lenis.options.touchMultiplier < 2) {
        window.lenis.options.touchMultiplier = 2;
      }
      
      // Ensure smooth scrolling is enabled
      if (window.lenis.options.smooth !== false) {
        window.lenis.options.smooth = true;
      }
    }
    
    // Add performance optimizations
    addPerformanceOptimizations();
    
    console.log('Lenis optimization completed');
  } else {
    console.log('No Lenis instance found, skipping optimization');
  }
}

function addPerformanceOptimizations() {
  // Optimize for mobile devices
  if (window.innerWidth <= 768) {
    // Reduce animation intensity on mobile for better performance
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .history-card,
        .timeline-section,
        .finale-hero {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Prevent scroll chaining on mobile */
        .work,
        .timeline-section,
        .finale-hero {
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Optimize touch targets */
        button, 
        [role="button"],
        input,
        select,
        textarea {
          min-height: 44px;
          min-width: 44px;
          touch-action: manipulation;
        }
      }
      
      /* High DPI display optimization */
      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .history-card,
        .timeline-section,
        .finale-hero {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      }
      
      /* Prevent scroll interference during animations */
      .scroll-locked {
        overflow: hidden;
        position: fixed;
        width: 100%;
      }
      
      /* Smooth transition when unlocking scroll */
      .scroll-unlocked {
        transition: all 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Handle resize events for responsive optimization
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-optimize after resize
      if (window.lenis && window.lenis.isLenis) {
        window.lenis.resize();
      }
    }, 100);
  });
  
  // Handle orientation change on mobile
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      if (window.lenis && window.lenis.isLenis) {
        window.lenis.resize();
      }
    }, 500);
  });
}

// Export for potential use in other modules
window.smoothScrollOptimizer = {
  optimize: optimizeExistingLenis,
  addPerformanceOptimizations: addPerformanceOptimizations
};
