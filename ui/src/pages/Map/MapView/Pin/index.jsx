function pinSvg(color, opacity) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="36" viewBox="0 0 32 36" style="opacity:${opacity}">
    <path d="M16 2C9.373 2 4 7.373 4 14c0 9 12 22 12 22S28 23 28 14C28 7.373 22.627 2 16 2z" fill="${color}"/>
    <circle cx="16" cy="14" r="4.5" fill="white"/>
  </svg>`;
}

function buildElement(color, opacity = 1) {
  const el = document.createElement('div');
  el.style.cursor = 'pointer';
  el.innerHTML = pinSvg(color, opacity);
  return el;
}

export function createPinElement() {
  return buildElement('#ff4d4f');
}

export function createTempPinElement() {
  return buildElement('#129865', 0.85);
}
