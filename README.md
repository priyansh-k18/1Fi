# FundEMI — Smartphones on mutual-fund backed EMI

A full-stack product catalogue where each smartphone variant carries multiple EMI plans (monthly amount, tenure, interest rate, cashback). All data is served from a database through Next.js API Routes.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: SQLite (via Prisma ORM, easily swappable to PostgreSQL)

## Setup and Run Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
This project uses SQLite for ease of setup. Run the following command to create the database schema and seed the initial data:
```bash
npx prisma db push
node prisma/seed.js
```

*(Note: If you wish to use PostgreSQL, update `prisma/schema.prisma` provider to `"postgresql"` and provide a valid `DATABASE_URL` in `.env`, then run the commands above.)*

### 3. Run the development server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Deploying to Vercel
The SQLite database is stored at `prisma/dev.db`, and the Prisma schema points to that tracked file directly. The build script generates Prisma Client before building Next.js. For production workloads, use a hosted PostgreSQL database instead of SQLite because Vercel's filesystem is not persistent.

## API Endpoints

### 1. `GET /api/public/products`
Returns a list of all products along with their calculated lowest prices and EMIs.
**Example Response:**
```json
{
  "count": 3,
  "products": [
    {
      "id": "...",
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "lowest_price": 134900,
      "lowest_emi": 7138,
      "variant_count": 3
    }
  ]
}
```

### 2. `GET /api/public/products/:slug`
Returns detailed information about a specific product, including its variants and EMI plans.
**Example Request:** `GET /api/public/products/iphone-17-pro`
**Example Response:**
```json
{
  "product": {
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "variants": [
      {
        "slug": "iphone-17-pro-silver-256",
        "color": "Silver",
        "price": 134900,
        "emiPlans": [
          {
            "tenureMonths": 6,
            "monthlyAmount": 22484
          }
        ]
      }
    ]
  }
}
```

## Database Schema (Prisma)
The database schema consists of three main models:
- **Product**: Stores basic product details (name, brand, description, etc.)
- **ProductVariant**: Linked to a Product. Stores variant specifics (color, storage, price, MRP).
- **EmiPlan**: Linked to a ProductVariant. Stores EMI options (tenure, monthly amount, interest rate).

```prisma
model Product {
  id           String           @id @default(uuid())
  slug         String           @unique
  name         String
  brand        String
  category     String           @default("Smartphones")
  description  String           @default("")
  highlights   String           // JSON string
  rating       Float            @default(4.5)
  review_count Int              @default(0)
  variants     ProductVariant[]
}

model ProductVariant {
  id        String    @id @default(uuid())
  productId String
  slug      String    @unique
  color     String
  storage   String
  mrp       Int
  price     Int
  emiPlans  EmiPlan[]
}

model EmiPlan {
  id             String         @id @default(uuid())
  variantId      String
  tenureMonths   Int
  interestRate   Float          @default(0)
  monthlyAmount  Int
  cashbackAmount Int            @default(0)
}
```
