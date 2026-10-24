/**
 * Wedding Invitation Interactive Engine - Reel Design
 * Salmanul Faris & Shamna Inna
 * Nadhas Auditorium, Vaikathur, Valancheri
 */

// Wedding Configuration
const WEDDING_CONFIG = {
  groomName: "Salmanul Faris",
  groomParents: "Mr. Mohammed & Mrs. Sakkeena Mohammed",
  groomAddress: "Valiya Parambil Kizhakethil house, Pookattiri, Valancheri",
  groomPhone: "+91 9846507386",
  brideName: "Shamna Inna",
  brideParents: "Mr. Shamsudheen & Mrs. Soudath Shamsudheen",
  brideAddress: "Alungal House, Veliyamcode, Ponnani",
  weddingDate: "2026-11-16",
  weddingTime: "11:30 AM",
  weddingDateTimeISO: "2026-11-16T11:30:00+05:30",
  hijriDate: "1448 Ja: Akhir 6",
  venueName: "Nadhas Auditorium",
  venueCity: "Vaikathur, Valancheri",
  venueAddress: "Nadhas Auditorium & Convention Centre, Vaikathur, Valanchery, Malappuram District, Kerala - 676552",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Nadhas+Auditorium+Valanchery+Kerala"
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-theme", "ivory");
  initEnvelopeReveal();
  initAudioControls();
  initCountdownTimer();
  initCalendarLink();
  initWhatsAppShare();
  initParticles();
  initScrollIndicator();
});

const currentParticleRgb = "197, 160, 89";

// ==========================================================================
// 1. 3D LUXURY ENVELOPE OPENING & REPLAY
// ==========================================================================
function initEnvelopeReveal() {
  const envelopeOverlay = document.getElementById("envelopeOverlay");
  const envelopeWrapper = document.getElementById("envelopeWrapper");
  const btnWaxSeal = document.getElementById("btnWaxSeal");
  const btnTapSealText = document.getElementById("btnTapSealText");
  const btnReplayEnvelope = document.getElementById("btnReplayEnvelope");

  if (!envelopeOverlay || !envelopeWrapper) return;

  let isOpening = false;

  function openEnvelope() {
    if (isOpening) return;
    isOpening = true;

    // Start background music seamlessly on user tap
    startWeddingAudio();

    // Trigger flap open and card slide-up
    envelopeWrapper.classList.add("is-opening");

    // Smoothly dissolve overlay and show website
    setTimeout(() => {
      envelopeOverlay.classList.add("opened");
      document.body.style.overflow = "auto";
    }, 1150);
  }

  if (btnWaxSeal) btnWaxSeal.addEventListener("click", openEnvelope);
  if (envelopeWrapper) envelopeWrapper.addEventListener("click", openEnvelope);
  if (btnTapSealText) btnTapSealText.addEventListener("click", openEnvelope);

  // Replay Envelope from footer
  if (btnReplayEnvelope) {
    btnReplayEnvelope.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      envelopeOverlay.classList.remove("opened");
      envelopeWrapper.classList.remove("is-opening");
      isOpening = false;
      document.body.style.overflow = "hidden";
    });
  }
}

// ==========================================================================
// 2. BACKGROUND MUSIC CONTROLS (Hob A3ma)
// ==========================================================================
let audioPlaying = false;

function startWeddingAudio() {
  const audio = document.getElementById("weddingAudio");
  const btnToggle = document.getElementById("btnToggleMusic");

  if (!audio) return;

  audio.volume = 0.8;
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        audioPlaying = true;
        if (btnToggle) btnToggle.classList.add("is-playing");
      })
      .catch(() => {
        // Autoplay may be restricted until another user tap
        audioPlaying = false;
        if (btnToggle) btnToggle.classList.remove("is-playing");
      });
  }
}

function initAudioControls() {
  const audio = document.getElementById("weddingAudio");
  const btnToggle = document.getElementById("btnToggleMusic");

  if (!audio || !btnToggle) return;

  btnToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play().then(() => {
        audioPlaying = true;
        btnToggle.classList.add("is-playing");
      }).catch(err => console.log("Audio play error:", err));
    } else {
      audio.pause();
      audioPlaying = false;
      btnToggle.classList.remove("is-playing");
    }
  });

  audio.addEventListener("play", () => {
    audioPlaying = true;
    btnToggle.classList.add("is-playing");
  });

  audio.addEventListener("pause", () => {
    audioPlaying = false;
    btnToggle.classList.remove("is-playing");
  });
}

// ==========================================================================
// 3. LIVE RADIAL COUNTDOWN TIMER (MATCHING REEL FRAME 7)
// ==========================================================================
function initCountdownTimer() {
  const daysEl = document.getElementById("timerDays");
  const hoursEl = document.getElementById("timerHours");
  const minsEl = document.getElementById("timerMins");
  const secsEl = document.getElementById("timerSecs");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const targetDate = new Date("2026-11-16T11:30:00+05:30").getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 4. ADD TO CALENDAR (GOOGLE CALENDAR SYNC)
// ==========================================================================
function initCalendarLink() {
  const btnCal = document.getElementById("btnCalendarDirect");
  if (!btnCal) return;

  // Monday, 16 Nov 2026, 11:30 AM to 03:30 PM IST (06:00 UTC to 10:00 UTC)
  const title = encodeURIComponent("Wedding Ceremony: Salmanul Faris & Shamna Inna");
  const location = encodeURIComponent("Nadhas Auditorium & Convention Centre, Vaikathur, Valancheri, Kerala");
  const details = encodeURIComponent(
    "You are cordially invited to celebrate the auspicious wedding ceremony of Salmanul Faris & Shamna Inna at Nadhas Auditorium, Valancheri.\nTime: 11:30 AM onwards.\nContact: +91 9846507386"
  );
  const dates = "20261116T060000Z/20261116T100000Z";

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  btnCal.setAttribute("href", gcalUrl);
}

// ==========================================================================
// 5. WHATSAPP INVITATION SHARE
// ==========================================================================
function initWhatsAppShare() {
  const btnShare = document.getElementById("btnShareWhatsApp");
  if (!btnShare) return;

  btnShare.addEventListener("click", () => {
    const text = 
      "✨ *Wedding Invitation: Salmanul Faris & Shamna Inna* ✨\n\n" +
      "We cordially invite you with family to grace the wedding ceremony of our beloved son *Salmanul Faris* with *Shamna Inna*.\n\n" +
      "📅 *Date:* Monday, 16 November 2026 (11:30 AM onwards)\n" +
      "📍 *Venue:* Nadhas Auditorium, Vaikathur, Valancheri\n\n" +
      "Open digital invitation & directions:\n" +
      window.location.href;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  });
}

// ==========================================================================
// 6. SCROLL INDICATOR
// ==========================================================================
function initScrollIndicator() {
  const indicator = document.getElementById("scrollIndicator");
  if (!indicator) return;

  indicator.addEventListener("click", () => {
    const detailsSection = document.getElementById("invitationDetails");
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ==========================================================================
// 7. AMBIENT PARTICLES (CANVAS)
// ==========================================================================
function initParticles() {
  const canvas = document.getElementById("particlesCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  const count = window.innerWidth < 768 ? 25 : 55;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * 0.6 + 0.2,
      fadeSpeed: Math.random() * 0.01 + 0.005
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.fadeSpeed;

      if (p.alpha > 0.75 || p.alpha < 0.15) {
        p.fadeSpeed = -p.fadeSpeed;
      }

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${currentParticleRgb}, ${p.alpha * 0.45})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${currentParticleRgb}, 0.4)`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  loop();
}
