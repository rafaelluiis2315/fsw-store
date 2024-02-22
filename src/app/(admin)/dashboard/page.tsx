import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";
import {
  CircleDollarSignIcon,
  DollarSignIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import ProductBestSelling from "./components/product-best-selling";
import PercentageOfCategorySales from "./components/percentage-of-category-sales";
import { ScrollArea } from "@/components/ui/scroll-area";
import { prismaClient } from "@/lib/prisma";
import { getBestSellingProducts } from "@/actions/get-best-selling-products";
import { getPercentageOfSalesByCategory } from "@/actions/get-percentage-of-sales-by-category";
import { getTotalRevenue } from "@/actions/revenue";

const DashboardPage = async () => {
  const fetchData = async () => {
    try {
      const [
        products,
        categories,
        bestSellingProducts,
        percentageOfSalesByCategory,
        revenueToday,
        totalRevenue,
        quantityOrders,
      ] = await Promise.all([
        prismaClient.product.findMany(),
        prismaClient.category.findMany(),
        getBestSellingProducts(),
        getPercentageOfSalesByCategory(),
        getTotalRevenue(
          new Date(new Date().setHours(0, 0, 0, 0)),
          new Date(new Date().setHours(23, 59, 59, 999)),
        ),
        getTotalRevenue(),
        prismaClient.order.count(),
      ]);

      return {
        products,
        categories,
        bestSellingProducts,
        percentageOfSalesByCategory,
        revenueToday,
        totalRevenue,
        quantityOrders,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const data = await fetchData();
  if (!data) return null;

  const {
    products,
    categories,
    bestSellingProducts,
    percentageOfSalesByCategory,
    revenueToday,
    totalRevenue,
    quantityOrders,
  } = data;

  return (
    <div className="custom-scrollbar flex h-[100vh] w-full flex-col gap-10 p-10">
      <Badge variant="heading">
        <LayoutDashboardIcon size={18} />
        Dashboard
      </Badge>

      <div className="flex w-full items-center gap-10">
        <Card className="w-[50%] gap-1 bg-accent px-8 py-10">
          <CardHeader className="flex-row items-center gap-2 p-0 text-lg">
            <LandmarkIcon size={20} />
            Total de Receita
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="w-[50%] gap-1 bg-accent px-8 py-10">
          <CardHeader className="flex-row items-center gap-2 p-0 text-lg">
            <DollarSignIcon size={20} />
            Receita Hoje
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-bold">R$ {revenueToday.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-10">
        <Card className="flex flex-col gap-1 px-8 py-10">
          <CardTitle className="flex justify-center gap-2">
            <CircleDollarSignIcon size={20} className="text-primary" />
            1100
          </CardTitle>
          <CardDescription className="text-center text-base text-current">
            Total de Vendidos
          </CardDescription>
        </Card>
        <Card className="flex flex-col gap-1 px-8 py-10">
          <CardTitle className="flex justify-center gap-2">
            <ShoppingBasketIcon size={20} className="text-primary" />
            {quantityOrders}
          </CardTitle>
          <CardDescription className="text-center text-base text-current">
            Total de Pedidos
          </CardDescription>
        </Card>
        <Card className="flex flex-col gap-1 px-8 py-10">
          <CardTitle className="flex justify-center gap-2">
            <PackageIcon size={20} className="text-primary" />
            {products.length}
          </CardTitle>
          <CardDescription className="text-center text-base text-current">
            Produtos
          </CardDescription>
        </Card>
        <Card className="flex flex-col gap-1 px-8 py-10">
          <CardTitle className="flex justify-center gap-2">
            <CircleDollarSignIcon size={20} className="text-primary" />
            {categories.length}
          </CardTitle>
          <CardDescription className="text-center text-base text-current">
            Categorias
          </CardDescription>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-10">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Produtos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-96 overflow-hidden">
            <ScrollArea className="h-full pr-3">
              <div className="flex h-full flex-col gap-8">
                {bestSellingProducts.map((product) => (
                  <ProductBestSelling key={product.id} product={product} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Categorias Mais Vendidas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-col gap-8">
            <PercentageOfCategorySales
              categories={percentageOfSalesByCategory}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
