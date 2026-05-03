export function markdownToHtml(md) {
  return md.split('\n').reduce((html, line) => {
    const t = line.trim();
    if (!t) return html;

    const inlined = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    if (t.startsWith('## ')) return html + `<h2>${inlined.slice(3)}</h2>`;
    if (t.startsWith('### ')) return html + `<h3>${inlined.slice(4)}</h3>`;
    return html + `<p>${inlined}</p>`;
  }, '');
}
