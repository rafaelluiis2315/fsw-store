import { Skeleton } from "./skeleton";

interface ProductSkeletonListProps {
  quantity?: number;
}

const ProductSkeletonList = ({ quantity }: ProductSkeletonListProps) => {
  const quantityDefaultOrProps: number = quantity ? quantity : 12;
  const quantityProductSkeleton: number[] = Array(quantityDefaultOrProps).fill(
    0,
  );

  return (
    <>
      {quantityProductSkeleton.map((index) => (
        <div key={index + 1} className="flex flex-col gap-4">
          <div>
            <Skeleton className="h-52 max-h-full w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeletonList;
