"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Separator } from "./separator";
import { signIn, signOut, useSession } from "next-auth/react";
import MenuItem from "./menu-item";
import { SheetHeader } from "./sheet";

const Menu = () => {
  const { status, data } = useSession();

  const handleLoginClick = async () => {
    await signIn();
  };

  const handleLogoutClick = async () => {
    await signOut();
  };

  return (
    <>
      <SheetHeader className="text-left text-lg font-semibold">
        Menu
      </SheetHeader>

      {status === "authenticated" && data?.user && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 py-4">
            <Avatar>
              <AvatarFallback>
                {data.user.name?.[0].toUpperCase()}
              </AvatarFallback>

              {data.user.image && <AvatarImage src={data.user.image} />}
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium">{data.user.name}</p>
              <p className="text-sm opacity-75">Boas compras!</p>
            </div>
          </div>
          <Separator className="h-[0.063rem] bg-border" />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {status === "unauthenticated" && (
          <MenuItem
            onClick={handleLoginClick}
            title="Fazer Login"
            type="login"
          />
        )}

        {status === "authenticated" && (
          <MenuItem
            onClick={handleLogoutClick}
            title="Fazer Logout"
            type="logout"
          />
        )}

        <MenuItem isClose title="Início" type="home" href="/" />
        
        <MenuItem isClose title="Meus Pedidos" type="my_orders" href="/orders"/>

        <MenuItem isClose title="Ofertas" type="deals" href="/deals" />

        <MenuItem isClose title="Catálogo" type="catalog" href="/catalog" />
      </div>
    </>
  );
};

export default Menu;
