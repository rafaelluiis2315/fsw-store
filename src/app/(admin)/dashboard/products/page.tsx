import { Badge } from "@/components/ui/badge";
import { prismaClient } from "@/lib/prisma";
import { PackageIcon, PlusIcon } from "lucide-react";
import ProductsTable, {
  ProductWithTotalPriceAndCategory,
} from "./components/product-table";
import { computeProductTotalPrice } from "@/helpers/product";
import SidePanelProductForm from "./components/side-panel-product-form";

const ProductsPage = async () => {
  const products = await prismaClient.product.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const categories = await prismaClient.category.findMany();

  const productsWithTotalPriceAndCategory: ProductWithTotalPriceAndCategory[] =
    products.map((product) => ({
      ...product,
      totalPrice: computeProductTotalPrice(product),
    }));

  return (
    <div className="flex w-full flex-col gap-10 p-10">
      <Badge variant="heading">
        <PackageIcon size={18} />
        Produtos
      </Badge>

      <div className="flex w-full items-center justify-between">
        <p className="text-lg font-bold">
          Produtos encontrados: {products.length}
        </p>

        <SidePanelProductForm categories={categories} />
      </div>

      <ProductsTable
        products={productsWithTotalPriceAndCategory}
        categoryes={categories}
      />
    </div>
  );
};

export default ProductsPage;
