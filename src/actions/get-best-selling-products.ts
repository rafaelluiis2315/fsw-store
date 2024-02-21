import { ProductWithTotalPrice, computeProductTotalPrice } from "@/helpers/product";
import { prismaClient } from "@/lib/prisma";

export type ProductWithTotalPriceAndTotalQuantitySold = ProductWithTotalPrice & {
    totalQuantitySold: number;
    category: {
        name: string;
    };
};

export const getBestSellingProducts = async () => {
    // This Query returns the 10 best selling products
    const bestSellingOrderProducts = await prismaClient.orderProduct.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
    });

    const productIds = bestSellingOrderProducts.map((item) => item.productId);

    // This Query returns the products with the category, but it's not ordered by the best selling products
    const productsWithCategory = await prismaClient.product.findMany({
        where: { id: { in: productIds } },
        include: {
            category: true,
        },
    });

    if (!bestSellingOrderProducts || !productsWithCategory) return [];

    const productsWithTotalPriceAndTotalQuantitySold: ProductWithTotalPriceAndTotalQuantitySold[] = productsWithCategory.map((product) => ({
        ...product,
        totalPrice: computeProductTotalPrice(product),
        totalQuantitySold: bestSellingOrderProducts.find((item) => item.productId === product.id)?._sum?.quantity ?? 0,
    }));

    const bestSellingProducts = productsWithTotalPriceAndTotalQuantitySold.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)

    return bestSellingProducts;
};
