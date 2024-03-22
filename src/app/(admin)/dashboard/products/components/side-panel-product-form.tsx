"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageIcon, PlusIcon } from "lucide-react";
import ProductForm from "./product-form";
import { Category } from "@prisma/client";
import { ProductWithTotalPriceAndCategory } from "./product-table";
import { useEffect, useState } from "react";

interface SidePanelProductFormProps {
  product?: ProductWithTotalPriceAndCategory;
  setProductEdit?: (product: ProductWithTotalPriceAndCategory | null) => void;
}
const SidePanelProductForm = ({
  product,
  setProductEdit,
}: SidePanelProductFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setIsOpen(true);
    }
  }, []);

  const handleOpen = (open: boolean) => {
    if (open) {
      setIsOpen(true);
      return;
    }

    if (!open && product) {
      setIsOpen(false);
      setProductEdit?.(null);
      return;
    }

    if (!open && !product) {
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      {!product && (
        <SheetTrigger asChild>
          <Button className="flex gap-2">
            <PlusIcon size={18} />
            Adicionar produto
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="w-[37.5rem] pr-0">
        <SheetHeader>
          <Badge variant="heading" className="flex gap-1">
            <PackageIcon size={18} />
            {!product && "Adicionar"} produto
          </Badge>
        </SheetHeader>
        <ProductForm product={product} />
      </SheetContent>
    </Sheet>
  );
};

export default SidePanelProductForm;
