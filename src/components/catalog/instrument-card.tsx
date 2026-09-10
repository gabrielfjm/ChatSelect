import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categorySolidClasses } from "@/lib/catalog/category-colors";
import type { Instrument } from "@/core/models/instrument";

export function InstrumentCard({
  instrument,
  backHref,
}: {
  instrument: Instrument;
  /** Current list URL (filters/search included) — carried as `?from=` so
   * the detail page's back link can return here with filters intact. */
  backHref?: string;
}) {
  const href = backHref
    ? `/instrumentos/${instrument.slug}?from=${encodeURIComponent(backHref)}`
    : `/instrumentos/${instrument.slug}`;
  return (
    <Link href={href} className="group block h-full">
      <Card className="relative flex h-full flex-col overflow-hidden border-cyan-300/15 shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-all before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-300 before:to-transparent before:opacity-0 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_12px_32px_rgba(14,162,189,0.11)] hover:before:opacity-100">
        <CardHeader>
          {instrument.category && (
            <Badge
              className={cn(
                "w-fit rounded-full",
                categorySolidClasses(instrument.category),
              )}
            >
              {instrument.category}
            </Badge>
          )}
          <CardTitle className="font-serif text-base leading-snug transition-colors group-hover:text-cyan-300">
            {instrument.title}
          </CardTitle>
          {instrument.description && (
            <CardDescription className="line-clamp-4">
              {instrument.description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
