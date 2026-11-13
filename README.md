# Commonplace Market

A full stack product browsing demo with an editorial storefront and a MongoDB-backed catalog. Product filtering, sorting, pagination, counts, and filter metadata are computed by the Express API against MongoDB.

## Features

- Multi-select categories (OR within categories)
- Inclusive minimum and maximum price filter
- Minimum star rating filter, including a clear option
- Server-side sort by recommended, price, or rating
- MongoDB filtering and pagination, with an accurate result count
- Debounced price slider, abortable requests, loading skeletons, API error state, and empty state
- Responsive filter drawer for smaller screens
- Seed script inserts 60 realistic products across Electronics, Apparel, and Footwear

## Stack and layout

- Client: React, Vite, JavaScript, Tailwind CSS, Axios, Lucide React
- Server: Node.js, Express, Mongoose, MongoDB

```text
client/src/       React app, UI components, API service, and hook
server/config/    MongoDB connection
server/models/    Mongoose Product schema and indexes
server/services/  Query validation and product business logic
server/controllers/ REST request handlers
server/routes/    Product API routes
server/scripts/   MongoDB seed script
```

## Prerequisites

- Node.js 20 or newer and npm
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. Install dependencies from the project root:

   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

2. Configure the backend:

   ```bash
   cp server/.env.example server/.env
   ```

   Set `MONGO_URI` to your MongoDB connection URI. The default is `mongodb://127.0.0.1:27017/marketplace`. `PORT` defaults to `5001` and `CLIENT_ORIGIN` defaults to `http://localhost:5173`.

3. (Optional) Configure a non-default API URL by copying `client/.env.example` to `client/.env` and setting `VITE_API_URL`.

4. Seed MongoDB (this replaces the existing product collection contents):

   ```bash
   npm run seed
   ```

   The seed script connects to the configured MongoDB database and inserts 60 products. It exits with an error if the database cannot be reached.

5. Start the API and Vite client:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:5173](http://localhost:5173). The API listens on [http://localhost:5001](http://localhost:5001). To run either process separately use `npm run dev:server` or `npm run dev:client`.

For a production client build, use `npm run build`. Start the API with `npm start` after setting the production environment variables.

## API

### `GET /api/products`

All query parameters are optional. Defaults: `page=1`, `limit=12`, and `sortBy=recommended`.

| Parameter | Example | Description |
| --- | --- | --- |
| `categories` | `Electronics,Footwear` | Comma-separated category names; a product can match any selected category |
| `minPrice` | `1000` | Inclusive lower price boundary |
| `maxPrice` | `20000` | Inclusive upper price boundary |
| `minRating` | `4` | Minimum rating, from 1 to 5 |
| `sortBy` | `price_asc` | `recommended`, `price_asc`, `price_desc`, or `rating_desc` |
| `page` | `2` | 1-indexed page number |
| `limit` | `12` | Page size from 1 to 100 |

Example:

```text
/api/products?categories=Electronics,Footwear&minPrice=1000&maxPrice=20000&minRating=4&sortBy=price_asc&page=1&limit=12
```

The response includes `success`, `products`, `totalProducts`, `currentPage`, `totalPages`, `limit`, and database-derived `filters`. Filtering is combined with AND across category, price, and rating groups; the selected categories use OR. The service applies MongoDB filtering first, then sort, then skip/limit pagination.

### Other endpoints

- `GET /api/products/filters` — categories and database minimum/maximum product prices
- `GET /api/products/:id` — one product by MongoDB ID; invalid IDs return `400`, missing products return `404`
- `GET /api/health` — API liveness (the server only starts after its MongoDB connection succeeds)

Invalid numeric values, rating ranges, sort options, pagination values, and reversed price ranges return a structured `400` response. Database connectivity errors return `503`; the client does not substitute local or hardcoded inventory.

## Notes

- No actual credentials are committed. `server/.env` is ignored by Git.
- Product cards render the database records returned by the API. Seeded images use Unsplash image URLs and require an internet connection to load.
- Favorite heart controls are presentation-only because wishlists and user accounts are outside the requested product browsing scope.
