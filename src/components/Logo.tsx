
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({
  className = '',
  size = 'md'
}: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-10',
    md: 'w-12 h-15',
    lg: 'w-16 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Phone case outline */}
        <rect
          x="25"
          y="10"
          width="50"
          height="100"
          rx="8"
          ry="8"
          stroke="#2563eb"
          strokeWidth="3"
          fill="#f8fafc"
        />
        
        {/* Phone screen */}
        <rect
          x="30"
          y="20"
          width="40"
          height="70"
          rx="4"
          ry="4"
          fill="#1e293b"
        />
        
        {/* Camera cutout */}
        <circle
          cx="45"
          cy="25"
          r="2"
          fill="#374151"
        />
        
        {/* Home button */}
        <circle
          cx="50"
          cy="100"
          r="3"
          stroke="#2563eb"
          strokeWidth="1"
          fill="none"
        />
        
        {/* Brand text */}
        <text
          x="50"
          y="115"
          textAnchor="middle"
          className="text-xs font-bold fill-blue-600"
          fontSize="8"
        >
          CASE
        </text>
      </svg>
    </div>
  );
};

export default Logo;
