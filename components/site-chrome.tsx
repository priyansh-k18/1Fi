import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/products/1fi.svg" alt="1Fi" className="size-8 rounded-xl" width={32} height={32} />
          <span className="font-display text-lg font-semibold tracking-tight">FundEMI</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Catalogue
          </Link>
          <a href="/api/public/products" className="hidden transition-colors hover:text-foreground sm:inline">
            API
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/80 bg-secondary/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <p className="font-display text-base font-semibold text-foreground">FundEMI</p>
        <p className="max-w-2xl">
          Spend on what you need while your mutual fund investments stay invested. EMI plans shown
          are illustrative and served live from the product database.
        </p>
      </div>
    </footer>
  );
}
