import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Magnifying Glass Handle */}
    <path 
      d="M72 72 L95 95" 
      stroke="currentColor" 
      strokeWidth="12" 
      strokeLinecap="round" 
    />
    
    {/* Magnifying Glass Ring */}
    <circle cx="45" cy="45" r="38" stroke="currentColor" strokeWidth="8" />
    
    {/* Person Silhouette (Clipped inside the ring) */}
    <mask id="ring-mask">
      <circle cx="45" cy="45" r="34" fill="white" />
    </mask>
    
    <g mask="url(#ring-mask)">
      {/* Head */}
      <circle cx="45" cy="22" r="12" fill="#4F63D2" />
      
      {/* Torso */}
      <path 
        d="M15 90 C15 60 30 45 45 45 C60 45 75 60 75 90" 
        fill="#4F63D2" 
      />
      
      {/* Raised Arm */}
      <path 
        d="M65 55 C70 40 75 25 80 10 C85 5 95 10 92 20 C88 35 75 60 70 70" 
        fill="#4F63D2" 
      />
      
      {/* Tie (White) */}
      <path 
        d="M45 45 L51 60 L45 85 L39 60 Z" 
        fill="white" 
      />
    </g>
  </svg>
);
