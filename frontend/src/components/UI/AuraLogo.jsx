import React from 'react';

/**
 * AuraLogo: A warm, organic, humanized brand mark for Aura AI.
 * Emits luminous amber, terracotta, and warm golden solar rays.
 */
export const AuraLogo = ({ size = 36, animated = true, className = '' }) => {
  const gradientId = React.useId();
  const glowId = React.useId();

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 4px 14px rgba(217, 98, 43, 0.35))'
        }}
      >
        <defs>
          {/* Warm radiant sunset ember gradient */}
          <linearGradient id={`${gradientId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="35%" stopColor="#ea580c" />
            <stop offset="70%" stopColor="#d9622b" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Warm secondary golden highlight */}
          <linearGradient id={`${gradientId}-gold`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Warm luminous core glow */}
          <radialGradient id={`${glowId}-core`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffdfa" stopOpacity="1" />
            <stop offset="45%" stopColor="#fde047" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#ea580c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>

          {/* Atmospheric ambient aura halo */}
          <radialGradient id={`${glowId}-outer`} cx="50%" cy="50%" r="50%">
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="75%" stopColor="#ea580c" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#d9622b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient atmospheric halo */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={`url(#${glowId}-outer)`}
          className={animated ? 'aura-ambient-pulse' : ''}
        />

        {/* Outer orbital wave 1 - Molten amber */}
        <ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="17"
          stroke={`url(#${gradientId}-grad)`}
          strokeWidth="3.2"
          strokeLinecap="round"
          transform="rotate(-30 50 50)"
          opacity="0.9"
        />

        {/* Outer orbital wave 2 - Golden sunburst */}
        <ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="17"
          stroke={`url(#${gradientId}-gold)`}
          strokeWidth="3"
          strokeLinecap="round"
          transform="rotate(35 50 50)"
          opacity="0.85"
        />

        {/* Outer orbital wave 3 - Terracotta horizon */}
        <ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="17"
          stroke={`url(#${gradientId}-grad)`}
          strokeWidth="3.2"
          strokeLinecap="round"
          transform="rotate(95 50 50)"
          opacity="0.92"
        />

        {/* Inner radiant aura nucleus */}
        <circle
          cx="50"
          cy="50"
          r="17"
          fill={`url(#${gradientId}-grad)`}
        />

        {/* Luminous breathing core */}
        <circle
          cx="50"
          cy="50"
          r="11"
          fill={`url(#${glowId}-core)`}
          className={animated ? 'aura-core-breathe' : ''}
        />

        {/* Tiny bright spark */}
        <circle
          cx="50"
          cy="50"
          r="3"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
};
