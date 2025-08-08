type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: Size;
  label?: string;
  inline?: boolean;
  className?: string;
}

const sizeMap: Record<Size, string> = {
  xs: "w-4 h-4 border-2",
  sm: "w-6 h-6 border-2",
  md: "w-8 h-8 border-4",
  lg: "w-12 h-12 border-4",
  xl: "w-16 h-16 border-4",
};

export default function SimpleSpinner({
  size = "sm",
  inline = false,
  className = "text-gray-400 flex w-full justify-center items-center",
}: SpinnerProps) {
  const sizeClasses = sizeMap[size] || sizeMap.md;
  const displayClass = inline ? "inline-block" : "block mx-auto";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${displayClass} ${className}`}
    >
      <svg
        className={`${sizeClasses} animate-spin rounded-full border-current border-t-transparent`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >    
      </svg>
    </div>
  );
}
