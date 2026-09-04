import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { fetchProductBySlug, fetchProductList } from "./catalog.server";

export type ProductListItem = Awaited<ReturnType<typeof fetchProductList>>[number];
export type ProductDetail = NonNullable<Awaited<ReturnType<typeof fetchProductBySlug>>>;
export type ProductVariant = ProductDetail["product_variants"][number];
export type EmiPlan = ProductVariant["emi_plans"][number];

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchProductList } = await import("./catalog.server");
  return fetchProductList();
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { fetchProductBySlug } = await import("./catalog.server");
    return fetchProductBySlug(data.slug);
  });
