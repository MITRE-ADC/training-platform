export function H1({ children }: { children?: React.ReactNode }) {
  return <div className="ml-2 font-sans text-4xl font-[375]">{children}</div>;
}

export function H2({ children }: { children?: React.ReactNode }) {
  return <div className="font-sans text-3xl font-[375]">{children}</div>;
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
