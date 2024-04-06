import { ProductWithTotalPriceAndTotalQuantitySold } from "@/actions/get-best-selling-products";
import { Badge } from "@/components/ui/badge";
import { Product } from "@prisma/client";
import Image from "next/image";

interface ProductBestSellingProps {
  product: ProductWithTotalPriceAndTotalQuantitySold;
}

const ProductBestSelling = ({ product }: ProductBestSellingProps) => {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-[85px] min-w-[85px] max-w-[85px] items-center justify-center rounded-lg bg-accent">
        <Image
          src={product.imageUrls[0]}
          alt={product.name}
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-auto object-contain"
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <Badge
            variant="heading"
            className="px-[10px] py-[2px] text-primary lg:text-xs"
          >
            {product.category.name}
          </Badge>

          <p className="text-sm text-current">{product.name}</p>

          <div className="flex items-center gap-2 ">
            {product.discountPercentage > 0 ? (
              <>
                <p className="truncate font-semibold text:sm">
                  R$ {product.totalPrice.toFixed(2)}
                </p>

                <p className="truncate line-through opacity-75 text-xs">
                  R$ {Number(product.basePrice).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="truncate text-sm font-semibold">
                R$ {product.basePrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm font-semibold text-current">
          {product.totalQuantitySold} Vendidos
        </p>
      </div>
    </div>
  );
};

export default ProductBestSelling;
