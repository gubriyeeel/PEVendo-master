import { Loader2 } from "lucide-react";

const loading = async () => {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center text-5xl">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default loading;
