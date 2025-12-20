import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glass = false,
  gradient = false,
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300';
  
  const glassStyles = glass
    ? 'bg-white/70 backdrop-blur-md border border-white/30'
    : 'bg-white border border-primary-100';
  
  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-primary-50 via-white to-accent-50'
    : '';
  
  const hoverStyles = hover
    ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer'
    : 'shadow-card';
  
  return (
    <div className={`${baseStyles} ${glass ? glassStyles : gradientStyles || glassStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
