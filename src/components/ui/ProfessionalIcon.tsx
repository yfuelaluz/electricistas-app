interface ProfessionalIconProps {
  size?: number;
  className?: string;
  src?: string;
}

export default function ProfessionalIcon({ size = 40, className = '', src = '/profesional-icon.png' }: ProfessionalIconProps) {
  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid #3b82f6',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
      }}
    >
      <img 
        src={src} 
        alt="Professional"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onError={(e) => {
          // Si la imagen falla, mostrar un ícono de respaldo
          const target = e.currentTarget;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.innerHTML = `
              <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            `;
          }
        }}
      />
    </div>
  );
}

