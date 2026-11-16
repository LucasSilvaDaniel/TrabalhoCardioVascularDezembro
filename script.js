const TOTAL = 28;

// Link do vídeo do slide do Cateterismo (abre em nova aba). Abre o vídeo em uma nova aba.
const VIDEO_URL = 'video.html';
const VIDEO_SLIDE = 27;

const stage = document.getElementById('stage');
const counter = document.getElementById('counter');
const bar = document.getElementById('bar');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const videoHit = document.getElementById('videoHit');

const pad = n => String(n).padStart(2, '0');
const slides = [null];
let current = 0;

// Cria todos os slides de uma vez e já decodifica as imagens,
// assim a troca depois é só ligar/desligar a visibilidade (instantâneo).
for (let i = 1; i <= TOTAL; i++) {
  const img = new Image();
  img.className = 'slide';
  img.alt = `Slide ${i} de ${TOTAL}`;
  img.draggable = false;
  img.decoding = 'sync';
  img.src = `slides/slide-${pad(i)}.webp`;
  stage.appendChild(img);
  slides.push(img);
}
slides.forEach(img => { if (img && img.decode) img.decode().catch(() => {}); });

function show(n) {
  n = Math.max(1, Math.min(TOTAL, n));
  if (n === current) return;
  if (current) slides[current].classList.remove('is-active');
  slides[n].classList.add('is-active');
  current = n;

  counter.textContent = `${pad(n)} / ${TOTAL}`;
  bar.style.width = `${(n / TOTAL) * 100}%`;
  prevBtn.disabled = n === 1;
  nextBtn.disabled = n === TOTAL;

  const hasVideo = VIDEO_URL && n === VIDEO_SLIDE;
  videoHit.classList.toggle('show', !!hasVideo);
  if (hasVideo) videoHit.href = VIDEO_URL;
}

const next = () => show(current + 1);
const prev = () => show(current - 1);

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
  else if (e.key === 'Home') show(1);
  else if (e.key === 'End') show(TOTAL);
  else if (e.key === 'f' || e.key === 'F') toggleFull();
});

// Gestos no celular
let startX = 0, startY = 0;
document.addEventListener('touchstart', e => {
  startX = e.changedTouches[0].clientX; startY = e.changedTouches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
}, { passive: true });

function toggleFull() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.();
}
document.getElementById('full').addEventListener('click', toggleFull);

show(1);
