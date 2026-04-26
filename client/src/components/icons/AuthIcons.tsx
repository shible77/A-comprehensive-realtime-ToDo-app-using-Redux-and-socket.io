import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function createIcon(children: ReactNode, viewBox = "0 0 24 24") {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    );
  };
}

export const MailIcon = createIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4.5 7L10.94 11.83C11.57 12.3 12.43 12.3 13.06 11.83L19.5 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const LockIcon = createIcon(
  <>
    <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M8 10V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="15" r="1.1" fill="currentColor" />
  </>
);

export const EyeIcon = createIcon(
  <>
    <path
      d="M2.5 12C4.3 8.86 7.64 7 12 7C16.36 7 19.7 8.86 21.5 12C19.7 15.14 16.36 17 12 17C7.64 17 4.3 15.14 2.5 12Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </>
);

export const EyeOffIcon = createIcon(
  <>
    <path
      d="M3 3L21 21"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M10.58 7.17C11.04 7.06 11.51 7 12 7C16.36 7 19.7 8.86 21.5 12C20.73 13.34 19.71 14.42 18.5 15.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.12 14.12C13.57 14.67 12.81 15 12 15C10.34 15 9 13.66 9 12C9 11.19 9.33 10.43 9.88 9.88"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.13 6.14C4.64 7.02 3.41 8.32 2.5 12C3.29 13.38 4.36 14.48 5.63 15.27"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const SparkIcon = createIcon(
  <>
    <path
      d="M12 2L13.81 7.19L19 9L13.81 10.81L12 16L10.19 10.81L5 9L10.19 7.19L12 2Z"
      fill="currentColor"
    />
    <path
      d="M18 15L18.9 17.1L21 18L18.9 18.9L18 21L17.1 18.9L15 18L17.1 17.1L18 15Z"
      fill="currentColor"
    />
  </>
);

export const ArrowRightIcon = createIcon(
  <path
    d="M5 12H19M19 12L13 6M19 12L13 18"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);
