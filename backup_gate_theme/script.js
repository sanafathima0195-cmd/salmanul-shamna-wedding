/**
 * Royal Majesty Wedding Invitation - Interactive Engine
 * Salmanul Faris & Shamna Inna
 * Royal Emerald Green & 24K Antique Gold
 */

// Event & Couple Configuration
const DEFAULT_CONFIG = {
  groomName: "Salmanul Faris",
  groomParents: "Mr. Mohammed & Mrs. Sakkeena Mohammed",
  groomAddress: "Valiya Parambil Kizhakethil house, Pookattiri, Valancheri",
  groomPhone: "+91 9846507386",
  brideName: "Shamna Inna",
  brideParents: "Mr. Shamsudheen & Mrs. Soudath Shamsudheen",
  brideAddress: "Alungal House, Veliyamcode, Ponnani",
  weddingDate: "2026-11-16", // Monday, 16 November 2026
  weddingTime: "11:30 AM",
  weddingDateTimeISO: "2026-11-16T11:30:00",
  hijriDate: "1448 Ja: Akhir 6",
  venueName: "Nadhas Auditorium",
  venueCity: "Vaikathur, Valancheri",
  venueAddress: "Nadhas Auditorium & Convention Centre, Vaikathur, Valanchery, Malappuram District, Kerala - 676552",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Nadhas+Auditorium+Valanchery+Kerala",
  whatsappNumber: "919846507386"
};

let weddingConfig = { ...DEFAULT_CONFIG };
let currentTheme = "emerald"; // Default theme is strictly Royal Emerald Green

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadSavedTheme();
  initThemePicker();
  initGateReveal();
  initAudioControls();
  initScratchCard();
  initCountdownTimer();
  initParticles();
  initPhotoPreviewHandlers();
  initShareButton();
  updateCalendarLinks();
});

// ==========================================================================
// 1. THEME MANAGER
// ==========================================================================
function loadSavedTheme() {
  try {
    const saved = localStorage.getItem("salmanul_shamna_theme");
    if (saved) {
      currentTheme = saved;
    } else {
      currentTheme = "emerald";
    }
  } catch (e) {
    currentTheme = "emerald";
  }
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("salmanul_shamna_theme", theme);
  } catch(e) {}

  const labelElem = document.getElementById("currentThemeLabel");
  const dotElem = document.querySelector(".theme-picker-btn .theme-dot");
  const themeLabels = {
    emerald: "Royal Emerald",
    forest: "Deep Forest",
    olive: "Royal Olive",
    cypress: "Midnight Cypress",
    malabar: "Malabar Palm"
  };

  if (labelElem && themeLabels[theme]) {
    labelElem.textContent = themeLabels[theme];
  }
  if (dotElem) {
    dotElem.className = `theme-dot ${theme}`;
  }

  document.querySelectorAll(".theme-option-btn").forEach(btn => {
    if (btn.getAttribute("data-set-theme") === theme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  if (typeof window.redrawScratchFoil === "function") {
    window.redrawScratchFoil();
  }
}

function initThemePicker() {
  const toggleBtn = document.getElementById("btnThemeToggle");
  const dropdown = document.getElementById("themeDropdown");

  if (!toggleBtn || !dropdown) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  document.querySelectorAll(".theme-option-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const theme = btn.getAttribute("data-set-theme");
      if (theme) {
        applyTheme(theme);
      }
      dropdown.classList.remove("show");
    });
  });

  document.addEventListener("click", () => {
    dropdown.classList.remove("show");
  });
}

// ==========================================================================
// 2. ROYAL GATE / 3D DOOR ANIMATION & OPENING
// ==========================================================================
function closeInvitationDoors() {
  const gateOverlay = document.getElementById("royalGateOverlay");
  if (!gateOverlay) return;
  gateOverlay.style.display = "flex";
  // Force browser layout reflow
  void gateOverlay.offsetWidth;
  gateOverlay.classList.remove("opened");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function initGateReveal() {
  const gateOverlay = document.getElementById("royalGateOverlay");
  const btnOpen = document.getElementById("btnOpenInvitation");

  if (!btnOpen || !gateOverlay) return;

  // Clean initial history state on load so browser back button works cleanly
  if (window.history && window.history.replaceState) {
    try {
      window.history.replaceState({ invitationOpened: false }, "", window.location.pathname + window.location.search);
    } catch (e) {}
  }

  btnOpen.addEventListener("click", () => {
    startWeddingAudio();
    gateOverlay.classList.add("opened");

    if (window.history && window.history.pushState) {
      try {
        window.history.pushState({ invitationOpened: true }, "", "#invitation");
      } catch (e) {}
    }

    setTimeout(() => {
      gateOverlay.style.display = "none";
    }, 1600);
  });

  // Optional "Return to Front Cover" button in footer
  const btnReturnCover = document.getElementById("btnReturnToCover");
  if (btnReturnCover) {
    btnReturnCover.addEventListener("click", () => {
      pauseWeddingAudio();
      closeInvitationDoors();
      if (window.history && window.history.pushState) {
        try {
          window.history.pushState({ invitationOpened: false }, "", window.location.pathname + window.location.search);
        } catch (e) {}
      }
    });
  }
}

// ==========================================================================
// 3. BACKGROUND AUDIO PLAYER (Hob A3ma - ObaidaProNP1 / حب أعمى)
// ==========================================================================
let weddingAudioEl = null;
let audioIsPlaying = false;

function startWeddingAudio() {
  if (!weddingAudioEl) {
    weddingAudioEl = document.getElementById("weddingAudio");
  }
  if (!weddingAudioEl) return;

  weddingAudioEl.play().then(() => {
    audioIsPlaying = true;
    updateMusicBtnState(true);
  }).catch(() => {
    // Autoplay policy: will start upon explicit click
  });
}

function pauseWeddingAudio() {
  if (!weddingAudioEl) {
    weddingAudioEl = document.getElementById("weddingAudio");
  }
  if (weddingAudioEl) {
    try {
      weddingAudioEl.pause();
    } catch (e) {
      console.warn("Audio pause notice:", e);
    }
  }
  audioIsPlaying = false;
  updateMusicBtnState(false);
}

function updateMusicBtnState(playing) {
  const btn = document.getElementById("btnToggleMusic");
  if (!btn) return;
  if (playing) {
    btn.classList.add("active");
    btn.setAttribute("aria-label", "Pause Hob A3ma (حب أعمى)");
  } else {
    btn.classList.remove("active");
    btn.setAttribute("aria-label", "Play Hob A3ma (حب أعمى)");
  }
}

function initAudioControls() {
  weddingAudioEl = document.getElementById("weddingAudio");
  const musicBtn = document.getElementById("btnToggleMusic");
  if (!musicBtn) return;

  musicBtn.addEventListener("click", () => {
    if (!weddingAudioEl) return;
    if (weddingAudioEl.paused) {
      weddingAudioEl.play().then(() => {
        audioIsPlaying = true;
        updateMusicBtnState(true);
      }).catch(err => console.warn("Audio playback notice:", err));
    } else {
      pauseWeddingAudio();
    }
  });

  if (weddingAudioEl) {
    weddingAudioEl.addEventListener("play", () => updateMusicBtnState(true));
    weddingAudioEl.addEventListener("pause", () => updateMusicBtnState(false));
    weddingAudioEl.addEventListener("ended", () => updateMusicBtnState(false));
  }

  // 1. Immediately pause audio when page is hidden or user leaves/switches tabs/apps/goes back
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseWeddingAudio();
    }
  });

  // 2. Pause when navigating back/forward or leaving (pagehide covers bfcache & back gesture)
  window.addEventListener("pagehide", () => {
    pauseWeddingAudio();
  });

  // 3. Pause on window unload and beforeunload
  window.addEventListener("beforeunload", () => {
    pauseWeddingAudio();
  });
  window.addEventListener("unload", () => {
    pauseWeddingAudio();
  });

  // 4. Handle browser Back / Forward buttons (popstate)
  window.addEventListener("popstate", (e) => {
    // ALWAYS pause music when user navigates back in history
    pauseWeddingAudio();

    // If navigated back to the initial state (before doors were opened), re-close doors smoothly
    const gateOverlay = document.getElementById("royalGateOverlay");
    if (gateOverlay && (!e.state || !e.state.invitationOpened)) {
      closeInvitationDoors();
    }
  });

  // 5. Handle mobile Page Lifecycle freeze event
  document.addEventListener("freeze", () => {
    pauseWeddingAudio();
  });

  // 6. On pageshow (restored from back/forward cache), keep button state synced
  window.addEventListener("pageshow", () => {
    if (weddingAudioEl && weddingAudioEl.paused) {
      audioIsPlaying = false;
      updateMusicBtnState(false);
    }
  });

  // 7. Pause music immediately when user clicks outbound links (Maps, Instagram, Calendar, WhatsApp, Phone calls)
  const outboundLinks = [
    '#venueMapsLink',
    '#btnAddToCal',
    '#instagramOrderLink',
    '#btnShareWhatsApp',
    'a[href^="tel:"]',
    'a[href^="https://maps"]',
    'a[href*="instagram.com"]',
    'a[href*="wa.me"]'
  ];
  document.querySelectorAll(outboundLinks.join(", ")).forEach(el => {
    el.addEventListener("click", () => {
      pauseWeddingAudio();
    });
  });
}

// ==========================================================================
// 4. CANVAS SCRATCH-TO-REVEAL CARD
// ==========================================================================
function initScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let isScratching = false;
  let isRevealed = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawGoldFoil();
  }

  function drawGoldFoil() {
    if (isRevealed) return;

    // Theme-tailored Foil Gradients for all Green shades
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (currentTheme === "forest") {
      grad.addColorStop(0, "#fff8e8");
      grad.addColorStop(0.35, "#ecd599");
      grad.addColorStop(0.65, "#c4a75b");
      grad.addColorStop(1, "#80662a");
    } else if (currentTheme === "olive") {
      grad.addColorStop(0, "#fdf8e6");
      grad.addColorStop(0.35, "#d4af37");
      grad.addColorStop(0.65, "#ab8b26");
      grad.addColorStop(1, "#665013");
    } else if (currentTheme === "cypress") {
      grad.addColorStop(0, "#fbf4de");
      grad.addColorStop(0.35, "#e0be6c");
      grad.addColorStop(0.65, "#b59037");
      grad.addColorStop(1, "#735718");
    } else if (currentTheme === "malabar") {
      grad.addColorStop(0, "#fff9dc");
      grad.addColorStop(0.35, "#f0c742");
      grad.addColorStop(0.65, "#c99e1c");
      grad.addColorStop(1, "#8a6809");
    } else {
      // Default: Royal Emerald
      grad.addColorStop(0, "#faedd4");
      grad.addColorStop(0.35, "#dfb746");
      grad.addColorStop(0.65, "#c29b2b");
      grad.addColorStop(1, "#8e6d19");
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Damask dots pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    for (let x = 12; x < canvas.width; x += 28) {
      for (let y = 12; y < canvas.height; y += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Border Frame on Foil
    ctx.strokeStyle = "rgba(100, 75, 15, 0.45)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Text on Foil
    ctx.font = "bold 15px 'Cinzel', serif";
    ctx.fillStyle = "#332205";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH TO REVEAL DATE ✨", canvas.width / 2, canvas.height / 2 - 12);

    ctx.font = "12px 'Outfit', sans-serif";
    ctx.fillStyle = "#4a350c";
    ctx.fillText("Use your finger or mouse", canvas.width / 2, canvas.height / 2 + 14);
  }

  window.redrawScratchFoil = drawGoldFoil;

  function scratch(x, y) {
    if (isRevealed) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    checkScratchProgress();
  }

  function checkScratchProgress() {
    if (isRevealed) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentCount = 0;
      const step = 32;

      for (let i = 3; i < data.length; i += 4 * step) {
        if (data[i] === 0) {
          transparentCount++;
        }
      }

      const totalSamples = data.length / (4 * step);
      const percent = (transparentCount / totalSamples) * 100;

      if (percent > 35) {
        revealCompletely();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function revealCompletely() {
    if (isRevealed) return;
    isRevealed = true;

    canvas.style.transition = "opacity 0.8s ease-out";
    canvas.style.opacity = "0";
    setTimeout(() => {
      canvas.style.display = "none";
    }, 800);

    const instr = document.getElementById("scratchInstruction");
    if (instr) {
      instr.innerHTML = "<span>✨ Wedding Date &amp; Time Revealed! ✨</span>";
    }
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  canvas.addEventListener("mousedown", (e) => {
    isScratching = true;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  });

  window.addEventListener("mouseup", () => {
    isScratching = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isScratching) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  });

  // Touch Support for mobile phones
  canvas.addEventListener("touchstart", (e) => {
    isScratching = true;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  }, { passive: true });

  canvas.addEventListener("touchmove", (e) => {
    if (!isScratching) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  }, { passive: true });

  canvas.addEventListener("touchend", () => {
    isScratching = false;
  });

  // Instant Reveal Button
  const btnInstantReveal = document.getElementById("btnInstantReveal");
  if (btnInstantReveal) {
    btnInstantReveal.addEventListener("click", revealCompletely);
  }

  window.addEventListener("resize", resizeCanvas);
  setTimeout(resizeCanvas, 300);
}

// ==========================================================================
// 5. LIVE COUNTDOWN TIMER (TO 16 NOVEMBER 2026, 11:30 AM)
// ==========================================================================
function initCountdownTimer() {
  const daysElem = document.getElementById("timerDays");
  const hoursElem = document.getElementById("timerHours");
  const minsElem = document.getElementById("timerMins");
  const secsElem = document.getElementById("timerSecs");
  const statusElem = document.getElementById("countdownStatus");

  // Wedding Ceremony Date: 16 November 2026 at 11:30 AM IST
  const targetDate = new Date("2026-11-16T11:30:00+05:30");

  function updateTimer() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (isNaN(diff) || diff <= 0) {
      if (daysElem) daysElem.textContent = "00";
      if (hoursElem) hoursElem.textContent = "00";
      if (minsElem) minsElem.textContent = "00";
      if (secsElem) secsElem.textContent = "00";
      if (statusElem) statusElem.textContent = "✨ Today is the Blessed Wedding Day! ✨";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (daysElem) daysElem.textContent = String(days).padStart(2, "0");
    if (hoursElem) hoursElem.textContent = String(hours).padStart(2, "0");
    if (minsElem) minsElem.textContent = String(mins).padStart(2, "0");
    if (secsElem) secsElem.textContent = String(secs).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ==========================================================================
// 6. FLOATING GOLD & EMERALD DUST PARTICLES
// ==========================================================================
function initParticles() {
  const canvas = document.getElementById("particlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const particleCount = 42;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 15;
      this.radius = Math.random() * 2 + 0.8;
      this.speedY = Math.random() * 0.45 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.isGold = Math.random() > 0.35;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;

      if (this.y < -15 || this.x < -15 || this.x > canvas.width + 15) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      let neonColor = "#10b981";
      if (currentTheme === "forest") neonColor = "#059669";
      else if (currentTheme === "olive") neonColor = "#84cc16";
      else if (currentTheme === "cypress") neonColor = "#14b8a6";
      else if (currentTheme === "malabar") neonColor = "#22c55e";

      ctx.fillStyle = this.isGold
        ? `rgba(223, 183, 70, ${this.opacity})`
        : neonColor;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.isGold ? "#dfb746" : neonColor;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  init();
  animate();
}

// ==========================================================================
// 7. PHOTO PREVIEW / REPLACEMENT ENGINE (BLANK SIDE DEFAULT)
// ==========================================================================
function initPhotoPreviewHandlers() {
  document.querySelectorAll(".photo-input-file").forEach(input => {
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const targetImgId = input.getAttribute("data-target");
      const placeholderId = input.getAttribute("data-placeholder");

      const imgElem = document.getElementById(targetImgId);
      const placeholderElem = document.getElementById(placeholderId);

      if (imgElem && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          imgElem.src = event.target.result;
          imgElem.style.display = "block";
          if (placeholderElem) {
            placeholderElem.style.display = "none";
          }
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

// RSVP Form removed as requested

// ==========================================================================
// 9. SHARE INVITATION ON WHATSAPP
// ==========================================================================
function initShareButton() {
  const btnShare = document.getElementById("btnShareWhatsApp");
  if (!btnShare) return;

  btnShare.addEventListener("click", () => {
    const text = `Assalamu Alaikum,\n\nYou are cordially invited to celebrate the auspicious wedding ceremony of *Salmanul Faris & Shamna Inna* on *Monday, 16 November 2026* (11:30 AM onwards) at *Nadhas Auditorium, Vaikathur, Valancheri*.\n\nView complete invitation, venue location & details here:\n${window.location.href}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  });
}

// ==========================================================================
// 10. GOOGLE CALENDAR LINK
// ==========================================================================
function updateCalendarLinks() {
  const btnAddToCal = document.getElementById("btnAddToCal");
  if (!btnAddToCal) return;

  const title = encodeURIComponent("Wedding Ceremony: Salmanul Faris & Shamna Inna");
  const details = encodeURIComponent("You are cordially invited to celebrate the wedding ceremony of Salmanul Faris & Shamna Inna at Nadhas Auditorium, Vaikathur, Valancheri.");
  const location = encodeURIComponent("Nadhas Auditorium, Vaikathur, Valanchery, Kerala 676552");
  
  // Date: 16 Nov 2026 from 11:30 AM to 03:00 PM IST (UTC 06:00 to 09:30)
  const calUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261116T060000Z/20261116T100000Z&details=${details}&location=${location}`;
  btnAddToCal.href = calUrl;
}
