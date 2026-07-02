// Small Indian tricolour with the Ashoka Chakra, used in the footer tagline.
// The waving motion is a continuous, gentle cloth-wave driven by CSS
// (see .weha-flag in index.css). Kept always-on as a decorative brand touch,
// matching how the WeHA logo animation is intentionally always-on.
export default function IndiaFlag({ className = "" }) {
  const cx = 18;
  const cy = 12;
  const r = 4.4;
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    return { x2: cx + r * Math.cos(a), y2: cy + r * Math.sin(a) };
  });

  return (
    <span className={`weha-flag ${className}`} aria-hidden="true">
      <svg
        width="26"
        height="17"
        viewBox="0 0 36 24"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <rect x="0" y="0" width="36" height="8" fill="#FF9933" />
        <rect x="0" y="8" width="36" height="8" fill="#FFFFFF" />
        <rect x="0" y="16" width="36" height="8" fill="#138808" />
        <g stroke="#000080" strokeWidth="0.32" fill="none">
          <circle cx={cx} cy={cy} r={r} strokeWidth="0.55" />
          {spokes.map((s, i) => (
            <line key={i} x1={cx} y1={cy} x2={s.x2} y2={s.y2} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r="0.85" fill="#000080" />
        <rect
          x="0.25"
          y="0.25"
          width="35.5"
          height="23.5"
          fill="none"
          stroke="rgba(0,0,0,0.14)"
          strokeWidth="0.5"
        />
      </svg>
    </span>
  );
}
