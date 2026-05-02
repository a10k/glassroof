export function MapPinSVG() {
  return (
    <svg width="40" height="50" viewBox="0 0 40 50" className="map-pin-svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Grey pointer triangle */}
      <path d="M 20 50 L 10 35 L 30 35 Z" fill="#999999" filter="url(#shadow)" />
      {/* Red circle */}
      <circle cx="20" cy="20" r="14" fill="#ff4d4f" stroke="#fff" strokeWidth="2" filter="url(#shadow)" />
    </svg>
  );
}
