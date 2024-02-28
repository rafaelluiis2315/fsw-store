"use client";

import createProduct from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ButtonWithLoading from "@/components/ui/button-with-loading";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpToLineIcon, PackageIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Nome deve ter no mínimo 5 caracteres.",
    })
    .max(50, {
      message: "Nome deve ter no máximo 50 caracteres.",
    }),
  image: z
    .string({
      required_error: "Selecione ao menos 1 imagem.",
    })
    .or(
      z.array(z.string()).max(4, { message: "Selecione no máximo 4 imagens." }),
    ),
  category: z.string(),
  price: z.coerce.number().refine((value) => value > 0, {
    message: "Preço deve ser maior que 0.",
  }),
  hasDiscount: z.boolean(),
  discountPercentage: z.coerce
    .number()
    .refine((value) => value >= 0 && value <= 100, {
      message: "Desconto deve ser entre 0 e 100.",
    })
    .optional(),
  totalPrice: z.string().optional(),
});

const ProductForm = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      hasDiscount: false,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (form.getFieldState("image")?.error) return;

    const files = event.target.files;
    if (files) {
      const imagesArray = Array.from(files);

      imagesArray.forEach((file) => {
        if (file.size > 2 * 1024 * 1024) {
          form.setError("image", {
            message: "O tamanho da imagem não pode exceder 2MB.",
          });
          return;
        }
      });

      setSelectedImages(imagesArray);
    }
  };

  const handleTotalPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFieldName = e.target.name;
    const currentFieldValue = e.target.value;

    let price: number | undefined;
    let discountPercentage: number | undefined;

    if (currentFieldName === "price") {
      price = Number(currentFieldValue);
      discountPercentage = form.getValues("discountPercentage");
    }

    if (currentFieldName === "discountPercentage") {
      price = form.getValues("price");
      discountPercentage = Number(currentFieldValue);
    }

    if (price === undefined || discountPercentage === undefined) return;

    if (discountPercentage >= 0) {
      const totalPrice = price - price * (discountPercentage / 100);
      const totalPriceFormat = totalPrice
        .toFixed(2)
        .toString()
        .replace(".", ",");

      form.setValue("totalPrice", `R$ ${totalPriceFormat}`);
    }
  };

  async function onSubmit(values: z.infer<typeof productSchema>) {
    const { error, product } = await createProduct({
      name: values.name,
      image: selectedImages,
      category: values.category,
      price: values.price,
      hasDiscount: values.hasDiscount,
      discountPercentage: values.discountPercentage,
      totalPrice: values.totalPrice,
    });

    if (error) {
      console.error(error);
      return;
    }

    console.log(product);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex gap-2">
          <PlusIcon size={18} />
          Adicionar produto
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[21.875rem]">
        <SheetHeader>
          <Badge variant="heading" className="flex gap-1">
            <PackageIcon size={18} />
            Adicionar produto
          </Badge>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 flex h-[90%] w-full flex-col gap-2 overflow-hidden"
          >
            <ScrollArea className="h-[90%] w-full">
              <div className="flex w-full flex-col gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedImages.length > 0 && (
                  <div className="flex items-center justify-between gap-2">
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="flex h-[77px] w-[77px] items-center justify-center rounded-lg bg-accent"
                      >
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          height={0}
                          width={0}
                          sizes="100vw"
                          className="h-auto max-h-[70%] w-auto max-w-[80%]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex w-full items-center justify-center gap-2 rounded-lg border py-2">
                        <ArrowUpToLineIcon size={20} />
                        Adicionar Imagem
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="file"
                          className="hidden"
                          multiple
                          {...field}
                          onChangeCapture={handleFileChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categorias</FormLabel>

                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          placeholder="R$ 0,00"
                          {...field}
                          onChangeCapture={handleTotalPrice}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.getValues("hasDiscount") && (
                  <>
                    <FormField
                      control={form.control}
                      name="discountPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porcentagem de Desconto</FormLabel>

                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0%"
                              {...field}
                              onChangeCapture={handleTotalPrice}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço com Desconto</FormLabel>

                          <FormControl>
                            <Input placeholder="R$ 0,00" disabled {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="hasDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            variant="cicle"
                          />
                        </FormControl>

                        <FormLabel>Produto com desconto</FormLabel>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <ButtonWithLoading
              loading={form.formState.isSubmitting}
              text="Adicionar Produto"
              textWaiting="Criando Produto..."
            />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default ProductForm;
