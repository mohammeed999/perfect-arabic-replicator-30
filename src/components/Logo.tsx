
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-10',
    md: 'w-12 h-15',
    lg: 'w-16 h-20'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Phone case outline */}
        <svg 
          viewBox="0 0 24 30" 
          className="w-full h-full"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer case */}
          <rect 
            x="2" 
            y="2" 
            width="20" 
            height="26" 
            rx="3" 
            ry="3" 
            stroke="#3B82F6" 
            strokeWidth="2" 
            fill="#EBF4FF"
          />
          
          {/* Inner phone shape */}
          <rect 
            x="4" 
            y="4" 
            width="16" 
            height="22" 
            rx="2" 
            ry="2" 
            stroke="#1E40AF" 
            strokeWidth="1.5" 
            fill="#FFFFFF"
          />
          
          {/* Camera cutout */}
          <circle 
            cx="12" 
            cy="7" 
            r="1.5" 
            fill="#374151"
          />
          
          {/* Screen area */}
          <rect 
            x="6" 
            y="9" 
            width="12" 
            height="14" 
            rx="1" 
            ry="1" 
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="0.5"
          />
          
          {/* Logo text on screen */}
          <text 
            x="12" 
            y="16" 
            textAnchor="middle" 
            className="text-xs font-bold fill-blue-600"
            fontSize="4"
          >
            غراب
          </text>
          
          {/* Bottom button */}
          <circle 
            cx="12" 
            cy="25" 
            r="1" 
            fill="#6B7280"
          />
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className="font-bold text-blue-600 text-lg leading-tight">
          مصنع الأغراب
        </span>
        <span className="text-xs text-gray-500 leading-tight">
          لأغطية الهواتف
        </span>
      </div>
    </div>
  );
};

export default Logo;
