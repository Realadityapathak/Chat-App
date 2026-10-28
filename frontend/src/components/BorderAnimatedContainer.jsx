function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full bg-console-surface border-0 sm:border border-console-border rounded-none sm:rounded-lg shadow-tactile flex overflow-hidden transition-colors duration-150">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;
