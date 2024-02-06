"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

import FormLogin from "./components/form-login";
import Link from "next/link";
import Image from "next/image";

const LoginPage = () => {
  const handleLoginWithGoogle = async () => {
    await signIn("google");
  };

  return (
    <div className="flex h-full flex-col gap-5 max-md:items-center max-md:justify-center">
      <FormLogin />

      <Separator className="h-[0.063rem] bg-gray-700" />

      <div className="flex w-full flex-col items-center gap-1">
        <Link href="/auth/register" className="w-full md:w-[50%]">
          <Button variant="outline" className="w-full hover:border-primary">
            Criar Conta
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex w-full items-center justify-center gap-2 hover:border-primary md:w-[50%]"
          onClick={handleLoginWithGoogle}
        >
          <Image src="/google-icon.svg" width={16} height={16} alt="Google" />
          Continuar com Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
