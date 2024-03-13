"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductWithTotalPrice } from "@/helpers/product";
import { useState } from "react";
import SidePanelProductForm from "./side-panel-product-form";
import { Category } from "@prisma/client";

export type ProductWithTotalPriceAndCategory = ProductWithTotalPrice & {
  category: {
    name: string;
  };
};

interface ProductsTableProps {
  products: ProductWithTotalPriceAndCategory[];
  categoryes: Category[];
}

const ProductsTable = ({ products, categoryes }: ProductsTableProps) => {
  const [productEdit, setProductEdit] =
    useState<ProductWithTotalPriceAndCategory | null>(null);

  const handleEditProduct = (product: ProductWithTotalPriceAndCategory) => {
    setProductEdit(product);
  };

  return (
    <>
      {productEdit && (
        <SidePanelProductForm
          product={productEdit}
          setProductEdit={setProductEdit}
          categories={categoryes}
        />
      )}
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead className="text-base font-bold text-current">
              Nome
            </TableHead>
            <TableHead className="text-base font-bold text-current">
              Categoria
            </TableHead>
            <TableHead className="text-base font-bold text-current">
              Preço Total
            </TableHead>
            <TableHead className="text-base font-bold text-current">
              Preço Base
            </TableHead>
            <TableHead className="text-base font-bold text-current">
              Vendidos
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              onClick={() => handleEditProduct(product)}
            >
              <TableCell>{product.name}</TableCell>

              <TableCell>{product.category.name}</TableCell>

              <TableCell>R$ {product.totalPrice.toFixed(2)}</TableCell>

              <TableCell>R$ {Number(product.basePrice).toFixed(2)}</TableCell>

              <TableCell>0</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductsTable;
