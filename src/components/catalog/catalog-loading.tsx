import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export function CatalogLoading() {
  return (
    <Container className="grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:py-14">
      <div className="hidden space-y-4 lg:block">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </Container>
  );
}
