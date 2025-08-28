import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { initFinaleSection } from "./finale-section.js";
import { headerFooterModule } from "./header-footer-module.js";
import { initTimelineSection /*, cleanupTimelineSection */ } from "./timeline-section.js";

gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);

/* ---------- utilities: reset scroll & state ---------- */

function forceScrollTop() {
  // đa lớp, đảm bảo thật sự về (0,0) kể cả iOS/Safari bfcache
  const toTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (window.lenis) {
      try {
        window.lenis.scrollTo(0, {
          immediate: true,
          duration: 0
        });
      } catch {}
    }
  };
  toTop();
  requestAnimationFrame(toTop);
  setTimeout(toTop, 0);
  setTimeout(toTop, 32);
}

function killAllScrollMagic() {
  // Kill mọi ScrollTrigger cũ (nếu có)
  try {
    ScrollTrigger.getAll().forEach(st => st.kill());
    if (ScrollTrigger.clearScrollMemory) {
      // GSAP 3.12+ có API này để loại bỏ memory restore
      ScrollTrigger.clearScrollMemory();
    }
  } catch {}

  // Kill mọi tween/delay còn treo (giữ an toàn: không clearProps toàn trang)
  try {
    gsap.globalTimeline.clear();
    gsap.killTweensOf("*");
  } catch {}
}

function lockScroll() {
  document.body.classList.add("scroll-locked");
  const prevent = e => {
    if (document.body.classList.contains("scroll-locked")) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  // Lưu để gỡ đúng listener
  window.__preventScroll__ = prevent;
  document.addEventListener("wheel", prevent, { passive: false });
  document.addEventListener("touchmove", prevent, { passive: false });
  document.addEventListener("keydown", (e) => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)) {
      if (document.body.classList.contains("scroll-locked")) e.preventDefault();
    }
  });
}

function unlockScroll() {
  document.body.classList.remove("scroll-locked");
  if (window.__preventScroll__) {
    document.removeEventListener("wheel", window.__preventScroll__);
    document.removeEventListener("touchmove", window.__preventScroll__);
    window.__preventScroll__ = null;
  }
}

/* ---------- Lenis init (idempotent) ---------- */

function ensureLenis() {
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
      const raf = (time) => {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    } else {
      // reset vị trí về 0 ngay lập tức
      try { window.lenis.scrollTo(0, { immediate: true }); } catch {}
    }
  } catch (e) {
    console.log("Lenis not available; fallback to native scroll");
  }
}

/* ---------- Preloader Timeline (giữ nội dung của bạn, chỉ bọc vào hàm) ---------- */

function buildPreloaderTimeline({ onComplete }) {
  const isMobile = window.innerWidth <= 1000;

  CustomEase.create("hop", ".8, 0, .3, 1");

  const splitTextElements = (selector, type="words,chars", addFirstChar=false) => {
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
          if (addFirstChar && index === 0) char.classList.add("first-char");
        });
      }
    });
  };

  // split theo đúng selectors bạn dùng
  splitTextElements(".intro-title h1", "words, chars", false);
  splitTextElements(".outro-title h1", "chars");
  splitTextElements(".card h1", "words, chars", true);

  gsap.set(
    [".split-overlay .intro-title .char span", ".split-overlay .outro-title .char span"],
    { y: "0%" }
  );
  gsap.set(".star-icon", { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(".split-overlay .star-icon", { opacity: 1, scale: 0.9, rotation: 0, x: 0 });
  gsap.set(".split-overlay .outro-title .char span", { color: "rgba(255, 215, 0, 0.3)" });
  gsap.set(".split-overlay .outro-title .char", {
    y: "0%", fontSize: isMobile ? "2.2rem" : "5rem", fontWeight: "700",
    color: "#FFD700", letterSpacing: "0.1em",
  });

  const tl = gsap.timeline({ defaults: { ease: "hop" } });

  // ==== giữ nguyên timeline của bạn (copy nguyên văn) ====
  tl.to(".preloader .intro-title .char span", {
      y: "0%", duration: 0.7, stagger: 0.05, ease: "power2.out",
    }, 0.3)
    .to(".preloader .intro-title .char:not(.first-char) span", {
      y: "100%", duration: 0.75, stagger: 0.05,
    }, 2)
    .to(".preloader .star-icon", {
      opacity: 1, scale: 1, rotation: 0, x: isMobile ? "-4rem" : "-8rem",
      duration: 1.2, ease: "back.out(1.7)",
    }, 1.2)
    .to(".preloader .star-icon", {
      x: isMobile ? "1rem" : "2rem", duration: 0.8, ease: "power2.out",
    }, 2.4)
    .to(".preloader .star-icon", {
      x: 0, scale: 1.2, duration: 0.5, ease: "bounce.out",
      onComplete: () => {
        gsap.to(".preloader .outro-title", {
          x: "±5px", duration: 0.1, repeat: 3, yoyo: true, ease: "power2.inOut",
        });
      },
    }, 3.2)
    .to(".preloader .outro-title .char span", {
      y: "0%", color: "#FFD700", textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
      duration: 0.35, stagger: 0.02, ease: "power2.out",
    }, 2.95)
    .to(".preloader .intro-title .char span", {
      y: "0%", duration: 0.8, stagger: 0.04, ease: "power2.out",
    }, 2.8)
    .to([".preloader .outro-title .char", ".preloader .star-icon"], {
      scale: 1.1, duration: 0.5, ease: "power2.out", stagger: 0.02,
    }, 4.2)
    .to(".preloader .intro-title .char span", {
      y: "0%", duration: 0.7, stagger: 0.03, ease: "power2.out",
    }, 4.0)
    .to([".preloader .outro-title .char", ".preloader .star-icon"], {
      scale: 1, fontSize: isMobile ? "2.2rem" : "5rem", fontWeight: "700",
      color: "#FFD700", letterSpacing: "0.1em",
      textShadow: "0 0 10px rgba(255, 215, 0, 0.6)",
      duration: 0.5, ease: "power2.out", stagger: 0.02,
    }, 4.6)
    .to(".preloader .intro-title .char span", {
      y: "0%", duration: 0.6, stagger: 0.03, ease: "power2.out",
      onComplete: () => {
        gsap.set(".preloader", {
          clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
        });
        gsap.set(".split-overlay", {
          clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
        });
      },
    }, 4.8)
    .to(".container", {
      clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
      duration: 1, ease: "power2.inOut",
    }, 5.2)
    .to([".preloader", ".split-overlay"], {
      y: (i) => (i === 0 ? "-50%" : "50%"),
      duration: 1.2, ease: "power3.inOut",
    }, 6.2)
    .to(".container", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.2, ease: "power2.out",
    }, 6.2)
    .to(".card-inner", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.8, ease: "back.out(1.7)",
    }, 6.5)
    .to(".card-title", {
      y: "0%", duration: 0.8, ease: "back.out(1.7)",
    }, 6.8)
    .to(".card-description", {
      opacity: 1, y: 0, duration: 1, ease: "power2.out",
    }, 7.5)
    .call(() => {
      // ===== preloader done → show hero, init modules, rồi mở scroll =====
      document.body.classList.add("hero-visible");
      headerFooterModule.init();

      // nếu bạn có cleanup functions, gọi ở đây trước khi init lại
      // cleanupTimelineSection?.();

      initTimelineSection();
      initFinaleSection();

      // đảm bảo các trigger dùng đúng vị trí mới
      if (ScrollTrigger.refresh) ScrollTrigger.refresh(true);

      setTimeout(() => {
        unlockScroll();
        document.body.classList.remove("hero-visible");
        document.body.classList.add("scroll-unlocked");
      }, 1000);
    }, [], 8.0);

  tl.eventCallback("onComplete", () => onComplete && onComplete());
  return tl;
}

/* ---------- boot sequence (idempotent) ---------- */

function boot() {
  // 1) Ngăn khôi phục scroll
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch {}

  // 2) Force về top nhiều lớp (trước khi dựng preloader)
  forceScrollTop();

  // 3) Khóa scroll trong suốt preloader
  lockScroll();

  // 4) Dọn mọi state GSAP/ScrollTrigger cũ (trường hợp bfcache/back-forward)
  killAllScrollMagic();

  // 5) Lenis on
  ensureLenis();

  // 6) Chạy preloader + flow chính
  buildPreloaderTimeline({
    onComplete: () => {
      // có thể đặt hook ở đây nếu cần
    }
  });
}

/* ---------- sự kiện điều hướng/refresh phổ biến ---------- */

// DOMContentLoaded: boot lần đầu
document.addEventListener("DOMContentLoaded", boot);

// Chrome/Firefox back-forward cache: pageshow.persisted === true → reset như mới
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    // bfcache restore: làm mới trải nghiệm
    boot();
  }
});

// Bất cứ refresh/phím tắt: ép reload chuẩn & về top
document.addEventListener("keydown", (e) => {
  // Windows: F5 hoặc Ctrl+R, macOS: ⌘R
  const mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isReloadCombo = (e.key === 'F5') || (e.ctrlKey && e.key.toLowerCase() === 'r') || (mac && e.metaKey && e.key.toLowerCase() === 'r');
  if (isReloadCombo) {
    e.preventDefault();
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch {}
    forceScrollTop();
    // hard reload (bỏ bfcache)
    window.location.reload();
  }
});

// Trước khi rời trang: cố gắng set top để tránh một số khôi phục vị trí
window.addEventListener("beforeunload", () => {
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch {}
  forceScrollTop();
});
