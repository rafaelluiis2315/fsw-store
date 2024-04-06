import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ButtonWithLoadingProps extends React.HTMLProps<HTMLButtonElement> {
  loading: boolean;
  text: string;
  textWaiting: string;
}

const ButtonWithLoading = ({
  loading,
  text,
  textWaiting,
  className,
}: ButtonWithLoadingProps) => {
  return (
    <>
      <Button
        disabled={loading}
        className={cn("flex w-full gap-2 font-bold md:w-[50%]", className)}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 animate-spin" />
            {textWaiting}
          </>
        ) : (
          <>{text}</>
        )}
      </Button>
    </>
  );
};

export default ButtonWithLoading;
