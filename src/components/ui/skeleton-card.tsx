import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const SkeletonCard = () => (
  <Card className="p-6 bg-gradient-card border-border">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
      <Skeleton className="h-9 flex-1" />
      <Skeleton className="h-9 w-9" />
    </div>
  </Card>
);

export const SkeletonDashboardStat = () => (
  <Card className="p-6 bg-gradient-card border-border">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  </Card>
);

export const SkeletonTableRow = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton className="h-4 w-1/4" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-4 w-1/6" />
    <Skeleton className="h-8 w-20" />
  </div>
);

export const SkeletonChat = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`flex gap-4 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <Skeleton className={`h-20 ${i % 2 === 0 ? "w-1/2" : "w-2/3"} rounded-lg`} />
      </div>
    ))}
  </div>
);
