import PropTypes from 'prop-types';

export default function TaskManagerMark({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="HM TaskManager"
    >
      <defs>
        <linearGradient id="hm-task-gradient" x1="8" y1="5" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#12385D" />
          <stop offset="1" stopColor="#0B7180" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="15" fill="url(#hm-task-gradient)" />
      <path d="M17 17V47M17 32H35M35 17V47" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 39L45 44L54 33" stroke="#7FE1D1" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

TaskManagerMark.propTypes = { size: PropTypes.number };
