import { error, timeStamp } from "console";

interface CreateProductProps {
    name: string;
    image: File[];
    category: string;
    price: number;
    hasDiscount: boolean;
    discountPercentage?: number;
    totalPrice?: string;
}
const createProduct = async (product: CreateProductProps) => {
    // Upload image to AWS S3

    // Create product in database
    console.log(product);

    return {
        error: {
            field: "root",
            message: "Error message",
        },
        product,
    }
}

export default createProduct;
