import './ui.css';

export default function Button({
  variant = 'ghost',
  size,
  onClick,
  disabled,
  icon,
  children,
  style,
  title,
  block,
}) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : ''].filter(Boolean).join(' ');

  return (
    <button
      className={cls}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ width: block ? '100%' : undefined, ...style }}
    >
      {icon}
      {children}
    </button>
  );
}
