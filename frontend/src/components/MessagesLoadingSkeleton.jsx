function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 py-2">
      {[1, 2, 3, 4].map((index) => {
        const isSent = index % 2 === 0;

        return (
          <div
            key={index}
            className={`flex flex-col ${isSent ? "items-end" : "items-start"} animate-pulse`}
          >
            <div
              className={`h-12 w-48 rounded-xl ${
                isSent
                  ? "bg-console-accent/20 rounded-tr-xs"
                  : "bg-console-surface border border-console-border rounded-tl-xs"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default MessagesLoadingSkeleton;
