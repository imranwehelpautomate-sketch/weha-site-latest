// Small Indian tricolour with the Ashoka Chakra, used in the footer tagline.
//
// The waving is a natural cloth-in-wind ripple produced by an animated SVG
// filter (feTurbulence -> feDisplacementMap): the turbulence pattern shifts over
// time, so the flag surface genuinely ripples rather than rigidly rotating.
// A very subtle CSS sway (see .weha-flag in index.css) adds the overall billow.
// Kept always-on as a decorative brand touch, like the WeHA logo animation.
export default function IndiaFlag({ className = "" }) {
  const cx = 18;
  const cy = 12;
  const r = 4.4;
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    return { x2: cx + r * Math.cos(a), y2: cy + r * Math.sin(a) };
  });
  const fid = "weha-flag-ripple";

  return (
    <span className={`weha-flag ${className}`} aria-hidden="true">
      <svg
        width="28"
        height="19"
        viewBox="0 0 36 24"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          <filter id={fid} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.016 0.045"
              numOctaves="2"
              seed="4"
              result="turb"
            >
              <animate
                attributeName="baseFrequency"
                dur="6.5s"
                values="0.016 0.04; 0.03 0.055; 0.02 0.045; 0.016 0.04"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale="2.6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g filter={`url(#${fid})`}>
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
        </g>
      </svg>
    </span>
  );
}
