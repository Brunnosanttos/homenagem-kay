const carouselInner = document.querySelector('.carousel-inner');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const images = document.querySelectorAll('.carousel-inner img');
const indicators = document.querySelectorAll('.carousel-indicators li');

let currentIndex = 0;
let autoSlideInterval;

// Função para atualizar o carrossel
const updateCarousel = () => {
  const width = carouselInner.offsetWidth;
  const offset = -currentIndex * width;
  carouselInner.style.transform = `translateX(${offset}px)`;

  // Atualiza os indicadores
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentIndex);
  });
};

// Eventos de clique
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel();
  restartAutoSlide();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel();
  restartAutoSlide();
});

// Suporte a clique nos indicadores
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    currentIndex = index;
    updateCarousel();
    restartAutoSlide();
  });
});

// Auto-slide
const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }, 4000);
};

const restartAutoSlide = () => {
  clearInterval(autoSlideInterval);
  startAutoSlide();
};

// Inicialização do carrossel
window.addEventListener('resize', updateCarousel);
updateCarousel();
startAutoSlide();

// --- CONTADOR ---
const dataInicial = new Date("2025-12-18T00:00:00");

function atualizarContador() {
  const agora = new Date();
  let diffMs = agora - dataInicial; // Diferença em milissegundos

  // Convertendo para uma nova data para calcular anos, meses e dias corretamente
  let dataTemp = new Date(dataInicial);
  
  let anos = agora.getFullYear() - dataInicial.getFullYear();
  let meses = agora.getMonth() - dataInicial.getMonth();
  let dias = agora.getDate() - dataInicial.getDate();

  // Ajuste de dias se necessário
  if (dias < 0) {
    dataTemp.setMonth(dataTemp.getMonth() + meses);
    let ultimoDiaMes = new Date(dataTemp.getFullYear(), dataTemp.getMonth() + 1, 0).getDate();
    dias += ultimoDiaMes;
    meses -= 1;
  }

  // Ajuste de meses se necessário
  if (meses < 0) {
    meses += 12;
    anos -= 1;
  }

  // Calcula o restante das horas, minutos e segundos com base na diferença total em milissegundos
  let horas = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  let segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

  // Atualiza os elementos na página
  document.getElementById("anos").textContent = String(anos).padStart(2, "0");
  document.getElementById("meses").textContent = String(meses).padStart(2, "0");
  document.getElementById("dias").textContent = String(dias).padStart(2, "0");
  document.getElementById("horas").textContent = String(horas).padStart(2, "0");
  document.getElementById("minutos").textContent = String(minutos).padStart(2, "0");
  document.getElementById("segundos").textContent = String(segundos).padStart(2, "0");
}

setInterval(atualizarContador, 1000);
atualizarContador();

// --- CORAÇÕES CAINDO ---
const emojis = ["❤️", "💖", "✨", "💕", "🌸"];
const limiteEmojis = 15;
let emojisAtivos = 0;

function criarEmoji() {
  if (emojisAtivos >= limiteEmojis) return;

  const emoji = document.createElement("div");
  emoji.classList.add("emoji");
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  
  const size = Math.random() * 20 + 15; // 15px a 35px
  emoji.style.fontSize = `${size}px`;
  emoji.style.left = Math.random() * 100 + "vw";
  emoji.style.animationDuration = Math.random() * 3 + 4 + "s"; // 4s a 7s
  emoji.style.opacity = Math.random() * 0.5 + 0.5;
  
  document.body.appendChild(emoji);
  emojisAtivos++;

  emoji.addEventListener("animationend", () => {
    emoji.remove();
    emojisAtivos--;
  });
}

setInterval(criarEmoji, 500);