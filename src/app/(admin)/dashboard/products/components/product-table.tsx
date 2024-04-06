"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductWithTotalPrice } from "@/helpers/product";
import { useEffect, useState } from "react";
import SidePanelProductForm from "./side-panel-product-form";
import { Category } from "@prisma/client";
import { getProductsPagination } from "@/actions/products";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type ProductWithTotalPriceAndCategory = ProductWithTotalPrice & {
  category: {
    name: string;
  };
};

interface ProductsTableProps {
  page: number;
}

const ProductsTable = ({page}: ProductsTableProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, refresh } = useRouter();

  const [productList, setProductList] = useState<
    ProductWithTotalPriceAndCategory[]
  >([]);
  const [totalPage, setTotalPage] = useState(0);

  const [productEdit, setProductEdit] =
    useState<ProductWithTotalPriceAndCategory | null>(null);

  const handleEditProduct = (product: ProductWithTotalPriceAndCategory) => {
    setProductEdit(product);
  };


  const handlePagination = (page: string) => {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set("page", page);
    } else {
      params.delete("page");
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const handleProductsPagination = async () => {
      const { productsWithTotalPriceAndCategory: products, totalPage } =
        await getProductsPagination(page, 6);

      setProductList(products);
      setTotalPage(totalPage);
    };

    handleProductsPagination();
  }, []);

  return (
    <>
      {productEdit && (
        <SidePanelProductForm
          product={productEdit}
          setProductEdit={setProductEdit}
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
          {productList.map((product) => (
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {Array.from({ length: totalPage }).map((_, index) => (
            <PaginationItem key={index}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePagination(`${index + 1}`)}
              >
                {index + 1}
              </Button>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#5" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default ProductsTable;
