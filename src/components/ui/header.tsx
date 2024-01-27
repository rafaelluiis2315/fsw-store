"use client";

import {
  MenuIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./sheet";
import Link from "next/link";
import Cart from "./cart";
import { CartContext } from "@/providers/cart";
import { useContext } from "react";
import { Badge } from "./badge";
import Menu from "./menu";

const Header = () => {
  const { products } = useContext(CartContext);
  const cartQuantityItem = products.length;

  return (
    <Card className="flex items-center justify-between p-[1.875rem]">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[21.875rem]">
          <Menu/>
        </SheetContent>
      </Sheet>

      <Link href={"/"}>
        <h1 className="text-lg font-semibold">
          <span className="text-primary font-bold">FSW</span> Store
        </h1>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="relative">
            {cartQuantityItem > 0 && (
              <Badge className="absolute right-[calc(-1.60rem/2)] top-[calc(-1.60rem/2)] rounded-lg text-sm font-bold ">
                {products.length}
              </Badge>
            )}
            <ShoppingCartIcon />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-[21.875rem]">
          <Cart />
        </SheetContent>
      </Sheet>
    </Card>
  );
};

export default Header;
