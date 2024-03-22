"use server";

import { prismaClient } from "@/lib/prisma";

const getCategories = async () => {
    const categories = prismaClient.category.findMany();

    return categories;
};

export { getCategories };