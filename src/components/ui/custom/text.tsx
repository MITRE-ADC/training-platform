import { cn } from "@/lib/utils";

export function H1({ children }: { children?: React.ReactNode }) {
  return <div className="ml-2 font-inter text-[36px] leading-[36px] font-[600] text-black">{children}</div>;
}

export function H2({ children }: { children?: React.ReactNode }) {
  return <div className="font-inter text-[20px] leading-[28px] font-[700] text-black">{children}</div>;
}

export function H3({ children }: { children?: React.ReactNode }) {
  return <div className="font-inter text-[14px] leading-[20px] font-[600] text-black">{children}</div>;
}

export function P({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <span className={cn("font-inter text-[14px] leading-[14px] font-[400] text-black", className)}>{children}</span>;
}

export function Status({ children }: { children?: React.ReactNode }) {
  return <div className="font-inter text-[11px] leading-[24px] font-[500] text-black">{children}</div>;
}

export function Small({ children }: { children?: React.ReactNode }) {
  return <div className="font-inter text-[12px] leading-[16px] font-[400] text-black">{children}</div>;
}

interface TextProps {
  disabled?: boolean;
  status?: "default" | "alert" | "good";
  children: React.ReactNode;
}

export function Text({ status, disabled, children }: TextProps) {
  if (disabled)
    return (
      <span className="font-sans italic text-neutral-700">{children}</span>
    );
  else {
    let color = "text-neutral";
    if (status == "alert") color = "text-alert";
    else if (status == "good") color = "text-good";

    return <span className={color}>{children}</span>;
  }
}
