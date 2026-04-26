import type {
  ComponentType,
  InputHTMLAttributes,
  ReactNode,
  SVGProps,
} from "react";

type IconProps = SVGProps<SVGSVGElement>;

type AuthInputProps = {
  label: string;
  icon: ComponentType<IconProps>;
  trailing?: ReactNode;
  helperText?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function AuthInput({
  label,
  icon: Icon,
  trailing,
  helperText,
  className = "",
  ...inputProps
}: AuthInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm transition duration-200 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
        <Icon className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          className={`min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 ${className}`}
          {...inputProps}
        />
        {trailing}
      </div>
      {helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
    </label>
  );
}
