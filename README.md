# DAGDI Electricals & Power Controls — Full-Stack Next.js & Node.js Application

**Enterprise Industrial Electrical B2B Commerce & Workshop Management Portal**  
*Proprietor: Sandesh Dagdi Saini | Beawar, Rajasthan | GSTIN: 08ADOPD4068J1Z9*

---

## ⚡ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Lucide React, Modern CSS Design System
- **Backend**: Node.js REST API Route Handlers (`app/api/*`) running on the Node.js runtime
- **Data Layer**: Persistent File-based JSON Database (`data/db/*.json`) with atomic write buffers & automatic bootstrap seeding
- **SEO & Performance**: Dynamic metadata generation, OpenGraph tags, semantic HTML5, `robots.ts`, `sitemap.ts`

---

## 📁 Project Architecture

```
dagdi/
├── app/
│   ├── layout.tsx                    # Root layout with fonts, metadata, AppShell
│   ├── page.tsx                      # Homepage with Hero, Stockists, Product Showcase
│   ├── globals.css                   # Core industrial design system tokens & utilities
│   ├── catalog/                      # Multi-filter product catalogue
│   ├── products/[slug]/              # Dynamic product detail page (SEO meta & tier pricing)
│   ├── quotation-builder/            # B2B RFQ builder with item customization
│   ├── rewinding-service/            # Motor & pump rewinding booking & tracker
│   ├── calculator/                   # APFC Power Factor sizing calculator
│   ├── checkout/                     # B2B/B2C GST checkout
│   ├── order-confirmation/[id]/      # Tax invoice receipt & print view
│   ├── order-tracking/               # Real-time order status tracking
│   ├── about/                        # Company credentials & Beawar workshop overview
│   ├── contact/                      # Contact desk & breakdown inquiry form
│   ├── admin/                        # Comprehensive Admin Management Console
│   ├── robots.ts                     # Search engine crawler instructions
│   ├── sitemap.ts                    # Dynamic sitemap index
│   └── api/                          # Node.js Backend API Routes
│       ├── products/                 # GET / POST products
│       │   └── [id]/                 # GET / PUT / DELETE product by id or slug
│       ├── orders/                   # GET / POST customer orders
│       │   └── [id]/                 # GET order / PATCH order status
│       ├── rfq/                      # GET / POST B2B quotation requests
│       │   └── [id]/                 # GET / PATCH RFQ status & notes
│       ├── rewinding/                # GET / POST motor rewinding jobs
│       │   └── [id]/                 # GET / PATCH rewinding progress
│       ├── calculator/apfc/          # POST APFC kVAR & penalty savings computation
│       ├── advisor/                  # POST industrial AI electrical rule engine
│       ├── config/                   # GET / PUT business settings
│       ├── contact/                  # POST contact & breakdown messages
│       └── admin/stats/              # GET aggregated revenue & workflow analytics
├── lib/
│   └── db.ts                         # Node.js persistent JSON database management engine
├── data/
│   └── db/                           # Persistent JSON data files
│       ├── products.json
│       ├── orders.json
│       ├── quotations.json
│       ├── rewindings.json
│       └── config.json
└── src/
    ├── components/                   # Header, Footer, Modals, Calculators, Cards
    ├── context/StoreContext.tsx       # Unified client-backend synchronization context
    ├── data/catalogue.ts             # Initial catalogue seed data
    └── views/                        # Page views
```

---

## 🔌 Node.js Backend REST APIs

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/products` | `GET` | Filter products by search, category, brand, stock, sort |
| `/api/products` | `POST` | Add a new product to catalogue (Admin) |
| `/api/products/[id]` | `GET`, `PUT`, `DELETE` | Retrieve, update or delete a product by ID or slug |
| `/api/orders` | `GET`, `POST` | List all orders or create a new order with auto order ID |
| `/api/orders/[id]` | `GET`, `PATCH` | Fetch order invoice details or update order/payment status |
| `/api/rfq` | `GET`, `POST` | List quotation requests or submit a new multi-item RFQ |
| `/api/rfq/[id]` | `GET`, `PATCH` | Retrieve or update RFQ status (`New` → `Quotation Prepared` → `Sent`) |
| `/api/rewinding` | `GET`, `POST` | List rewinding bookings or submit a new motor job card |
| `/api/rewinding/[id]` | `GET`, `PATCH` | Track or update rewinding stage (`Diagnosis` → `Rewinding` → `Baking`) |
| `/api/calculator/apfc` | `POST` | Engineering trigonometric APFC sizing: $kVAR = kW \times (\tan\phi_1 - \tan\phi_2)$ |
| `/api/advisor` | `POST` | Industrial AI recommendation engine for starters, cables, electrodes |
| `/api/config` | `GET`, `PUT` | Read or update store details, GSTIN, announcement banner |
| `/api/contact` | `POST` | Submit breakdown inquiry or customer message |
| `/api/admin/stats` | `GET` | Aggregated metrics: gross revenue, order counts, pending RFQs |

---

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
Runs Next.js App Router and Node.js backend on [http://localhost:3000](http://localhost:3000).

### Production Build
```bash
npm run build
npm run start
```
Compiles and starts the optimized production server.
