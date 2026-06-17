import React from "react";

const ShimmerLine = ({ className }) => (
  <div
    className={`rounded-md bg-gradient-to-r from-surface2 via-border to-surface2 bg-[length:200%_100%] animate-shimmer ${className}`}
  />
);

const SkeletonCard = () => (
  <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
    <ShimmerLine className="h-[18px] w-[65%]" />
    <ShimmerLine className="h-3.5 w-full" />
    <ShimmerLine className="h-3.5 w-[85%]" />
    <ShimmerLine className="h-3.5 w-[45%]" />
    <ShimmerLine className="mt-2 h-[11px] w-[40%]" />
  </div>
);

const SkeletonCards = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCards;