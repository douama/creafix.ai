export default function AdminLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/60" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-xl bg-muted/40" />
    </div>
  );
}
