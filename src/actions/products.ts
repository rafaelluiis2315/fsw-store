"use server";

import { revalidatePath } from "next/cache";
import { uploadImagesToS3 } from "./aws-s3";
import { prismaClient } from "@/lib/prisma";
import { ProductWithTotalPriceAndCategory } from "@/app/(admin)/dashboard/products/components/product-table";
import { computeProductTotalPrice } from "@/helpers/product";

const createProduct = async (product: FormData) => {
    // Upload image to AWS S3
    const imagesUrl = await uploadImagesToS3(product.getAll('images') as File[]);

    // Create product in database
    await prismaClient.product.create({
        data: {
            name: product.get('name') as string,
            slug: product.get('slug') as string,
            description: product.get('description') as string,
            imageUrls: imagesUrl,
            categoryId: product.get('category') as string,
            basePrice: Number(product.get('price')),
            discountPercentage: Number(product.get('discountPercentage')),
        }
    })

    revalidatePath('dashboard/products');
};

const getProductsPagination = async (page: number, limit: number) => {
    const products = await prismaClient.product.findMany({
        include: {
            category: true
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const productsWithTotalPriceAndCategory: ProductWithTotalPriceAndCategory[] =
        products.map((product) => ({
            ...product,
            totalPrice: computeProductTotalPrice(product),
        }));

    const totalProducts = await prismaClient.product.count();
    const totalPage = Math.ceil(totalProducts / limit);

    return {
        productsWithTotalPriceAndCategory,
        totalPage,
    };
}

export { createProduct, getProductsPagination };