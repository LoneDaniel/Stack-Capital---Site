const menu = document.querySelector('.menu');
const nav = document.querySelector('.site-header nav');
menu?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(Boolean(isOpen)));
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const demoForm = document.querySelector('.form');
if (demoForm && !demoForm.hasAttribute('action')) demoForm.addEventListener('submit', event => {
  event.preventDefault();
  alert('Thank you — your message has been captured. Connect this form to your preferred email or CRM service before launch.');
});
const intro = document.querySelector('.brand-intro');
if (intro) {
  const target = intro.dataset.introTarget;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    window.setTimeout(() => target ? window.location.replace(target) : intro.remove(), 0);
  } else {
    window.setTimeout(() => intro.classList.add('leaving'), 2500);
    window.setTimeout(() => target ? window.location.replace(target) : intro.remove(), 3300);
  }
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-grid';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  const cursor = { x: -1000, y: -1000, active: false };
  let particles = [];
  const buildGrid = () => {
    const count = window.innerWidth < 700 ? 42 : 96;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      homeX: Math.random() * window.innerWidth, homeY: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .42, vy: (Math.random() - .5) * .42,
      phase: Math.random() * Math.PI * 2
    }));
  };
  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = window.innerWidth * pixelRatio; canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0); buildGrid();
  };
  const draw = time => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(point => {
      const driftX = point.homeX + Math.cos(time / 2300 + point.phase) * 38;
      const driftY = point.homeY + Math.sin(time / 2900 + point.phase) * 32;
      point.vx += (driftX - point.x) * .0016; point.vy += (driftY - point.y) * .0016;
      const dx = point.x - cursor.x, dy = point.y - cursor.y, distance = Math.hypot(dx, dy) || 1;
      if (cursor.active && distance < 250) {
        const response = (1 - distance / 250) * .38;
        point.vx += (dx / distance) * response; point.vy += (dy / distance) * response;
      }
      point.vx *= .972; point.vy *= .972; point.x += point.vx; point.y += point.vy;
    });
    particles.forEach((point, index) => {
      for (let next = index + 1; next < particles.length; next++) {
        const neighbour = particles[next], gap = Math.hypot(point.x - neighbour.x, point.y - neighbour.y);
        if (gap < 155) {
          const alpha = .08 * (1 - gap / 155);
          context.strokeStyle = `rgba(251,80,43,${alpha})`; context.lineWidth = 1;
          context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(neighbour.x, neighbour.y); context.stroke();
        }
      }
      const near = cursor.active && Math.hypot(point.x - cursor.x, point.y - cursor.y) < 250;
      context.fillStyle = near ? 'rgba(251,80,43,.72)' : 'rgba(251,80,43,.28)';
      context.beginPath(); context.arc(point.x, point.y, near ? 2.1 : 1.25, 0, Math.PI * 2); context.fill();
    });
    if (cursor.active) {
      const pulse = 120 + Math.sin(time / 320) * 9;
      context.strokeStyle = 'rgba(251,80,43,.16)'; context.beginPath(); context.arc(cursor.x, cursor.y, pulse, 0, Math.PI * 2); context.stroke();
    }
    requestAnimationFrame(draw);
  };
  window.addEventListener('pointermove', event => { cursor.x = event.clientX; cursor.y = event.clientY; cursor.active = true; }, { passive: true });
  document.addEventListener('pointerleave', () => { cursor.active = false; });
  window.addEventListener('resize', resize, { passive: true });
  resize(); requestAnimationFrame(draw);
}
