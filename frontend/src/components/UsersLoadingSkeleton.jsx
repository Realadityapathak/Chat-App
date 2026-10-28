function UsersLoadingSkeleton() {
  return (
    <div className="space-y-1.5 p-1">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-console-surface border border-console-border/60 p-2.5 rounded-md animate-pulse flex items-center gap-3"
        >
          <div className="size-10 bg-console-border/50 rounded-[6px] shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-console-border/60 rounded w-2/3" />
            <div className="h-2.5 bg-console-border/40 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;
