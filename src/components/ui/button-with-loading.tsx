import { Loader2 } from "lucide-react";
import { Button } from "./button";

interface ButtonWithLoadingProps {
  loading: boolean;
  text: string;
  textWaiting: string;
}

const ButtonWithLoading = ({
  loading,
  text,
  textWaiting,
}: ButtonWithLoadingProps) => {
  return (
    <>
      {loading ? (
        <Button disabled className="flex w-full gap-2 font-bold md:w-[50%]">
          <Loader2 className="w-4 animate-spin" />
          {textWaiting}
        </Button>
      ) : (
        <Button className="w-full font-bold md:w-[50%]">{text}</Button>
      )}
    </>
  );
};

export default ButtonWithLoading;
