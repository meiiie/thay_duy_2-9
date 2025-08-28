// Timeline Section Module - Isolated from main project
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Timeline Configuration
const timelineConfig = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500,
};

// Timeline Data - Vietnam History
const timelineItems = [
  { 
    name: "Cách Mạng Tháng Tám 1945", 
    img: "/timeline-images/img_1.jpg",
    description: "Khởi nghĩa giành chính quyền trên toàn quốc"
  },
  { 
    name: "Tuyên Ngôn Độc Lập 2/9/1945", 
    img: "/timeline-images/img_2.jpg",
    description: "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập"
  },
  { 
    name: "Toàn Quốc Kháng Chiến 1946", 
    img: "/timeline-images/img_3.jpg",
    description: "Lời kêu gọi toàn quốc kháng chiến"
  },
  { 
    name: "Chiến Thắng Điện Biên Phủ 1954", 
    img: "/timeline-images/img_4.jpg",
    description: "Chiến thắng lịch sử Điện Biên Phủ"
  },
  { 
    name: "Giải Phóng Miền Nam 1975", 
    img: "/timeline-images/img_5.jpg",
    description: "Thống nhất đất nước"
  },
  { 
    name: "Đổi Mới 1986", 
    img: "/timeline-images/img_6.jpg",
    description: "Công cuộc đổi mới toàn diện"
  },
  { 
    name: "Hội Nhập Quốc Tế 1995", 
    img: "/timeline-images/img_7.jpg",
    description: "Gia nhập ASEAN và mở rộng quan hệ"
  },
  { 
    name: "Phát Triển Kinh Tế 2000s", 
    img: "/timeline-images/img_8.jpg",
    description: "Tăng trưởng kinh tế nhanh chóng"
  },
  { 
    name: "Hiện Đại Hóa 2010s", 
    img: "/timeline-images/img_9.png",
    description: "Công nghiệp hóa, hiện đại hóa"
  },
  { 
    name: "Việt Nam 2025", 
    img: "/timeline-images/img_10.jpg",
    description: "Hướng tới tương lai phát triển bền vững"
  },
];

// Timeline Module Variables
let timelineScrollTrigger;
let currentActiveIndex = 0;
let imageElements = [];
let isMobile = false;

// Utility Functions
function getBezierPosition(t) {
  const containerWidth = window.innerWidth * 0.3;
  const containerHeight = window.innerHeight;
  const arcStartX = containerWidth - 220;
  const arcStartY = -200;
  const arcEndY = containerHeight + 200;
  const arcControlPointX = arcStartX + timelineConfig.arcRadius;
  const arcControlPointY = containerHeight / 2;

  const x =
    (1 - t) * (1 - t) * arcStartX +
    2 * (1 - t) * t * arcControlPointX +
    t * t * arcStartX;
  const y =
    (1 - t) * (1 - t) * arcStartY +
    2 * (1 - t) * t * arcControlPointY +
    t * t * arcEndY;
  return { x, y };
}

function getImgProgressState(index, overallProgress) {
  const startTime = index * timelineConfig.gap;
  const endTime = startTime + timelineConfig.speed;

  if (overallProgress < startTime) return -1;
  if (overallProgress > endTime) return 2;

  return (overallProgress - startTime) / timelineConfig.speed;
}

// Check if device is mobile
function checkMobile() {
  isMobile = window.innerWidth <= 768;
  return isMobile;
}

// Initialize Timeline Section
export function initTimelineSection() {
  
  // Initialize immediately
  
  // Check mobile status
  checkMobile();
  
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);
  
  // Get DOM elements
  const titlesContainer = document.querySelector(".timeline-titles");
  const imagesContainer = document.querySelector(".timeline-images");
  const timelineHeader = document.querySelector(".timeline-header");
  const titlesContainerElement = document.querySelector(".timeline-titles-container");
  const introTextElements = document.querySelectorAll(".timeline-intro-text");
  
  if (!titlesContainer || !imagesContainer) {
    return;
  }

  // Clear existing content
  titlesContainer.innerHTML = '';
  imagesContainer.innerHTML = '';
  imageElements = [];

  // Create timeline items
  timelineItems.forEach((item, index) => {
    const titleElement = document.createElement("h1");
    titleElement.textContent = item.name;
    if (index === 0) titleElement.style.opacity = "1";
    titlesContainer.appendChild(titleElement);

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "timeline-img";
    const imgElement = document.createElement("img");
    imgElement.src = item.img;
    imgElement.alt = item.description;
    imgWrapper.appendChild(imgElement);
    imagesContainer.appendChild(imgWrapper);
    imageElements.push(imgWrapper);
  });

  const titleElements = titlesContainer.querySelectorAll("h1");

  // Initialize image elements
  imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));

  // Create ScrollTrigger
  timelineScrollTrigger = ScrollTrigger.create({
    trigger: ".timeline-section",
    start: "top top",
    end: () => {
      // Responsive end distance based on screen size
      if (window.innerWidth <= 768) {
        return `+=${window.innerHeight * 3}px`; // Reduced for mobile
      } else if (window.innerWidth <= 1024) {
        return `+=${window.innerHeight * 5}px`; // Medium for tablet
      } else {
        return `+=${window.innerHeight * 10}px`; // Full for desktop
      }
    },
    pin: true,
    pinSpacing: () => {
      // Responsive pin spacing based on screen size
      if (window.innerWidth <= 768) {
        return false; // Disable pin spacing on mobile to reduce gaps
      }
      return true; // Enable pin spacing on larger screens
    },
    scrub: window.lenis ? 1 : 0.5, // Smoother scrub when Lenis is available
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress <= 0.2) {
        const animationProgress = progress / 0.2;

        // Responsive move distance for mobile
        let moveDistance;
        if (isMobile) {
          moveDistance = window.innerWidth * 0.4; // Reduced movement on mobile
        } else {
          moveDistance = window.innerWidth * 0.6;
        }
        
        gsap.set(introTextElements[0], {
          x: -animationProgress * moveDistance,
        });
        gsap.set(introTextElements[1], {
          x: animationProgress * moveDistance,
        });
        gsap.set(introTextElements[0], { opacity: 1 });
        gsap.set(introTextElements[1], { opacity: 1 });

        // Responsive background image scaling
        if (isMobile) {
          gsap.set(".timeline-bg-img", {
            transform: `scale(${0.8 + animationProgress * 0.2})`, // Reduced scale for mobile
          });
          gsap.set(".timeline-bg-img img", {
            transform: `scale(${1.2 - animationProgress * 0.2})`, // Adjusted scale for mobile
          });
        } else {
          gsap.set(".timeline-bg-img", {
            transform: `scale(${animationProgress})`,
          });
          gsap.set(".timeline-bg-img img", {
            transform: `scale(${1.5 - animationProgress * 0.5})`,
          });
        }

        imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
        if (timelineHeader) timelineHeader.style.opacity = "0";
        gsap.set(titlesContainerElement, {
          "--before-opacity": "0",
          "--after-opacity": "0",
        });
      } else if (progress > 0.2 && progress <= 0.25) {
        // Responsive background image scaling
        if (isMobile) {
          gsap.set(".timeline-bg-img", { transform: "scale(1)" });
          gsap.set(".timeline-bg-img img", { transform: "scale(1)" });
        } else {
          gsap.set(".timeline-bg-img", { transform: "scale(1)" });
          gsap.set(".timeline-bg-img img", { transform: "scale(1)" });
        }

        gsap.set(introTextElements[0], { opacity: 0 });
        gsap.set(introTextElements[1], { opacity: 0 });

        imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
        if (timelineHeader) timelineHeader.style.opacity = "1";
        gsap.set(titlesContainerElement, {
          "--before-opacity": "1",
          "--after-opacity": "1",
        });
      } else if (progress > 0.25 && progress <= 0.95) {
        // Responsive background image scaling
        if (isMobile) {
          gsap.set(".timeline-bg-img", { transform: "scale(1)" });
          gsap.set(".timeline-bg-img img", { transform: "scale(1)" });
        } else {
          gsap.set(".timeline-bg-img", { transform: "scale(1)" });
          gsap.set(".timeline-bg-img img", { transform: "scale(1)" });
        }

        gsap.set(introTextElements[0], { opacity: 0 });
        gsap.set(introTextElements[1], { opacity: 0 });

        if (timelineHeader) timelineHeader.style.opacity = "1";
        gsap.set(titlesContainerElement, {
          "--before-opacity": "1",
          "--after-opacity": "1",
        });

        const switchProgress = (progress - 0.25) / 0.7;
        const viewportHeight = window.innerHeight;
        const titlesContainerHeight = titlesContainer.scrollHeight;
        const startPosition = viewportHeight;
        const targetPosition = -titlesContainerHeight;
        const totalDistance = startPosition - targetPosition;
        const currentY = startPosition - switchProgress * totalDistance;

        // Responsive adjustments for mobile
        if (isMobile) {
          // Reduce movement distance on mobile
          const mobileProgress = Math.min(switchProgress * 1.5, 1);
          const mobileY = startPosition - mobileProgress * totalDistance;
          gsap.set(".timeline-titles", {
            transform: `translateY(${mobileY}px)`,
          });
        } else {
          gsap.set(".timeline-titles", {
            transform: `translateY(${currentY}px)`,
          });
        }

        imageElements.forEach((img, index) => {
          const imageProgress = getImgProgressState(index, switchProgress);

          if (imageProgress < 0 || imageProgress > 1) {
            gsap.set(img, { opacity: 0 });
          } else {
            const pos = getBezierPosition(imageProgress);
            
            // Responsive adjustments for mobile images
            if (isMobile) {
              // Reduce image movement and scale on mobile
              const mobileX = (pos.x - 100) * 0.7;
              const mobileY = (pos.y - 75) * 0.7;
              gsap.set(img, {
                x: mobileX,
                y: mobileY,
                opacity: 1,
                scale: 0.8, // Smaller images on mobile
              });
            } else {
              gsap.set(img, {
                x: pos.x - 100,
                y: pos.y - 75,
                opacity: 1,
                scale: 1,
              });
            }
          }
        });

        const viewportMiddle = viewportHeight / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        titleElements.forEach((title, index) => {
          const titleRect = title.getBoundingClientRect();
          const titleCenter = titleRect.top + titleRect.height / 2;
          const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);

          if (distanceFromCenter < closestDistance) {
            closestDistance = distanceFromCenter;
            closestIndex = index;
          }
        });

        if (closestIndex !== currentActiveIndex) {
          if (titleElements[currentActiveIndex]) {
            titleElements[currentActiveIndex].style.opacity = "0.25";
          }
          titleElements[closestIndex].style.opacity = "1";
          const bgImg = document.querySelector(".timeline-bg-img img");
          if (bgImg) bgImg.src = timelineItems[closestIndex].img;
          currentActiveIndex = closestIndex;
        }
      } else if (progress > 0.95) {
        if (timelineHeader) timelineHeader.style.opacity = "0";
        gsap.set(titlesContainerElement, {
          "--before-opacity": "0",
          "--after-opacity": "0",
        });
      }
    },
    });
  
  // Ensure ScrollTrigger is properly initialized for timeline
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  });
  
  // Refresh ScrollTrigger after a short delay to ensure everything is loaded
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
  
   
}

// Cleanup function
export function cleanupTimelineSection() {
  if (timelineScrollTrigger) {
    timelineScrollTrigger.kill();
  }
  
}