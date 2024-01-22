import Link from "next/link";
import { SheetClose } from "./sheet";
import { Button } from "./button";
import { MENU_ICON } from "@/constants/menu-icon";

interface MenuItemProps {
  title: string;
  type: string;
  isClose?: boolean;
  href?: string;
  onClick?: () => void;
}

const MenuItem = ({ title, isClose, href, type, onClick }: MenuItemProps) => {
  return (
    <>
      {isClose ? (
        <SheetClose asChild>
          <Link href={href!}>
            <Button variant="outline" className="w-full justify-start gap-2">
              {MENU_ICON[type.toLowerCase() as keyof typeof MENU_ICON]}
              {title}
            </Button>
          </Link>
        </SheetClose>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onClick}
        >
          {MENU_ICON[type.toLowerCase() as keyof typeof MENU_ICON]}
          {title}
        </Button>
      )}
    </>
  );
};

export default MenuItem;
