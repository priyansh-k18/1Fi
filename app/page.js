import Link from "next/link";
import { ArrowRight, BadgePercent, ShieldCheck, Wallet } from "lucide-react";
import { listProducts } from "@/lib/catalog";
import { discountPercent, formatINR } from "@/lib/format";

export default async function Home() {
  const products = await listProducts();

  return (
    <div>
      <section className="border-b border-border/70 bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-mint" />
              EMI against your mutual funds — investments stay invested
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Buy the phone now.
              <br />
              Keep compounding.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Pick a smartphone, pick a tenure from 3 to 24 months, and pay in EMIs funded by a loan
              against your mutual fund portfolio. No liquidation, no credit card required.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <Stat icon={<BadgePercent className="size-4 text-primary" />} label="0% interest plans" value="3 & 6 months" />
              <Stat icon={<Wallet className="size-4 text-primary" />} label="Rates from" value="10.5% p.a." />
              <Stat icon={<ShieldCheck className="size-4 text-primary" />} label="Approval" value="Under 5 minutes" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 2).map((product, index) => (
              <div key={product.id} className="rounded-3xl bg-card p-4 shadow-card">
                <img
                  src={product.hero_image ?? ""}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="aspect-square w-full rounded-2xl object-contain"
                />
                <p className="mt-3 text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  from {product.lowest_emi ? formatINR(product.lowest_emi) : "—"}/mo
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Shop smartphones on EMI</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {products.length} products · live from the product database
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const off =
              product.lowest_mrp && product.lowest_price
                ? discountPercent(product.lowest_mrp, product.lowest_price)
                : 0;
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group flex flex-col rounded-3xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-lift"
              >
                <div className="relative">
                  <img
                    src={product.hero_image ?? ""}
                    alt={`${product.name} on EMI`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="aspect-square w-full rounded-2xl bg-secondary/60 object-contain"
                  />
                  {off > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-mint-foreground">
                      {off}% off
                    </span>
                  )}
                </div>
                <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                  {product.brand} · {product.variant_count} variants
                </p>
                <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-semibold">
                    {product.lowest_price ? formatINR(product.lowest_price) : "—"}
                  </span>
                  {product.lowest_mrp && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatINR(product.lowest_mrp)}
                    </span>
                  )}
                </div>
                <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm">
                  EMI from{" "}
                  <span className="font-semibold text-primary">
                    {product.lowest_emi ? formatINR(product.lowest_emi) : "—"}/mo
                  </span>
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View EMI plans
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-card shadow-card">{icon}</span>
      <span>
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block font-semibold">{value}</span>
      </span>
    </div>
  );
}
