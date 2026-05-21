export function SignalSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-3 w-32" />
        </div>
        <div className="skeleton h-8 w-16" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="skeleton h-14" />
        <div className="skeleton h-14" />
        <div className="skeleton h-14" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return <div className="skeleton h-24 rounded-2xl" />;
}
