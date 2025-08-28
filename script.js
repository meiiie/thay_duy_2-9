import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { initFinaleSection } from "./finale-section.js";
import { headerFooterModule } from "./header-footer-module.js";
import { initTimelineSection } from "./timeline-section.js";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase, SplitText);
  
  // Initialize Lenis for smooth scrolling if available
  try {
    if (!window.lenis) {
      window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });
      
      function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } catch (error) {
    console.log('Lenis not available, using default scroll behavior');
  }

  // >>> PHẦN ĐƯỢC THAY ĐỔI <<<
  // Đảm bảo trang luôn ở đầu khi tải lại
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Tắt tính năng tự động khôi phục vị trí cuộn.
  }
  window.scrollTo(0, 0); // Luôn luôn cuộn trang về đầu.
  // >>> KẾT THÚC PHẦN THAY ĐỔI <<<
  
  document.body.classList.add('scroll-locked');
  
  const preventScroll = (e) => {
    if (document.body.classList.contains('scroll-locked')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  
  document.addEventListener('wheel', preventScroll, { passive: false });
  document.addEventListener('touchmove', preventScroll, { passive: false });
  document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
      if (document.body.classList.contains('scroll-locked')) {
        e.preventDefault();
      }
    }
  });
  
  const unlockScroll = () => {
    document.body.classList.remove('scroll-locked');
    document.removeEventListener('wheel', preventScroll);
    document.removeEventListener('touchmove', preventScroll);
  };

  CustomEase.create("hop", ".8, 0, .3, 1");

  const splitTextElements = (
    selector,
    type = "words,chars",
    addFirstChar = false
  ) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const splitText = new SplitText(element, {
        type,
        wordsClass: "word",
        charsClass: "char",
      });

      if (type.includes("chars")) {
        splitText.chars.forEach((char, index) => {
          const originalText = char.textContent;
          char.innerHTML = `<span>${originalText}</span>`;

          if (addFirstChar && index === 0) {
            char.classList.add("first-char");
          }
        });
      }
    });
  };

  splitTextElements(".intro-title h1", "words, chars", false);
  splitTextElements(".outro-title h1", "chars");
  splitTextElements(".card h1", "words, chars", true);

  const isMobile = window.innerWidth <= 1000;

  gsap.set(
    [
      ".split-overlay .intro-title .char span",
      ".split-overlay .outro-title .char span",
    ],
    { y: "0%" }
  );

  gsap.set(".star-icon", {
    opacity: 0,
    scale: 0,
    rotation: -180,
  });

  gsap.set(".split-overlay .star-icon", {
    opacity: 1,
    scale: 0.9,
    rotation: 0,
    x: 0,
  });

  gsap.set(".split-overlay .outro-title .char span", {
    color: "rgba(255, 215, 0, 0.3)",
  });

  gsap.set(".split-overlay .outro-title .char", {
    y: "0%",
    fontSize: isMobile ? "2.2rem" : "5rem",
    fontWeight: "700",
    color: "#FFD700",
    letterSpacing: "0.1em",
  });

  const tl = gsap.timeline({ defaults: { ease: "hop" } });

  tl.to(
    ".preloader .intro-title .char span",
    {
      y: "0%",
      duration: 0.7,
      stagger: 0.05,
      ease: "power2.out",
    },
    0.3
  )
    .to(
      ".preloader .intro-title .char:not(.first-char) span",
      {
        y: "100%",
        duration: 0.75,
        stagger: 0.05,
      },
      2
    )
    .to(
      ".preloader .star-icon",
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        x: isMobile ? "-4rem" : "-8rem",
        duration: 1.2,
        ease: "back.out(1.7)",
      },
      1.2
    )
    .to(
      ".preloader .star-icon",
      {
        x: isMobile ? "1rem" : "2rem",
        duration: 0.8,
        ease: "power2.out",
      },
      2.4
    )
    .to(
      ".preloader .star-icon",
      {
        x: 0,
        scale: 1.2,
        duration: 0.5,
        ease: "bounce.out",
        onComplete: () => {
          gsap.to(".preloader .outro-title", {
            x: "±5px",
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power2.inOut",
          });
        },
      },
      3.2
    )
    .to(
      ".preloader .outro-title .char span",
      {
        y: "0%",
        color: "#FFD700",
        textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
        duration: 0.35,
        stagger: 0.02,
        ease: "power2.out",
      },
      2.95
    )
    .to(
      ".preloader .intro-title .char span",
      {
        y: "0%",
        duration: 0.8,
        stagger: 0.04,
        ease: "power2.out",
      },
      2.8
    )
    .to(
      [".preloader .outro-title .char", ".preloader .star-icon"],
      {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.02,
      },
      4.2
    )
    .to(
      ".preloader .intro-title .char span",
      {
        y: "0%",
        duration: 0.7,
        stagger: 0.03,
        ease: "power2.out",
      },
      4.0
    )
    .to(
      [".preloader .outro-title .char", ".preloader .star-icon"],
      {
        scale: 1,
        fontSize: isMobile ? "2.2rem" : "5rem",
        fontWeight: "700",
        color: "#FFD700",
        letterSpacing: "0.1em",
        textShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.02,
      },
      4.6
    )
    .to(
      ".preloader .intro-title .char span",
      {
        y: "0%",
        duration: 0.6,
        stagger: 0.03,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(".preloader", {
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
          });
          gsap.set(".split-overlay", {
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
          });
        },
      },
      4.8
    )
    .to(
      ".container",
      {
        clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
        duration: 1,
        ease: "power2.inOut",
      },
      5.2
    );

  tl.to(
    [".preloader", ".split-overlay"],
    {
      y: (i) => (i === 0 ? "-50%" : "50%"),
      duration: 1.2,
      ease: "power3.inOut",
    },
    6.2
  )
    .to(
      ".container",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.2,
        ease: "power2.out",
      },
      6.2
    )
    .to(
      ".card-inner",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      6.5
    )
    .to(
      ".card-title",
      {
        y: "0%",
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      6.8
    )
    .to(
      ".card-description",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      7.5
    )
    .call(() => {
      document.body.classList.add('hero-visible');
      headerFooterModule.init();
      initTimelineSection();
      initFinaleSection();
      setTimeout(() => {
        unlockScroll();
        document.body.classList.remove('hero-visible');
        document.body.classList.add('scroll-unlocked');
      }, 1000);
    }, [], 8.0);
});