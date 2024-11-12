import { cn } from "@/lib/utils";

export function H1({ children }: { children?: React.ReactNode }) {
  return (
    <div className="ml-2 font-inter text-[36px] font-[600] leading-[36px] text-black">
      {children}
    </div>
  );
}

export function H2({ children }: { children?: React.ReactNode }) {
  return (
    <div className="font-inter text-[20px] font-[700] leading-[28px] text-black">
      {children}
    </div>
  );
}

export function H3({ children }: { children?: React.ReactNode }) {
  return (
    <div className="font-inter text-[14px] font-[600] leading-[20px] text-black">
      {children}
    </div>
  );
}

export function P({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "font-inter text-[14px] font-[400] leading-[14px] text-black",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Status({ children }: { children?: React.ReactNode }) {
  return (
    <div className="font-inter text-[11px] font-[500] leading-[24px] text-black">
      {children}
    </div>
  );
}

export function Small({ children }: { children?: React.ReactNode }) {
  return (
    <div className="font-inter text-[12px] font-[400] leading-[16px] text-black">
      {children}
    </div>
  );
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
