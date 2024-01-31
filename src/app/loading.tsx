import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2Icon className="animate-spin h-9 w-9 lg:h-20 lg:w-20 text-primary" />
    </div>
  );
};

export default Loading;
