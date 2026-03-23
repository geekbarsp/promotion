document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links (like the "Scroll Down" button)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Simple interaction: highlight nav based on current page
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('nav a');
    const menuLength = menuItem.length;
    for (let i = 0; i < menuLength; i++) {
        if (menuItem[i].href === currentLocation) {
            menuItem[i].className = "active";
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- 3. CUSTOM CURSOR & DUST ---
    let cursor = document.getElementById('custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);
    }

    let lastDustTime = 0;

    document.addEventListener('mousemove', (e) => {
        // Keeps the glitch hand glued to your mouse coordinates
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

        const now = Date.now();
        if (now - lastDustTime > 40) {
            createDust(e.clientX, e.clientY);
            lastDustTime = now;
        }
    });

    function createDust(x, y) {
        const dust = document.createElement('div');
        dust.className = 'dust';
        const size = Math.random() * 5 + 4; 
        dust.style.width = size + 'px';
        dust.style.height = size + 'px';
        dust.style.left = x + 'px';
        dust.style.top = y + 'px';

        // Set the movement variables for the CSS animation
        dust.style.setProperty('--dx', (Math.random() - 0.5) * 60 + 'px');
        dust.style.setProperty('--dy', (Math.random() * 60 + 20) + 'px');
        dust.style.setProperty('--dr', (Math.random() * 360) + 'deg');

        document.body.appendChild(dust);
        setTimeout(() => dust.remove(), 1200);
    }

    // --- ONEKO CAT CHASE SCRIPT ---
    (function oneko() {
        const nekoEl = document.createElement("div");
        let nekoPosX = 32;
        let nekoPosY = 32;
        let mousePosX = 0;
        let mousePosY = 0;
        let frameCount = 0;
        let idleTime = 0;
        const nekoSpeed = 10;

        const spriteSets = {
            idle: [[-3, -3]],
            alert: [[-7, -3]],
            N: [[-1, -2], [-1, -3]],
            NE: [[0, -2], [0, -3]],
            E: [[-3, 0], [-3, -1]],
            SE: [[-5, -1], [-5, -2]],
            S: [[-6, -3], [-7, -2]],
            SW: [[-5, -3], [-6, -1]],
            W: [[-4, -2], [-4, -3]],
            NW: [[-1, 0], [-1, -1]],
        };

        function create() {
            nekoEl.id = "oneko";
            nekoEl.style.width = "32px";
            nekoEl.style.height = "32px";
            nekoEl.style.position = "fixed";
            nekoEl.style.backgroundImage = "url('assets/oneko.gif')";
            nekoEl.style.imageRendering = "pixelated";
            document.body.appendChild(nekoEl);

            document.addEventListener('mousemove', (event) => {
                mousePosX = event.clientX;
                mousePosY = event.clientY;
            });

            setInterval(frame, 100);
        }

        function setSprite(name, frame) {
            const sprite = spriteSets[name][frame % spriteSets[name].length];
            nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
        }

        function frame() {
            frameCount += 1;
            const diffX = nekoPosX - mousePosX;
            const diffY = nekoPosY - mousePosY;
            const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

            if (distance < 48) {
                setSprite("idle", 0);
                return;
            }

            let direction = diffY / distance > 0.5 ? "N" : "";
            direction += diffY / distance < -0.5 ? "S" : "";
            direction += diffX / distance > 0.5 ? "W" : "";
            direction += diffX / distance < -0.5 ? "E" : "";
            setSprite(direction, frameCount);

            nekoPosX -= (diffX / distance) * nekoSpeed;
            nekoPosY -= (diffY / distance) * nekoSpeed;
            nekoEl.style.left = `${nekoPosX - 16}px`;
            nekoEl.style.top = `${nekoPosY - 16}px`;
        }

        create();
    })();
});

// --- CAROUSEL LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return; // Only run if carousel exists on page

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');

    let currentIndex = 0;

    // Calculate how many slides to show based on window width
    const getSlidesPerView = () => window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;

    const moveToSlide = (index) => {
        const slidesPerView = getSlidesPerView();
        const slideWidth = slides[0].getBoundingClientRect().width;
        
        // Ensure we don't scroll past the end or beginning
        if (index < 0) index = slides.length - slidesPerView; 
        if (index > slides.length - slidesPerView) index = 0;

        const gap = 20; // Matches the gap property in CSS
        const amountToMove = -index * (slideWidth + gap);
        
        track.style.transform = `translateX(${amountToMove}px)`;
        currentIndex = index;
    };

    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
    });

    // Handle window resizing correctly
    window.addEventListener('resize', () => moveToSlide(currentIndex));
});

// --- DEVTOOLS DETECTION & PREVENTION ---
  // 1. Disable Right-Click
  document.addEventListener('contextmenu', e => e.preventDefault());

  // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
  document.onkeydown = function(e) {
    if (e.keyCode == 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || 
        (e.ctrlKey && e.keyCode == 85)) {
      window.location.href = "buzz-off.html";
      return false;
    }
  };

  // 3. Silent DevTools Detection
  // This detects if the window is resized (common when DevTools opens) 
  // or if the console is being "probed."
  (function() {
    const devtools = {
      isOpen: false,
      orientation: undefined
    };

    const threshold = 160;
    const emitEvent = (isOpen, orientation) => {
      if (isOpen) {
        window.location.href = "buzz-off.html";
      }
    };

    setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const orientation = widthThreshold ? 'vertical' : 'horizontal';

      if (!(heightThreshold && widthThreshold) &&
          ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
        if (!devtools.isOpen || devtools.orientation !== orientation) {
          emitEvent(true, orientation);
        }
        devtools.isOpen = true;
        devtools.orientation = orientation;
      } else {
        devtools.isOpen = false;
        devtools.orientation = undefined;
      }
    }, 500);
  })();

  
