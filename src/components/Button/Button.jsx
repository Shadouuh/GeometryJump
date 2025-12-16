import './Button.css';

export const Button = ({ children, variant = 'primary', onClick, disabled, fullWidth, icon }) => {
  return (
    <button 
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};
