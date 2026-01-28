import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  active?: boolean;
}

const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'primary', 
  active = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "relative px-4 py-2 font-bold uppercase tracking-wider transition-all duration-200 cyber-border select-none flex items-center justify-center gap-2";
  
  const variants = {
    primary: active 
      ? "bg-cyan-500 text-black border border-cyan-400 shadow-[0_0_10px_#00f3ff]" 
      : "bg-transparent text-cyan-400 border border-cyan-800 hover:border-cyan-400 hover:text-cyan-200 hover:bg-cyan-900/20",
    secondary: active
      ? "bg-orange-500 text-black border border-orange-400 shadow-[0_0_10px_#ff9900]"
      : "bg-transparent text-orange-400 border border-orange-800 hover:border-orange-400 hover:text-orange-200 hover:bg-orange-900/20",
    danger: "bg-transparent text-red-500 border border-red-900 hover:border-red-500 hover:bg-red-900/20"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {/* Decorative corner accent */}
      <div className={`absolute bottom-0 right-0 w-2 h-2 ${active ? 'bg-black' : 'bg-current'}`} style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />
    </button>
  );
};

export default CyberButton;