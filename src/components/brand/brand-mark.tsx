import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <span
      className={cn(
        "brand-mark relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[0.9rem] border border-cyan-200/30 bg-[linear-gradient(145deg,#17c6df_0%,#087d9d_58%,#07506e_100%)] text-white shadow-[0_0_28px_rgba(14,162,189,0.24)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-[72%]"
        aria-hidden={decorative || undefined}
        role={decorative ? undefined : "img"}
      >
        {!decorative && <title>ChatSelect</title>}
        <path
          d="M13.5 10.5h18a7 7 0 0 1 7 7v9a7 7 0 0 1-7 7h-8.25l-7.75 5v-5h-2a7 7 0 0 1-7-7v-9a7 7 0 0 1 7-7Z"
          fill="rgba(2,16,24,.28)"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinejoin="round"
        />
        <path
          d="m15.5 22.75 5.1 4.8 10.2-10.1"
          stroke="currentColor"
          strokeWidth="3.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="38.5" cy="10" r="2.75" fill="#8eebfa" />
      </svg>
    </span>
  );
}
