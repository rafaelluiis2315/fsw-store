"use client";

import { createProduct } from "@/actions/products";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { ArrowUpToLineIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProductWithTotalPriceAndCategory } from "./product-table";
import { getCategories } from "@/actions/category";

const productSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Nome deve ter no mínimo 5 caracteres.",
    })
    .max(50, {
      message: "Nome deve ter no máximo 50 caracteres.",
    }),
  slug: z
    .string()
    .min(5, { message: "Slug deve ter no mínimo 5 caracteres." })
    .max(20, { message: "Slug deve ter no máximo 50 caracteres." }),
  description: z
    .string()
    .max(200, { message: "Descrição deve ter no máximo 200 caracteres." })
    .optional(),
  images: z
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

interface ProductFormProps {
  product?: ProductWithTotalPriceAndCategory;
}

const ProductForm = ({ product }: ProductFormProps) => {
  const [pending, startTransition] = useTransition();
  const [selectedImages, setSelectedImages] = useState<File[] | string[]>(
    product?.imageUrls || [],
  );
  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    const handleCategories = async () => {
      const categoryList = await getCategories();
      setCategories(categoryList);
    };

    handleCategories();
  },[]);

  const productDefaultValues = product
    ? {
        name: product.name,
        slug: product.slug,
        description: product.description,
        hasDiscount: product.discountPercentage > 0,
        category: product.categoryId,
        price: Number(product.basePrice),
        discountPercentage: product.discountPercentage,
        totalPrice: `R$ ${product.totalPrice || 0},00`,
      }
    : {
        hasDiscount: false,
      };

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...productDefaultValues,
    },
  });

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (form.getFieldState("images")?.error) return;

    const files = event.target.files;
    if (files) {
      const imagesArray = Array.from(files);

      imagesArray.forEach((file) => {
        if (file.size > 2 * 1024 * 1024) {
          form.setError("images", {
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
    const formUploud = new FormData();

    formUploud.append("name", values.name);
    formUploud.append("slug", values.slug);
    selectedImages.forEach((image) => {
      formUploud.append("images", image);
    });
    formUploud.append(
      "description",
      values.description ? values.description : "",
    );
    formUploud.append("category", values.category);
    formUploud.append("price", values.price.toString());
    if (values.hasDiscount) {
      formUploud.append(
        "discountPercentage",
        values.discountPercentage ? values.discountPercentage.toString() : "0",
      );
      formUploud.append(
        "totalPrice",
        values.totalPrice ? values.totalPrice : "",
      );
    }

    startTransition(() => createProduct(formUploud));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-2 flex h-[90%] w-full flex-col gap-2 overflow-hidden"
      >
        <ScrollArea className="h-[90%] w-full pr-6">
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

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex h-[77px] w-[77px] items-center justify-center rounded-lg bg-accent"
                  >
                    <Image
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Imagem ${index + 1}`}
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
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border py-2">
                    <ArrowUpToLineIcon size={20} />
                    Adicionar Imagem
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="file"
                      className="hidden"
                      multiple
                      {...field}
                      onChangeCapture={handleImagesChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>

                  <FormControl>
                    <Textarea
                      className="custom-scrollbar-accent h-auto"
                      placeholder="Descreva o produto..."
                      {...field}
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
                <FormItem className="space-y-3">
                  <FormLabel>Categorias</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid w-full grid-cols-2 gap-2"
                    >
                      {categories && categories.map((category) => (
                        <FormItem
                          key={category.id}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              className="border-none bg-accent"
                              value={category.id}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
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

        <div className="w-full pr-5">
          <ButtonWithLoading
            className="md:w-full"
            loading={pending}
            text={`${product ? "Editar" : "Adicionar"} Produto`}
            textWaiting={`${product ? "Editando" : "Adicionando"} Produto...`}
          />
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
