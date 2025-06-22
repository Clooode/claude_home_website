

const container = document.querySelector('.dandelion-scene');
const makeWishBtn = document.getElementById('make-a-wish');

makeWishBtn.addEventListener('click', () => {
  document.querySelector('.dandelion.full').style.opacity = 0;
  document.querySelector('.dandelion.empty').style.opacity = 1;

  // Remove any previous fluff if re-clicking
  container.querySelectorAll('.seed-fluff').forEach(el => el.remove());

  // Create fluff elements
  for (let i = 0; i < 80; i++) {

        const fluff = document.createElement('div');
    fluff.classList.add('seed-fluff');

    const pastelColors = [
  'rgba(250, 235, 255, 0.7)',
  'rgba(231, 240, 248, 0.7)',
  'rgba(247, 242, 224, 0.7)',
  'rgba(232, 252, 227, 0.7)'
];

fluff.style.background = pastelColors[Math.floor(Math.random() * pastelColors.length)];




    const angle = Math.random() * 2 * Math.PI;
    const distance = 100 + Math.random() * 100;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    fluff.style.left = `${50 + (Math.random() - 0.5) * 40}%`;
    fluff.style.top = `${Math.random() * 40 + 120}px`;
    fluff.style.setProperty('--dx', `${x}px`);
    fluff.style.setProperty('--dy', `${y}px`);
const baseDelay = 200; // slight pause before explosion
const randomOffset = Math.random() * 300; // 0–300ms range

fluff.style.animationDelay = `${baseDelay + randomOffset}ms`;




    // Trigger poof animation
    fluff.classList.add('poof');
    container.appendChild(fluff);
  }
});
