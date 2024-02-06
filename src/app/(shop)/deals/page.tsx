import { Badge } from "@/components/ui/badge";
import { PercentIcon } from "lucide-react";
import DealsProducts from "./components/deals-products";
import ProductSkeletonList from "@/components/ui/product-skeleton-list";
import { Suspense } from "react";

const DealsPage = async () => {
  return (
    <div className="mx-auto flex flex-col gap-8 p-5 lg:container lg:gap-10 lg:py-10">
      <Badge variant="heading">
        <PercentIcon size={16} />
        Ofertas
      </Badge>
      <div className="grid grid-cols-1 gap-8 min-[375px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Suspense fallback={<ProductSkeletonList />}>
          <DealsProducts />
        </Suspense>
      </div>
    </div>
  );
};

export default DealsPage;
