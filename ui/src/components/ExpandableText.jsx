import { useState, useRef, useLayoutEffect } from 'react';
import './ui.css';

export default function ExpandableText({ children, rows = 2, style }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const spanRef = useRef(null);

  useLayoutEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  return (
    <p style={{ margin: 0, ...style }}>
      <span
        ref={spanRef}
        style={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: rows,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
      >
        {children}
      </span>
      {!expanded && overflows && (
        <button className="expandable-more" onClick={() => setExpanded(true)}>
          {' '}
          more
        </button>
      )}
    </p>
  );
}
