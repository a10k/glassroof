import { renderToStaticMarkup } from 'react-dom/server';
import { EnvironmentFilled } from '@ant-design/icons';

function buildElement(color, opacity = 1) {
  const el = document.createElement('div');
  el.style.cursor = 'pointer';
  el.style.opacity = opacity;
  el.innerHTML = renderToStaticMarkup(<EnvironmentFilled style={{ fontSize: 36, color }} />);
  return el;
}

export function createPinElement() {
  return buildElement('#ff4d4f');
}

export function createTempPinElement() {
  return buildElement('#1677ff', 0.8);
}
