import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, className = "", id, ...props },
  ref
) {
  const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="rp-label">
          {label}
        </label>
      )}
      <input ref={ref} id={inputId} className={`rp-input ${className}`} {...props} />
    </div>
  );
});
