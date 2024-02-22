import { computeProductTotalPrice } from "@/helpers/product";
import { prismaClient } from "@/lib/prisma";


export const getTotalRevenue = async (start?: Date, end?: Date) => {
    let queryParam = {};

    if (start && end) {
        queryParam = {
            where: {
                createdAt: {
                    gte: start,
                    lt: end,
                }
            }
        }
    }

    const orders = await prismaClient.order.findMany({
        include: {
            orderProducts: true,
        },
        ...queryParam
    });

    if (orders.length === 0) return 0;

    const ordersAndProductsWithTotalPrice = orders.map((order) => {
        const productsWithTotalPrice = order.orderProducts.map((orderProduct) => {
            return {
                ...orderProduct,
                totalPrice: computeProductTotalPrice(orderProduct),
            };
        });

        return {
            ...order,
            orderProducts: productsWithTotalPrice
        };
    });

    const ordersWithTotalSold = ordersAndProductsWithTotalPrice.map((order) => {
        const totalSold = order.orderProducts.reduce((totalSoldCurrent, orderProduct) => {
            return totalSoldCurrent + (orderProduct.totalPrice * orderProduct.quantity);
        }, 0);

        return {
            ...order,
            totalSold
        };
    });

    const totalRevenue: number = ordersWithTotalSold.reduce((total, order) => total + order.totalSold, 0);

    return totalRevenue;
};
