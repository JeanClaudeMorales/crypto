import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  fullWidth = true
}: { 
  children?: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; 
  className?: string; 
  onClick?: () => void;
  fullWidth?: boolean;
}) => {
  const baseStyles = "h-14 font-semibold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center";
  
  const variants = {
    primary: "bg-primary text-white shadow-[0_4px_20px_rgba(127,102,255,0.3)] hover:bg-primary-dark",
    secondary: "bg-bg-input text-white hover:bg-bg-lighter",
    outline: "border border-primary text-primary hover:bg-primary/10",
    ghost: "text-gray-400 hover:text-white"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  className = "",
  rightIcon
}: { 
  type?: string; 
  placeholder: string; 
  value?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  rightIcon?: React.ReactNode;
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-14 bg-transparent border border-bg-lighter rounded-2xl px-5 text-white placeholder-gray-500 focus:border-primary focus:ring-0 outline-none transition-colors"
      />
      {rightIcon && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export const Header = ({ 
  title, 
  onBack, 
  rightElement 
}: { 
  title?: string; 
  onBack?: () => void; 
  rightElement?: React.ReactNode 
}) => {
  return (
    <header className="flex items-center justify-between p-6 pb-2 sticky top-0 z-20 bg-bg-main/95 backdrop-blur-md">
      <div className="w-10 flex items-center justify-start">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-bg-lighter transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}
      </div>
      {title && <h1 className="text-lg font-semibold tracking-wide">{title}</h1>}
      <div className="w-10 flex items-center justify-end">
        {rightElement}
      </div>
    </header>
  );
};

export const NumPad = ({ onNumber, onDelete, onDecimal }: { onNumber: (n: string) => void, onDelete: () => void, onDecimal: () => void }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'];

  return (
    <div className="grid grid-cols-3 gap-y-4 gap-x-8 px-8 mb-6">
      {keys.map((key) => {
        const isAction = key === '.' || key === 'back';
        return (
          <button
            key={key}
            onClick={() => {
              if (key === 'back') onDelete();
              else if (key === '.') onDecimal();
              else onNumber(key);
            }}
            className={`
              h-16 w-16 rounded-full flex items-center justify-center mx-auto text-2xl font-medium transition-colors
              ${isAction ? 'text-primary bg-bg-card' : 'text-white hover:bg-bg-card'}
              ${key === 'back' ? 'text-2xl' : ''}
            `}
          >
            {key === 'back' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
            ) : key}
          </button>
        );
      })}
    </div>
  );
};