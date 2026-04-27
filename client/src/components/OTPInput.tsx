import React, { useRef } from "react";

interface OTPInputProps {
  length?: number;
  onChangeOTP?: (otp: string) => void;
}

const OTPInput = ({ length = 6, onChangeOTP }: OTPInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (inputsRef.current[index]) {
      inputsRef.current[index]!.value = value;
    }

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    triggerOnChange();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const input = inputsRef.current[index];

    if (e.key === "Backspace") {
      if (!input?.value && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    pasteData.split("").forEach((char, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = char;
      }
    });

    inputsRef.current[Math.min(pasteData.length, length - 1)]?.focus();
    triggerOnChange();
  };

  const triggerOnChange = () => {
    const otp = inputsRef.current.map((input) => input?.value || "").join("");
    onChangeOTP?.(otp);
  };

  return (
    <div className="flex flex-nowrap justify-center gap-1.5 sm:gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`OTP digit ${index + 1}`}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="h-11 w-11 min-w-0 rounded-xl border border-slate-200 bg-white px-0 text-center text-base font-semibold text-slate-900 shadow-sm transition duration-200 outline-none placeholder:text-slate-300 focus:-translate-y-0.5 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg"
        />
      ))}
    </div>
  );
};

export default OTPInput;
