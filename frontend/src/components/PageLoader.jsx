import { LoaderIcon } from "lucide-react";
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen min-h-dvh">
      <LoaderIcon className="size-10 animate-spin text-cyan-400" />
    </div>
  );
}
export default PageLoader;
