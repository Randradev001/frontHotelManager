import PropTypes from 'prop-types';

export default function AperpMark({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Isotipo APERP"
    >
      <defs>
        <linearGradient id="aperp-mark-gradient" x1="9" y1="6" x2="56" y2="59" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1593FF" />
          <stop offset="1" stopColor="#0875E1" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="17" fill="url(#aperp-mark-gradient)" />
      <rect x="14" y="17" width="36" height="32" rx="9" fill="#061B36" />
      <path d="M8 57L20 45L28 53L20 61H12C9.9 61 8.55 59.92 8 57Z" fill="#FFFFFF" />
      <path d="M17 50L47 20" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
      <path d="M38 17L51 13L47 26L38 17Z" fill="#FFFFFF" />
    </svg>
  );
}

AperpMark.propTypes = { size: PropTypes.number };
