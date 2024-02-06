"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const registerSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "Primeiro Nome deve ter no mínimo 2 caracteres.",
    }),
    lastName: z.string().min(2, {
      message: "Segundo Nome deve ter no mínimo 2 caracteres.",
    }),
    email: z.string().email({ message: "Invalid email." }),
    password: z
      .string()
      .min(6, {
        message: "A Senha deve ter no mínimo 6 caracteres!",
      })
      .refine((data) => /[a-z]/.test(data), {
        message: "A senha deve conter letras!",
      })
      .refine((data) => /[A-Z]/.test(data), {
        message: "A senha deve conter pelo menos uma letra maiúscula!",
      })
      .refine((data) => /\d/.test(data), {
        message: "A senha deve conter números!",
      })
      .refine((data) => /[!@#$%^&*]/.test(data), {
        message: "A senha deve conter pelo menos um caractere especial!",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senha e Confirmar Senha não coincidem!",
    path: ["confirmPassword"],
  });

const FormRegister = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primeiro Nome</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segundo Nome</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>

                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                <FormDescription className="text-xs md:text-sm">
                  1 - Senha deve ter no mínimo 6 caracteres.
                  <br />
                  2- A senha deve conter letras e números.
                  <br />
                  3 - Deve conter pelo menos uma letra maiúscula e uma
                  minúscula.
                  <br />
                  4 - Deve conter pelo menos um caractere especial. (ex: @, #,
                  $, %, !, &, *). <br />
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>

                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-5 flex justify-center">
          <Button type="submit" className="w-full font-bold md:w-[50%]">
            Cadastrar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormRegister;
