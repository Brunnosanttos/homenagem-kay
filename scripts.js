// --- CARROSSEL ---
const carousel = document.querySelector('.carousel');
const carouselInner = document.querySelector('.carousel-inner');
const indicatorsList = document.querySelector('.carousel-indicators');

// Envolve cada <img> num slide com fundo desfocado, assim basta adicionar/remover <img> no HTML
let slides = [...carouselInner.querySelectorAll('img')].map((img) => {
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.style.setProperty('--foto', `url("${img.getAttribute('src')}")`);
  img.replaceWith(slide);
  slide.appendChild(img);
  // Foto que não carregar sai do carrossel em vez de aparecer quebrada
  img.addEventListener('error', () => removerSlide(slide));
  return slide;
});

const removerSlide = (slide) => {
  if (!slides.includes(slide)) return;
  slide.remove();
  slides = slides.filter((s) => s !== slide);
  criarIndicadores();
  irPara(Math.min(currentIndex, slides.length - 1));
};

let indicators = [];
const criarIndicadores = () => {
  indicatorsList.innerHTML = '';
  indicators = slides.map((_, index) => {
    const li = document.createElement('li');
    li.addEventListener('click', () => irPara(index));
    indicatorsList.appendChild(li);
    return li;
  });
};

let currentIndex = 0;
let autoSlideInterval;

// Usa porcentagem em vez de pixels: não quebra ao girar o celular ou redimensionar
const updateCarousel = () => {
  carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentIndex);
  });
};

const irPara = (index) => {
  currentIndex = (index + slides.length) % slides.length;
  updateCarousel();
  restartAutoSlide();
};

document.querySelector('.prev').addEventListener('click', () => irPara(currentIndex - 1));
document.querySelector('.next').addEventListener('click', () => irPara(currentIndex + 1));

// Arrastar com o dedo
let inicioX = null;
carousel.addEventListener('touchstart', (e) => { inicioX = e.touches[0].clientX; }, { passive: true });
carousel.addEventListener('touchend', (e) => {
  if (inicioX === null) return;
  const distancia = e.changedTouches[0].clientX - inicioX;
  if (Math.abs(distancia) > 40) irPara(currentIndex + (distancia < 0 ? 1 : -1));
  inicioX = null;
});

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 5000);
};

const restartAutoSlide = () => {
  clearInterval(autoSlideInterval);
  startAutoSlide();
};

// Para de girar quando a aba fica em segundo plano (evita "pulos" ao voltar)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearInterval(autoSlideInterval);
  else restartAutoSlide();
});

criarIndicadores();
updateCarousel();
startAutoSlide();

// Fotos que já falharam antes do script rodar
slides
  .filter((slide) => { const img = slide.querySelector('img'); return img.complete && img.naturalWidth === 0; })
  .forEach(removerSlide);

// --- CONTADOR ---
const dataInicial = new Date("2025-12-18T00:00:00");

// Tempo que ficamos separados: não conta, é como se o relógio tivesse pausado
const pausas = [
  { inicio: new Date("2026-08-28T00:00:00"), fim: new Date("2026-10-24T00:00:00") },
];

const DIA = 1000 * 60 * 60 * 24;

function tempoPausado(agora) {
  return pausas.reduce((total, { inicio, fim }) => {
    const fimEfetivo = Math.min(agora, fim);
    return total + Math.max(0, fimEfetivo - inicio);
  }, 0);
}

function atualizarContador() {
  const agora = new Date();
  const diffMs = Math.max(0, agora - dataInicial - tempoPausado(agora));

  // Data de início "deslocada" pela pausa, para calcular anos/meses/dias no calendário
  const inicio = new Date(agora - diffMs);

  let anos = agora.getFullYear() - inicio.getFullYear();
  let meses = agora.getMonth() - inicio.getMonth();
  let dias = agora.getDate() - inicio.getDate();

  if (agora.getHours() * 3600 + agora.getMinutes() * 60 + agora.getSeconds() <
      inicio.getHours() * 3600 + inicio.getMinutes() * 60 + inicio.getSeconds()) {
    dias -= 1;
  }

  if (dias < 0) {
    dias += new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
    meses -= 1;
  }

  if (meses < 0) {
    meses += 12;
    anos -= 1;
  }

  const horas = Math.floor((diffMs % DIA) / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

  document.getElementById("anos").textContent = String(anos).padStart(2, "0");
  document.getElementById("meses").textContent = String(meses).padStart(2, "0");
  document.getElementById("dias").textContent = String(dias).padStart(2, "0");
  document.getElementById("horas").textContent = String(horas).padStart(2, "0");
  document.getElementById("minutos").textContent = String(minutos).padStart(2, "0");
  document.getElementById("segundos").textContent = String(segundos).padStart(2, "0");
  document.getElementById("total-dias").textContent = Math.floor(diffMs / DIA);
}

setInterval(atualizarContador, 1000);
atualizarContador();

// --- EASTER EGG: CORAÇÃO QUE ABRE A CARTA ---
document.querySelector('.coracao').addEventListener('click', (e) => {
  e.preventDefault();
  const destino = e.currentTarget.href;
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

  // Explosão de corações saindo do coração tocado
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'explosao';
    p.textContent = ['❤️', '💖', '💕'][i % 3];
    const angulo = (i / 18) * Math.PI * 2;
    const raio = 80 + Math.random() * 80;
    p.style.left = `${left + width / 2 - 10}px`;
    p.style.top = `${top + height / 2 - 10}px`;
    p.style.setProperty('--dx', `${Math.cos(angulo) * raio}px`);
    p.style.setProperty('--dy', `${Math.sin(angulo) * raio}px`);
    document.documentElement.appendChild(p);
  }

  setTimeout(() => document.body.classList.add('saindo'), 400);
  setTimeout(() => { window.location.href = destino; }, 1300);
});

// --- CORAÇÕES CAINDO ---
const emojis = ["❤️", "💖", "💕", "🌸", "✨"];
const limiteEmojis = 12;
let emojisAtivos = 0;

function criarEmoji() {
  if (emojisAtivos >= limiteEmojis || document.hidden) return;

  const emoji = document.createElement("div");
  emoji.classList.add("emoji");
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.style.fontSize = `${Math.random() * 16 + 12}px`;
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.animationDuration = Math.random() * 4 + 6 + "s";
  emoji.style.opacity = Math.random() * 0.4 + 0.3;

  document.body.appendChild(emoji);
  emojisAtivos++;

  emoji.addEventListener("animationend", () => {
    emoji.remove();
    emojisAtivos--;
  });
}

setInterval(criarEmoji, 700);
