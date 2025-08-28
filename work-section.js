// Vietnam Work Section - Based on v2 with Vietnam National Day theme
document.addEventListener("DOMContentLoaded", async () => {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    return;
  }
  
  // Initialize immediately after preloader completes
  setTimeout(async () => {
    
    // Use existing Lenis instance if available
    let lenis;
    if (window.lenis) {
      lenis = window.lenis;
    } else {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      window.lenis = lenis;
    }
    
    // Only add scroll listener if not already added
    if (!lenis.scrollListeners || lenis.scrollListeners.length === 0) {
      lenis.on("scroll", ScrollTrigger.update);
    }
    
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const workSection = document.querySelector(".work");
    const workContainer = document.querySelector(".work-container");
    if (!workSection || !workContainer) {
      return;
    }

    const lerp = (start, end, t) => start + (end - start) * t;

    // Remove grid canvas completely for cleaner background

    // Three.js Setup
    const lettersScene = new THREE.Scene();
    const cardsScene = new THREE.Scene();

    const createCamera = () =>
      new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

    const lettersCamera = createCamera();
    const cardsCamera = createCamera();

    // Letters Renderer (Optimized)
    const lettersRenderer = new THREE.WebGLRenderer({
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: "high-performance"
    });
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    lettersRenderer.setClearColor(0x000000, 0);
    lettersRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio
    lettersRenderer.domElement.id = "letters-canvas";

    // Cards Renderer (Optimized)
    const cardsRenderer = new THREE.WebGLRenderer({
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: "high-performance"
    });
    cardsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio
    cardsRenderer.setSize(window.innerWidth, window.innerHeight);
    cardsRenderer.setClearColor(0x000000, 0);
    cardsRenderer.domElement.id = "cards-canvas";

    workContainer.appendChild(lettersRenderer.domElement);
    workContainer.appendChild(cardsRenderer.domElement);

    // Create 3D Paths
    const createTextAnimationPath = (yPos, amplitude) => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0x000, linewidth: 1 })
      );
      line.curve = curve;
      return line;
    };

    const paths = [
      createTextAnimationPath(10, 2),    // 0
      createTextAnimationPath(3.5, 1),   // 2
      createTextAnimationPath(-3.5, -1), // 0
      createTextAnimationPath(-10, -2),  // 9
    ];
    paths.forEach((line) => lettersScene.add(line));

    // Historical Data for Interactive Gallery
    const historicalData = [
      {
        id: 1,
        title: "Tuyên Ngôn Độc Lập 2/9/1945",
        date: "2 tháng 9, 1945",
        description: "Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội, tuyên bố sự ra đời của nước Việt Nam Dân chủ Cộng hòa. Đây là khoảnh khắc lịch sử vĩ đại, đánh dấu việc Việt Nam thoát khỏi ách đô hộ của thực dân Pháp và phát xít Nhật.",
        image: "assets/img1.jpg"
      },
      {
        id: 2,
        title: "Quân Đội Nhân Dân Việt Nam",
        date: "22 tháng 12, 1944",
        description: "Ngày thành lập Quân đội Nhân dân Việt Nam, tiền thân là Đội Việt Nam Tuyên truyền Giải phóng quân. Đây là lực lượng vũ trang cách mạng đầu tiên của dân tộc Việt Nam do Đảng Cộng sản Việt Nam và Chủ tịch Hồ Chí Minh sáng lập.",
        image: "assets/img2.jpg"
      },
      {
        id: 3,
        title: "Cuộc Kháng Chiến Chống Pháp",
        date: "19 tháng 12, 1946",
        description: "Cuộc kháng chiến toàn quốc chống thực dân Pháp bắt đầu, kéo dài 9 năm (1946-1954). Cuộc kháng chiến này đã kết thúc bằng chiến thắng Điện Biên Phủ lừng lẫy, buộc Pháp phải ký Hiệp định Genève và rút khỏi Đông Dương.",
        image: "assets/img3.jpg"
      },
      {
        id: 4,
        title: "Chiến Thắng Điện Biên Phủ",
        date: "7 tháng 5, 1954",
        description: "Chiến thắng Điện Biên Phủ - 'Điện Biên Phủ chấn động địa cầu', đánh bại hoàn toàn Tập đoàn cứ điểm Điện Biên Phủ của Pháp. Đây là chiến thắng có ý nghĩa quyết định làm thay đổi cục diện chính trị toàn thế giới.",
        image: "assets/img4.jpg"
      },
      {
        id: 5,
        title: "Giải Phóng Miền Nam",
        date: "30 tháng 4, 1975",
        description: "Hoàn thành sự nghiệp giải phóng miền Nam, thống nhất đất nước. Sự kiện lịch sử này đã kết thúc cuộc chiến tranh kéo dài và mở ra kỷ nguyên mới của hòa bình, thống nhất và xây dựng đất nước.",
        image: "assets/img5.jpg"
      },
      {
        id: 6,
        title: "Đổi Mới và Phát Triển",
        date: "Từ năm 1986",
        description: "Chính sách Đổi Mới được ban hành, mở ra kỷ nguyên phát triển kinh tế - xã hội mới. Việt Nam từ một nước nghèo nàn, lạc hậu đã trở thành nước có thu nhập trung bình và hội nhập sâu rộng với thế giới.",
        image: "assets/img6.jpg"
      },
      {
        id: 7,
        title: "Việt Nam Hiện Đại",
        date: "Thế kỷ 21",
        description: "Việt Nam hôm nay đã trở thành một quốc gia năng động, hiện đại với nền kinh tế phát triển mạnh mẽ. Đất nước ngày càng khẳng định vị thế trên trường quốc tế và hướng tới mục tiêu trở thành nước phát triển vào năm 2045.",
        image: "assets/img7.jpg"
      }
    ];



    // Create Letters for 02/09
    const textContainer = document.querySelector(".text-container");
    const letterPositions = new Map();
    const vietnamLetters = ["0", "2", "0", "9"]; // 02/09 - National Day
    
    paths.forEach((line, i) => {
      // Reduce number of letters for better performance
      line.letterElements = Array.from({ length: 8 }, () => {
        const el = document.createElement("div");
        el.className = "letter";
        el.textContent = vietnamLetters[i];
        textContainer.appendChild(el);
        letterPositions.set(el, {
          current: { x: 0, y: 0 },
          target: { x: 0, y: 0 },
        });
        return el;
      });
    });

    // Load Images
    const loadImage = (num) =>
      new Promise((resolve, reject) => {
        const texture = new THREE.TextureLoader().load(
          `assets/img${num}.jpg`,
          (loadedTexture) => {
            Object.assign(loadedTexture, {
              generateMipmaps: true,
              minFilter: THREE.LinearMipmapLinearFilter,
              magFilter: THREE.LinearFilter,
              anisotropy: cardsRenderer.capabilities.getMaxAnisotropy(),
            });
            resolve(loadedTexture);
          },
          undefined,
          (error) => {
            resolve(null);
          }
        );
      });

    try {
      const images = await Promise.all([1, 2, 3, 4, 5, 6, 7].map(loadImage));
      const validImages = images.filter(img => img !== null);
  

      // Canvas Texture for Cards (Optimized size)
      const textureCanvas = document.createElement("canvas");
      const ctx = textureCanvas.getContext("2d");
      [textureCanvas.width, textureCanvas.height] = [2048, 1024]; // Reduced for performance

      const drawCardsOnCanvas = (offset = 0) => {
        ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
        const [cardWidth, cardHeight] = [
          textureCanvas.width / 3,
          textureCanvas.height / 2,
        ];
        const spacing = textureCanvas.width / 2.5;
        validImages.forEach((img, i) => {
          if (img?.image) {
            ctx.drawImage(
              img.image,
              i * spacing + (0.35 - offset) * textureCanvas.width * 5 - cardWidth,
              (textureCanvas.height - cardHeight) / 2,
              cardWidth,
              cardHeight
            );
          }
        });
      };

      const cardsTexture = new THREE.CanvasTexture(textureCanvas);
      Object.assign(cardsTexture, {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        anisotropy: cardsRenderer.capabilities.getMaxAnisotropy(),
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
      });

      const cardsPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 15, 50, 1),
        new THREE.MeshBasicMaterial({
          map: cardsTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1,
          depthTest: false,
          depthWrite: false,
        })
      );
      cardsScene.add(cardsPlane);

      // Create curved geometry
      const positions = cardsPlane.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        positions.setZ(i, Math.pow(positions.getX(i) / 15, 2) * 5);
      }
      positions.needsUpdate = true;

      [lettersCamera, cardsCamera].forEach((camera) => camera.position.setZ(20));

      const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
      const updateTargetPositions = (scrollProgress = 0) => {
        paths.forEach((line, lineIndex) => {
          line.letterElements.forEach((element, i) => {
            // Adjusted for 8 letters instead of 15
            const point = line.curve.getPoint(
              (i / 7 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1
            );
            const vector = point.clone().project(lettersCamera);
            const positions = letterPositions.get(element);
            positions.target = {
              x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
              y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
            };
          });
        });
      };

      const updateLetterPositions = () => {
        letterPositions.forEach((positions, element) => {
          const distX = positions.target.x - positions.current.x;
          if (Math.abs(distX) > window.innerWidth * 0.7) {
            [positions.current.x, positions.current.y] = [
              positions.target.x,
              positions.target.y,
            ];
          } else {
            positions.current.x = lerp(
              positions.current.x,
              positions.target.x,
              0.07
            );
            positions.current.y = lerp(
              positions.current.y,
              positions.target.y,
              0.07
            );
          }
          element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
        });
      };

      const animate = () => {
        updateLetterPositions();
        lettersRenderer.render(lettersScene, lettersCamera);
        cardsRenderer.render(cardsScene, cardsCamera);
        requestAnimationFrame(animate);
      };

      // ScrollTrigger Setup (Fixed)
      const workScrollTrigger = ScrollTrigger.create({
        trigger: ".work",
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = Math.max(0, Math.min(1, self.progress));
          updateTargetPositions(progress);
          drawCardsOnCanvas(progress);
          cardsTexture.needsUpdate = true;
        },
        onEnter: () => {
          // Work section entered
        },
        onLeave: () => {
          // Work section left
        },
        onEnterBack: () => {
          // Work section entered back
        },
        onLeaveBack: () => {
          // Work section left back
        }
      });

      animate();
      updateTargetPositions(0);
      
      // Refresh ScrollTrigger after initialization
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // Interactive Gallery System removed as requested

      // Resize Event
      window.addEventListener("resize", () => {
        [lettersCamera, cardsCamera].forEach((camera) => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        });
        [lettersRenderer, cardsRenderer].forEach((renderer) => {
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
        cardsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Refresh ScrollTrigger after resize
        ScrollTrigger.refresh();
        
        const currentTrigger = ScrollTrigger.getAll().find(st => st.trigger?.classList?.contains('work'));
        if (currentTrigger) {
          updateTargetPositions(currentTrigger.progress || 0);
        }
      });


      
      // Cleanup function for proper disposal
      const cleanup = () => {
        if (workScrollTrigger) {
          workScrollTrigger.kill();
        }
        lettersRenderer.dispose();
        cardsRenderer.dispose();
        lettersScene.clear();
        cardsScene.clear();
      };
      
      // Add cleanup to window for debugging
      window.workSectionCleanup = cleanup;
      
    } catch (error) {
      // Error loading images
    }

  }, 1000); // Reduced wait time for hero animation
});