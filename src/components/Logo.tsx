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
  return;
};
export default Logo;