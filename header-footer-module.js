// Header & Footer Module - Best Practices Implementation
export class HeaderFooterModule {
  constructor() {
    this.header = null;
    this.footer = null;
    this.isInitialized = false;
  }

  // Initialize the module
  init() {
    if (this.isInitialized) {
      return;
    }

    this.createHeader();
    this.createFooter();
    this.setupEventListeners();
    
    // Hiện header và footer với animation ngay lập tức
    if (this.header) this.header.classList.add('show');
    if (this.footer) this.footer.classList.add('show');
    
    this.isInitialized = true;
  }

  // Create professional header
  createHeader() {
    const headerHTML = `
      <header class="header fixed_header">
        <div class="header__middle">
          <div class="header__mflex">
            <div class="header-left">
             <h1>
                <a href="/" title="" class="header-80namkyniem">
                  <img src="/header-80namkyniem.svg" alt="80 Năm Kỷ Niệm">
                </a>
              </h1>
              <a href="#" title="Đoàn Thanh niên Cộng sản Hồ Chí Minh" class="header-doan-logo">
                <img src="/Logo-Doan-Thanh-NIen-Cong-San-Ho-Chi-Minh-1.webp" alt="Logo Đoàn Thanh niên Cộng sản Hồ Chí Minh">
              </a>
              <a href="#" title="Khoa Công Nghệ Thông Tin Trường Đại Học Hàng Hải" class="header-doan-logo">
                <img src="/logo-khoa.png" alt="Logo Khoa Công Nghệ Thông Tin Trường Đại Học Hàng Hải">
              </a>
            </div>
          </div>
        </div>
      </header>
    `;

    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    this.header = document.querySelector('.header.fixed_header');
  }

  // Create professional footer
  createFooter() {
    const footerHTML = `
      <footer class="footer">
        <div class="footer__container">
          <div class="item item-1">
            <h4>Liên chi Đoàn TNCS Hồ Chí Minh khoa CNTT - Trường ĐH Hàng hải Việt Nam.</h4>
            <div class="address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7-7.75 7-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z"/>
              </svg>
              <span>484 Lạch Tray, P. Lê Chân, TP. Hải Phòng</span>
            </div>
            <div class="address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62,10.79c1.44,2.83 3.76,5.14 6.59,6.59l2.2-2.2c0.27-0.27 0.67-0.36 1.02-0.24c1.12,0.37 2.33,0.57 3.57,0.57c0.55,0 1,0.45 1,1V20c0,0.55-0.45,1-1,1c-9.39,0-17-7.61-17-17c0-0.55 0.45-1 1-1h3.5c0.55,0 1,0.45 1,1c0,1.25 0.2,2.45 0.57,3.57c0.11,0.35 0.03,0.74-0.25,1.02l-2.2,2.2z"/>
              </svg>
              <span>(+84). 225. 3829 109 / 3735 931</span>
            </div>
            <div class="email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,4H4C2.89,4 2,4.89 2,6V18C2,19.11 2.89,20 4,20H20C21.11,20 22,19.11 22,18V6C22,4.89 21.11,4 20,4M20,8L12,13L4,8V6L12,11L20,6V8Z"/>
              </svg>
              <span>info@vimaru.edu.vn</span>
            </div>
          </div>
          <div class="item item-2">
            <h4>Thông tin bổ sung</h4>
            <div class="address">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <span>Fax: (+84). 225. 3735 282 / 3625 175</span>
            </div>
            <p class="sapo">Website chính thức: <a href="https://www.vimaru.edu.vn/" target="_blank" rel="noopener noreferrer">www.vimaru.edu.vn</a></p>
          </div>
          <div class="item item-3">
            <h4>Phát triển bởi</h4>
            <p class="sapo">The Wiii Lab</p>
            <p>Đội ngũ xây dựng: <strong>HoLiHu</strong></p>
            <p>© 2025 Bản quyền thuộc về The Wiii Lab. Mọi quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    `;

    // Insert footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    this.footer = document.querySelector('.footer');
  }

  // Setup event listeners
  setupEventListeners() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
      if (this.header) {
        const scrollY = window.scrollY;
        if (scrollY > 100) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }
    });

    // Smooth scroll for footer links
    const footerLinks = document.querySelectorAll('.footer .link .item');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          // Handle navigation
        }
      });
    });
  }

  // Public methods for external control
  showHeader() {
    if (this.header) {
      this.header.style.display = 'block';
    }
  }

  hideHeader() {
    if (this.header) {
      this.header.style.display = 'none';
    }
  }

  showFooter() {
    if (this.footer) {
      this.footer.style.display = 'block';
    }
  }

  hideFooter() {
    if (this.footer) {
      this.footer.style.display = 'none';
    }
  }

  // Cleanup method
  destroy() {
    if (this.header) {
      this.header.remove();
    }
    if (this.footer) {
      this.footer.remove();
    }
    this.isInitialized = false;
  }
}

// Export singleton instance
export const headerFooterModule = new HeaderFooterModule();
