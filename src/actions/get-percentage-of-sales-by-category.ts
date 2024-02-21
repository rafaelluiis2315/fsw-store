import { Category, Product } from '@prisma/client';
import { ProductWithTotalPrice, computeProductTotalPrice } from "@/helpers/product";
import { prismaClient } from "@/lib/prisma";

export type CategoryAndPercentageOfSales = Category & {
    percentage: number,
};

export const getPercentageOfSalesByCategory = async () => {
    const orderProducts = await prismaClient.orderProduct.findMany({
        include: {
            product: {
                include: {
                    category: true,
                },
            },
        },
    });

    const categories = await prismaClient.category.findMany();

    if (!orderProducts || !categories) return [];

    const totalQuantityOfProductsSold = orderProducts.reduce((total, product) => total + product.quantity, 0);

    const categoryPercentages: CategoryAndPercentageOfSales[] = categories.map((category) => {
        const categorySales = orderProducts.filter((product) => product.product.category.name === category.name);
        const totalQuantitySoldInCategory = categorySales.reduce((total, product) => total + product.quantity, 0);
        const percentage = (totalQuantitySoldInCategory / totalQuantityOfProductsSold) * 100;

        return {
            ...category,
            percentage: percentage,
        };
    });


    return categoryPercentages;
};
