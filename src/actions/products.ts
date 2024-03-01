"use server";

import { revalidatePath } from "next/cache";
import { uploadImagesToS3 } from "./aws-s3";
import { prismaClient } from "@/lib/prisma";

export const createProduct = async (product: FormData) => {
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
