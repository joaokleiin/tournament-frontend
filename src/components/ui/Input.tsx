import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, style, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium"
          style={{ color: "var(--steel)" }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded px-3 py-2 text-sm transition-all duration-150",
          "placeholder:opacity-30",
          "focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          backgroundColor: "var(--surface-high)",
          border: error ? "1px solid #f87171" : "1px solid var(--border-subtle)",
          color: "var(--snow)",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? "#f87171" : "var(--gold)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "#f87171" : "var(--border-subtle)";
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <p className="text-xs" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}
    </div>
  )
);
Input.displayName = "Input";

export { Input };
