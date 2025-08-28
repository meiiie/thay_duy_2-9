import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function initFinaleSection() {
  
  // Initialize immediately
  
  gsap.registerPlugin(ScrollTrigger);

  // Check if Lenis is already initialized
  let lenis;
  if (window.lenis) {
    lenis = window.lenis;
  } else {
    try {
      lenis = new Lenis({
        duration: 0.8, // Giảm duration để tránh lag
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8, // Giảm để tránh cuộn quá nhanh
        smoothTouch: true, // Bật smooth touch cho mobile
        touchMultiplier: 1.5, // Giảm để tránh cuộn quá nhanh
        infinite: false,
        lerp: 0.1, // Thêm lerp để cuộn mượt hơn
        wheelMultiplier: 0.8, // Giảm wheel speed
        syncTouch: true, // Sync touch với wheel
        syncTouchLerp: 0.1, // Touch lerp
        touchInertiaMultiplier: 20, // Giảm inertia
        smoothWheel: true, // Smooth wheel scrolling
      });
      window.lenis = lenis;
    } catch (error) {
      console.log('Lenis initialization failed, using default scroll');
      lenis = null;
    }
  }
  
  // Only setup Lenis if it's available
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback to standard scroll behavior
    ScrollTrigger.addEventListener("refresh", () => {
      ScrollTrigger.refresh();
    });
  }

  const finaleHeader = document.querySelector(".finale-header");
  const finaleHeroImg = document.querySelector(".finale-hero-img");
  const finaleCanvas = document.querySelector(".finale-canvas");
  
      if (!finaleCanvas) {
      return;
    }
  
  const context = finaleCanvas.getContext("2d");

  const setCanvasSize = () => {
    const pixelRatio = window.devicePixelRatio || 1;
    finaleCanvas.width = window.innerWidth * pixelRatio;
    finaleCanvas.height = window.innerHeight * pixelRatio;
    finaleCanvas.style.width = window.innerWidth + "px";
    finaleCanvas.style.height = window.innerHeight + "px";
    context.scale(pixelRatio, pixelRatio);
  };
  setCanvasSize();

  const frameCount = 220;
  const currentFrame = (index) =>
    `/cobay2/flag-${index.toString().padStart(3, "0")}.jpg`;

  let images = [];
  let videoFrames = { frame: 0 };
  let imagesToLoad = frameCount;

  const onLoad = () => {
    imagesToLoad--;

    if (!imagesToLoad) {
      render();
      setupScrollTrigger();
    }
  };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = onLoad;
    img.onerror = function () {
      onLoad.call(this);
    };
    img.src = currentFrame(i);
    images.push(img);
  }

  const render = () => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    const img = images[videoFrames.frame];
    if (img && img.complete && img.naturalWidth > 0) {
      const imageAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, drawX, drawY;

      if (imageAspect > canvasAspect) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imageAspect;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imageAspect;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
      }

      context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }
  };

  const setupScrollTrigger = () => {
    ScrollTrigger.create({
      trigger: ".finale-hero",
      start: "top top",
      end: `+=${window.innerHeight * 10}px`,
      pin: true,
      pinSpacing: true,
      scrub: lenis ? 0.8 : 0.4, // Giảm scrub để tránh lag
      fastScrollEnd: true, // Tối ưu cho fast scrolling
      preventOverlaps: true, // Tránh overlap với section khác
      onUpdate: (self) => {
        const progress = self.progress;

        const animationProgress = Math.min(progress / 0.9, 1);
        const targetFrame = Math.round(animationProgress * (frameCount - 1));
        videoFrames.frame = targetFrame;
        render();

        if (progress <= 0.25) {
          const zProgress = progress / 0.25;
          const translateZ = zProgress * -500;

          let opacity = 1;
          if (progress >= 0.2) {
            const fadeProgress = Math.min((progress - 0.2) / (0.25 - 0.2), 1);
            opacity = 1 - fadeProgress;
          }

          gsap.set(finaleHeader, {
            transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
            opacity,
          });
        } else {
          gsap.set(finaleHeader, { opacity: 0 });
        }

        if (progress < 0.6) {
          gsap.set(finaleHeroImg, {
            transform: "translateZ(1000px)",
            opacity: 0,
          });
        } else if (progress >= 0.6 && progress <= 0.9) {
          const imgProgress = (progress - 0.6) / (0.9 - 0.6);
          const translateZ = 1000 - imgProgress * 1000;

          let opacity = 0;
          if (progress <= 0.8) {
            const opacityProgress = (progress - 0.6) / (0.8 - 0.6);
            opacity = opacityProgress;
          } else {
            opacity = 1;
          }

          gsap.set(finaleHeroImg, {
            transform: `translateZ(${translateZ}px)`,
            opacity,
          });
        } else {
          gsap.set(finaleHeroImg, {
            transform: "translateZ(0px)",
            opacity: 1,
          });
        }
      },
    });
  };

  window.addEventListener("resize", () => {
    setCanvasSize();
    render();
    ScrollTrigger.refresh();
  });
  
  // Ensure ScrollTrigger is properly initialized
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  });
  
  // Refresh ScrollTrigger after a short delay to ensure everything is loaded
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
  

}
