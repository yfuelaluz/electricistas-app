interface ProfessionalIconProps {
  size?: number;
  className?: string;
}

export default function ProfessionalIcon({ size = 40, className = '' }: ProfessionalIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Círculo de fondo azul */}
      <circle cx="50" cy="50" r="48" fill="url(#gradient)" />
      
      {/* Gradiente de fondo */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="helmet-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      
      {/* Cuerpo del profesional */}
      <ellipse cx="50" cy="75" rx="22" ry="18" fill="#fbbf24" opacity="0.9" />
      
      {/* Cuello */}
      <rect x="45" y="55" width="10" height="12" rx="2" fill="#fcd34d" />
      
      {/* Cabeza */}
      <circle cx="50" cy="45" r="12" fill="#fcd34d" />
      
      {/* Casco blanco moderno */}
      <path 
        d="M 35 40 Q 35 28 50 28 Q 65 28 65 40 L 62 45 Q 50 48 38 45 Z" 
        fill="url(#helmet-gradient)"
        stroke="#d1d5db"
        strokeWidth="0.5"
      />
      
      {/* Visera del casco */}
      <ellipse cx="50" cy="45" rx="14" ry="3" fill="#9ca3af" opacity="0.3" />
      
      {/* Detalles del casco */}
      <line x1="50" y1="28" x2="50" y2="45" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
      <circle cx="50" cy="32" r="2" fill="#60a5fa" />
      
      {/* Herramienta - destornillador */}
      <g transform="translate(68, 60) rotate(45)">
        <rect x="0" y="0" width="3" height="12" rx="1" fill="#ef4444" />
        <rect x="0" y="12" width="3" height="8" rx="0.5" fill="#9ca3af" />
      </g>
      
      {/* Rayo eléctrico pequeño */}
      <path 
        d="M 28 62 L 32 65 L 30 68 L 34 72 L 28 69 L 30 66 Z" 
        fill="#fbbf24"
        opacity="0.8"
      />
    </svg>
  );
}
