"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  Check,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  TrendingUp,
} from "lucide-react";
import { discountPercent, formatINR, formatRate } from "@/lib/format";

export default function ProductClient({ product, allProducts }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  const colors = useMemo(
    () =>
      Array.from(new Map(product.variants.map((v) => [v.color, v])).values()),
    [product.variants]
  );
  const storagesForColor = product.variants.filter((v) => v.color === variant.color);

  const plans = variant.emiPlans;
  const [planId, setPlanId] = useState(null);
  const selectedPlan =
    plans.find((p) => p.id === planId) ?? plans.find((p) => p.isRecommended) ?? plans[0];
  const [confirmed, setConfirmed] = useState(null);

  const off = discountPercent(variant.mrp, variant.price);

  function pickColor(color) {
    const next =
      product.variants.find((v) => v.color === color && v.storage === variant.storage) ??
      product.variants.find((v) => v.color === color);
    setVariantId(next.id);
    setPlanId(null);
    setConfirmed(null);
  }

  function pickStorage(storage) {
    const next = storagesForColor.find((v) => v.storage === storage);
    setVariantId(next.id);
    setPlanId(null);
    setConfirmed(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Gallery + details */}
        <div>
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-card">
            <img
              key={variant.id}
              src={variant.imageUrl}
              alt={`${product.name} in ${variant.color}, ${variant.storage}`}
              width={1024}
              height={1024}
              className="aspect-square w-full rounded-2xl object-contain"
            />
            {off > 0 && (
              <span className="absolute left-8 top-8 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-mint-foreground">
                {off}% off
              </span>
            )}
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {product.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-xl bg-secondary/60 px-3 py-2">
                <Check className="mt-0.5 size-4 shrink-0 text-mint" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Buy box */}
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-medium text-foreground">
              <Star className="size-3.5 fill-primary text-primary" />
              {product.rating}
            </span>
            {product.review_count} ratings
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatINR(variant.price)}</span>
            <span className="text-base text-muted-foreground line-through">
              {formatINR(variant.mrp)}
            </span>
            {off > 0 && <span className="text-sm font-semibold text-mint">Save {formatINR(variant.mrp - variant.price)}</span>}
          </div>

          {/* Variant pickers */}
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-medium">
                Colour: <span className="text-muted-foreground">{variant.color}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => pickColor(c.color)}
                    aria-pressed={c.color === variant.color}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      c.color === variant.color
                        ? "border-primary bg-primary/8 font-medium text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    <span
                      className="size-4 rounded-full border border-border"
                      style={{ backgroundColor: c.colorHex }}
                    />
                    {c.color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">
                Storage: <span className="text-muted-foreground">{variant.storage}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {storagesForColor.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => pickStorage(v.storage)}
                    aria-pressed={v.id === variant.id}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      v.id === variant.id
                        ? "border-primary bg-primary/8 font-medium text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {v.storage}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EMI plans */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Choose an EMI plan</h2>
              <span className="text-xs text-muted-foreground">{plans.length} plans available</span>
            </div>
            <div className="mt-3 space-y-3">
              {plans.map((plan) => {
                const active = plan.id === selectedPlan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setPlanId(plan.id);
                      setConfirmed(null);
                    }}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-primary bg-card shadow-lift"
                        : "border-border bg-card/60 hover:border-foreground/25"
                    }`}
                  >
                    <span
                      className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                        active ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {active && <Check className="size-3 text-primary-foreground" />}
                    </span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-lg font-semibold">
                          {formatINR(plan.monthlyAmount)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          × {plan.tenureMonths} months
                        </span>
                        {plan.isRecommended && (
                          <span className="rounded-full bg-primary/12 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                            Popular
                          </span>
                        )}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span
                          className={`inline-flex items-center gap-1 ${
                            Number(plan.interestRate) === 0 ? "font-semibold text-mint" : ""
                          }`}
                        >
                          <BadgePercent className="size-3.5" />
                          {formatRate(plan.interestRate)}
                        </span>
                        <span>Total {formatINR(plan.monthlyAmount * plan.tenureMonths)}</span>
                        {plan.cashbackAmount > 0 && (
                          <span className="inline-flex items-center gap-1 text-mint">
                            <Sparkles className="size-3.5" />
                            {formatINR(plan.cashbackAmount)} cashback
                          </span>
                        )}
                      </span>
                      {plan.cashbackLabel && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {plan.cashbackLabel}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="sticky bottom-4 mt-6">
              <button
                type="button"
                onClick={() => setConfirmed({ variant, plan: selectedPlan })}
                className="w-full rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lift transition-opacity hover:opacity-90"
              >
                Proceed with {formatINR(selectedPlan.monthlyAmount)}/mo ·{" "}
                {selectedPlan.tenureMonths} months
              </button>
            </div>

            {confirmed && (
              <div className="mt-4 rounded-2xl border border-mint/40 bg-mint/8 p-5">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <BadgeCheck className="size-5 text-mint" /> Plan selected
                </p>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <Row label="Product" value={`${product.name} · ${confirmed.variant.storage}`} />
                  <Row label="Colour" value={confirmed.variant.color} />
                  <Row label="Item price" value={formatINR(confirmed.variant.price)} />
                  <Row label="Tenure" value={`${confirmed.plan.tenureMonths} months`} />
                  <Row label="Monthly EMI" value={formatINR(confirmed.plan.monthlyAmount)} />
                  <Row label="Interest" value={formatRate(confirmed.plan.interestRate)} />
                  <Row
                    label="Total payable"
                    value={formatINR(confirmed.plan.monthlyAmount * confirmed.plan.tenureMonths)}
                  />
                  <Row
                    label="Cashback"
                    value={
                      confirmed.plan.cashbackAmount > 0
                        ? formatINR(confirmed.plan.cashbackAmount)
                        : "—"
                    }
                  />
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  Next step in a live app: KYC, mutual fund pledge and mandate setup.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl bg-secondary/60 p-5 text-sm sm:grid-cols-3">
            <Perk icon={<ShieldCheck className="size-4 text-mint" />} text="Funds stay invested and keep growing" />
            <Perk icon={<TrendingUp className="size-4 text-mint" />} text="Rates from 10.5% — far below cards" />
            <Perk icon={<BadgePercent className="size-4 text-mint" />} text="0% interest on 3 & 6 month plans" />
          </div>
        </div>
      </div>

      {/* ── Full specifications ── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold sm:text-2xl">Full specifications</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Details for {product.name} · {variant.color} · {variant.storage}
        </p>
        <dl className="mt-4 grid gap-x-8 gap-y-0 rounded-2xl border border-border bg-card p-5 text-sm sm:grid-cols-2">
          <Row label="Brand" value={product.brand} />
          <Row label="Category" value={product.category} />
          <Row label="Colour" value={variant.color} />
          <Row label="Storage" value={variant.storage} />
          <Row label="Selling price" value={formatINR(variant.price)} />
          <Row label="MRP" value={formatINR(variant.mrp)} />
          <Row label="Discount" value={off > 0 ? `${off}% off` : "—"} />
          <Row label="Availability" value={variant.inStock ? "In stock" : "Out of stock"} />
          <Row label="Customer rating" value={`${product.rating} / 5`} />
          <Row label="Ratings count" value={product.review_count} />
          <Row label="Variants available" value={String(product.variants.length)} />
          <Row label="EMI plans" value={`${plans.length} tenures (3–24 months)`} />
        </dl>
      </section>

      {/* ── EMI comparison table ── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold sm:text-2xl">Compare every EMI plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          For {formatINR(variant.price)} · {variant.color} {variant.storage}
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Tenure</th>
                <th className="px-4 py-3 font-medium">Monthly EMI</th>
                <th className="px-4 py-3 font-medium">Interest</th>
                <th className="px-4 py-3 font-medium">Total payable</th>
                <th className="px-4 py-3 font-medium">Cashback</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className={`border-t border-border/60 ${
                    plan.id === selectedPlan.id ? "bg-primary/6 font-medium" : ""
                  }`}
                >
                  <td className="px-4 py-3">{plan.tenureMonths} months</td>
                  <td className="px-4 py-3">{formatINR(plan.monthlyAmount)}</td>
                  <td
                    className={`px-4 py-3 ${
                      Number(plan.interestRate) === 0 ? "font-semibold text-mint" : ""
                    }`}
                  >
                    {formatRate(plan.interestRate)}
                  </td>
                  <td className="px-4 py-3">
                    {formatINR(plan.monthlyAmount * plan.tenureMonths)}
                  </td>
                  <td className="px-4 py-3">
                    {plan.cashbackAmount > 0 ? formatINR(plan.cashbackAmount) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Delivery & support ── */}
      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        <InfoCard
          icon={<Truck className="size-5 text-mint" />}
          title="Free delivery"
          body="Dispatched in 24 hours, delivered in 2–4 working days across India."
        />
        <InfoCard
          icon={<PackageCheck className="size-5 text-mint" />}
          title="7-day replacement"
          body="Sealed-box replacement for any manufacturing defect reported within 7 days."
        />
        <InfoCard
          icon={<ShieldCheck className="size-5 text-mint" />}
          title="1-year brand warranty"
          body={`Standard ${product.brand} India warranty, serviceable at authorised centres.`}
        />
      </section>

      {/* ── FAQs ── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold sm:text-2xl">
          EMI questions about the {product.name}
        </h2>
        <div className="mt-4 space-y-3">
          {[
            {
              q: `How is the EMI on the ${product.name} funded?`,
              a: "A loan is issued against the value of your mutual fund portfolio. Your units are pledged, not sold, so they stay invested and keep compounding.",
            },
            {
              q: "Do I need a credit card?",
              a: "No. Eligibility is based on your pledged mutual fund holdings, not on a card or a credit line.",
            },
            {
              q: "Which tenures are interest free?",
              a: "The 3 and 6 month plans on this product are at 0% interest — you repay exactly the item price. Longer tenures carry a published annual rate.",
            },
            {
              q: "Can I prepay or close the plan early?",
              a: "Yes, plans can be closed early and the pledge on your units is released once the outstanding amount is cleared.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-border bg-card px-5 py-4"
            >
              <summary className="cursor-pointer list-none text-sm font-medium marker:hidden">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedProducts currentSlug={product.slug} allProducts={allProducts} />
    </div>
  );
}

function RelatedProducts({ currentSlug, allProducts }) {
  const others = allProducts.filter((p) => p.slug !== currentSlug);
  if (others.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-xl font-semibold sm:text-2xl">More phones on EMI</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-lift"
          >
            {p.hero_image && (
              <img
                src={p.hero_image}
                alt={p.name}
                width={128}
                height={128}
                className="size-20 shrink-0 rounded-xl object-cover"
              />
            )}
            <span className="min-w-0">
              <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                {p.brand}
              </span>
              <span className="block truncate font-semibold">{p.name}</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {formatINR(p.lowest_price)} · EMI from {formatINR(p.lowest_emi ?? 0)}/mo
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
                View details <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function InfoCard({ icon, title, body }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-mint/12">
        {icon}
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Perk({ icon, text }) {
  return (
    <p className="flex items-start gap-2 text-muted-foreground">
      <span className="mt-0.5">{icon}</span>
      {text}
    </p>
  );
}
