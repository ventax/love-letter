/* ===========================
   SCRIPT v2 — CHITATO LOVE SITE
   Sound FX • Animations • Magic
   =========================== */

'use strict';

// ======================================================
// 1. WEB AUDIO — SOUND ENGINE (no external files needed)
// ======================================================
const Audio = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function playTone({ freq = 440, type = 'sine', dur = 0.3, vol = 0.3, ramp = true, delay = 0 } = {}) {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
      gain.gain.setValueAtTime(0, ac.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, ac.currentTime + delay + 0.02);
      if (ramp) gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + dur);
      osc.start(ac.currentTime + delay);
      osc.stop(ac.currentTime + delay + dur + 0.05);
    } catch(e) {}
  }

  function playChord(freqs, opts = {}) {
    freqs.forEach((freq, i) => playTone({ freq, ...opts, delay: (opts.delay || 0) + i * 0.05 }));
  }

  return {
    // Cute "meow-like" pop — for photo open
    meow() {
      playTone({ freq: 800, type: 'sine', dur: 0.15, vol: 0.25 });
      setTimeout(() => playTone({ freq: 650, type: 'sine', dur: 0.25, vol: 0.2 }), 100);
    },

    // Magic sparkle — for cursor/click
    sparkle() {
      [1047, 1319, 1568].forEach((f, i) => {
        playTone({ freq: f, type: 'sine', dur: 0.2, vol: 0.15, delay: i * 0.04 });
      });
    },

    // Photo upload success — happy chime
    success() {
      const melody = [523, 659, 784, 1047];
      melody.forEach((f, i) => {
        playTone({ freq: f, type: 'triangle', dur: 0.3, vol: 0.2, delay: i * 0.12 });
      });
    },

    // Wax seal stamp — deep pop
    stamp() {
      playTone({ freq: 180, type: 'sine', dur: 0.3, vol: 0.35 });
      playTone({ freq: 90, type: 'sine', dur: 0.5, vol: 0.2 });
    },

    // Button hover — soft ping
    ping() {
      playTone({ freq: 880, type: 'sine', dur: 0.1, vol: 0.1 });
    },

    // Confetti explosion — party!
    confetti() {
      const melody = [523, 659, 784, 880, 1047, 1175, 1319];
      melody.forEach((f, i) => {
        playTone({ freq: f, type: 'triangle', dur: 0.25, vol: 0.18, delay: i * 0.08 });
        playTone({ freq: f * 1.5, type: 'sine', dur: 0.2, vol: 0.08, delay: i * 0.08 + 0.03 });
      });
    },

    // Love meter fill
    meterBeep() {
      playTone({ freq: 440, type: 'sine', dur: 0.1, vol: 0.12 });
    },

    // Hover on quote card
    cardHover() {
      playTone({ freq: 660, type: 'sine', dur: 0.08, vol: 0.08 });
    },

    // Letter open
    letterOpen() {
      [440, 554, 659].forEach((f, i) => {
        playTone({ freq: f, type: 'triangle', dur: 0.35, vol: 0.15, delay: i * 0.1 });
      });
    },
  };
})();

// ======================================================
// 2. CUSTOM CURSOR
// ======================================================
(function initCursor() {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Hover effect
  document.querySelectorAll('a,button,.gallery-item,.quote-card,.reason-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

// ======================================================
// 3. FLOATING PARTICLES
// ======================================================
(function initParticles() {
  const container = document.getElementById('particles');
  const emojis = ['💛','🐾','🌻','🌸','✨','🐱','🌼','💫','🎀'];
  const count = 22;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const size = Math.random() * 1.1 + 0.7;
    p.style.cssText = `
      left:${Math.random() * 100}%;
      font-size:${size}rem;
      animation-duration:${Math.random() * 12 + 10}s;
      animation-delay:${Math.random() * 15}s;
    `;
    container.appendChild(p);
  }
})();

// ======================================================
// 4. CLICK SPARKLES (global)
// ======================================================
(function initClickSparkles() {
  const layer = document.getElementById('sparkle-layer');
  const emojis = ['💛','🐾','🌸','✨','🐱'];

  document.addEventListener('click', e => {
    Audio.sparkle();
    for (let i = 0; i < 4; i++) {
      const s = document.createElement('div');
      s.className = 'click-sparkle';
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (Math.random() * 360) * Math.PI / 180;
      const dist = Math.random() * 50 + 20;
      s.style.cssText = `
        left:${e.clientX}px;
        top:${e.clientY}px;
        animation-delay:${i * 0.06}s;
        transform:translate(-50%,-50%) translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px);
      `;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
    }
  });
})();

// ======================================================
// 5. TYPEWRITER HERO
// ======================================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  const lines = [
    'Dari seseorang yang mencintaimu sepenuh hati 💛',
    'Kamu adalah kuning hangat di hidupku ☀️',
    'Yang paling aku sayang, selamanya 🐾',
  ];
  let lineIdx = 0, charIdx = 0, deleting = false;

  el.innerHTML = '<span class="typewriter-cursor"></span>';

  function type() {
    const txt = lines[lineIdx];
    if (!deleting) {
      charIdx++;
      el.innerHTML = txt.slice(0, charIdx) + '<span class="typewriter-cursor"></span>';
      if (charIdx === txt.length) {
        deleting = true;
        setTimeout(type, 2500);
        return;
      }
      setTimeout(type, 55);
    } else {
      charIdx--;
      el.innerHTML = txt.slice(0, charIdx) + '<span class="typewriter-cursor"></span>';
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30);
    }
  }
  setTimeout(type, 1000);
})();

// ======================================================
// 6. LOVE METER
// ======================================================
(function initMeter() {
  const fill   = document.getElementById('meter-fill');
  const label  = document.getElementById('meter-label');
  if (!fill) return;

  let current = 0;
  const target = 9999; // infinite love
  let displayed = 0;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      obs.disconnect();
      runMeter();
    }
  }, { threshold: 0.5 });
  obs.observe(document.getElementById('meter'));

  function runMeter() {
    // Animate bar to 100%
    setTimeout(() => {
      fill.style.width = '100%';
    }, 200);

    // Count up label
    let n = 0;
    const step = () => {
      n = Math.min(n + 1, 100);
      label.textContent = n + '%';
      if (n < 100) {
        Audio.meterBeep();
        setTimeout(step, 22);
      } else {
        label.textContent = '∞';
        label.style.fontSize = '1.4rem';
      }
    };
    setTimeout(step, 300);
  }
})();

// ======================================================
// 7. HERO BUTTON + WAXSEAL SOUND
// ======================================================
document.getElementById('open-letter-btn').addEventListener('click', e => {
  e.preventDefault();
  Audio.letterOpen();
  setTimeout(() => {
    document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
  }, 150);
});

const waxSeal = document.getElementById('wax-seal');
if (waxSeal) {
  waxSeal.addEventListener('click', () => {
    Audio.stamp();
    waxSeal.animate([
      { transform: 'translateX(-50%) scale(1)' },
      { transform: 'translateX(-50%) scale(1.3) rotate(15deg)' },
      { transform: 'translateX(-50%) scale(1)' },
    ], { duration: 400, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  });
}

// ======================================================
// 8. QUOTE CARD HOVER SOUND
// ======================================================
document.querySelectorAll('.quote-card').forEach(card => {
  card.addEventListener('mouseenter', () => Audio.cardHover());
});

// ======================================================
// 9. PHOTO GALLERY — Upload + Lightbox + Sound
// ======================================================
(function initGallery() {
  const items    = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightbox-backdrop');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');

  // Caption texts
  const captions = {
    1: 'Chitato dan kucing — kombinasi terfavorit di dunia 🐾',
    2: 'Cantik seperti bunga matahari ✨',
    3: 'Senyummu yang selalu kukangenin 💞',
    4: 'Waktu paling berharga — bersamamu 💛',
    5: 'Lucu banget, seperti biasanya 🥰',
    6: 'Setiap momen bersamamu selalu spesial ✨',
  };

  // Per-item: store uploaded image src
  const photos = {};

  items.forEach(item => {
    const idx = item.dataset.index;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    item.appendChild(fileInput);

    item.addEventListener('click', () => {
      if (photos[idx]) {
        // Has photo → open lightbox
        openLightbox(photos[idx], captions[idx]);
      } else {
        // No photo → trigger upload
        Audio.meow();
        fileInput.click();
      }
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') item.click();
    });

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        photos[idx] = e.target.result;

        // Update placeholder with image
        const placeholder = item.querySelector('.photo-placeholder');
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Foto Chitato';
        img.style.cssText = `
          width:100%;height:100%;
          object-fit:cover;border-radius:14px;display:block;
        `;
        placeholder.innerHTML = '';
        placeholder.appendChild(img);
        placeholder.style.border = 'none';
        placeholder.style.background = 'transparent';
        item.classList.add('has-photo');

        // Sound + celebration
        Audio.success();
        showToast('Foto Chitato berhasil ditambahkan! 💛🐾');
        burstSparkles(item);
      };
      reader.readAsDataURL(file);
    });
  });

  // Open lightbox
  function openLightbox(src, caption) {
    Audio.meow();
    lbImg.src = src;
    lbCap.textContent = caption || '';
    lightbox.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Sparkle inside lightbox on open
    burstSparklesAt(window.innerWidth / 2, window.innerHeight / 2);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ======================================================
// 10. CONFETTI CELEBRATION
// ======================================================
function launchConfetti(count = 60) {
  Audio.confetti();
  const emojis = ['💛','🐾','🌸','✨','🐱','🎉','🌻','🌼','💫'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.cssText = `
      left:${Math.random() * 100}vw;
      top:-50px;
      font-size:${Math.random() * 1.5 + 1}rem;
      animation-duration:${Math.random() * 2.5 + 2}s;
      animation-delay:${Math.random() * 1.5}s;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5000);
  }
}

const confettiBtn = document.getElementById('final-confetti-btn');
if (confettiBtn) {
  confettiBtn.addEventListener('click', () => {
    launchConfetti(80);
    confettiBtn.textContent = '🎊 Yeay! Chitato terbaik! 💛';
    confettiBtn.disabled = true;
    setTimeout(() => {
      confettiBtn.textContent = '🎉 Tekan lagi!';
      confettiBtn.disabled = false;
    }, 3500);
  });
}

// ======================================================
// 11. BURST SPARKLES ON ELEMENT
// ======================================================
function burstSparkles(el) {
  const rect = el.getBoundingClientRect();
  burstSparklesAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
}
function burstSparklesAt(x, y) {
  const emojis = ['💛','🌸','✨','🐾','🌻'];
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'click-sparkle';
    const angle = (i / 8) * Math.PI * 2;
    const dist = Math.random() * 60 + 30;
    s.textContent = emojis[i % emojis.length];
    s.style.cssText = `
      left:${x + Math.cos(angle) * dist}px;
      top:${y + Math.sin(angle) * dist}px;
      animation-delay:${i * 0.04}s;
    `;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}

// ======================================================
// 12. TOAST NOTIFICATION
// ======================================================
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ======================================================
// 13. SCROLL REVEAL
// ======================================================
(function initScrollReveal() {
  const fadeEls = document.querySelectorAll(
    '.quote-card, .gallery-item, .letter-paper, .final-content, .meter-inner'
  );
  const slideEls = document.querySelectorAll('.reason-item');

  fadeEls.forEach(el => el.classList.add('fade-in'));
  slideEls.forEach(el => el.classList.add('slide-left'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  [...fadeEls, ...slideEls].forEach(el => observer.observe(el));
})();

// ======================================================
// 14. TILT EFFECT ON QUOTE CARDS
// ======================================================
(function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        perspective(600px)
        rotateY(${x * 12}deg)
        rotateX(${-y * 12}deg)
        translateY(-10px) scale(1.03)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ======================================================
// 15. HERO BUTTON SOUND + REASON ITEM HOVER
// ======================================================
document.querySelectorAll('.hero-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => Audio.ping());
});
document.querySelectorAll('.reason-item').forEach(item => {
  item.addEventListener('mouseenter', () => Audio.ping());
});

// ======================================================
// 16. MOUSE TRAIL (lighter version)
// ======================================================
(function initTrail() {
  let last = 0;
  const emojis = ['💛', '🐾'];
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - last < 200) return;
    last = now;
    const t = document.createElement('span');
    t.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    t.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      pointer-events:none;font-size:1rem;z-index:99993;
      transform:translate(-50%,-50%);
      animation:sparklePop .6s ease forwards;
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 700);
  });
})();

// ======================================================
// 17. FINAL FIREWORKS ON SCROLL INTO VIEW
// ======================================================
(function initFinalFireworks() {
  const section = document.getElementById('final');
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      setTimeout(() => launchConfetti(40), 600);
    }
  }, { threshold: 0.4 });
  obs.observe(section);
})();

// ======================================================
// CONSOLE LOVE NOTE
// ======================================================
console.log('%c💛🐾 Dibuat untuk Chitato (Yellota Chitato Sipanda) 🐾💛', 'color:#f5c518;font-size:1.2rem;font-weight:bold;');
