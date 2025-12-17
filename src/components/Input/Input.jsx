import './Input.css';

export const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon,
  error,
  label,
  autoFocus = false,
  disabled = false,
  readOnly = false
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readOnly}
          className={`input ${icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
        />
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};
