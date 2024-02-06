import ProducItem from "@/components/ui/product-item";
import { computeProductTotalPrice } from "@/helpers/product";
import { prismaClient } from "@/lib/prisma";

const DealsProducts = async () => {
  const deals = await prismaClient.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
  });

  return (
    <>
      {deals.map((product) => (
        <ProducItem
          key={product.id}
          product={{
            ...product,
            totalPrice: computeProductTotalPrice(product),
          }}
        />
      ))}
    </>
  );
};

export default DealsProducts;
