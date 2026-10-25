# ShopEase

ShopEase is a responsive e-commerce frontend portfolio project built with React
and Vite. It currently uses a local product catalogue and client-side Redux
state to demonstrate common shopping flows.

## Features

- Browse a product catalogue with name search, category and price filters, and
  price/rating sorting.
- Open product details with price, rating, stock information, and cart/wishlist
  actions.
- Manage cart quantities, remove items, and see calculated subtotal, shipping,
  and total.
- Save wishlist items and move them into the cart.
- Navigate between home, products, product details, cart, wishlist, login,
  registration, checkout, and orders routes.
- Responsive layouts, loading/error handling for catalogue retrieval, and a
  not-found route.

## Technology

- React
- Vite
- React Router
- Redux Toolkit and React Redux
- Oxlint

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Checks

```sh
npm run lint
npm run build
```

## Current limitations

- Product data is a local mock catalogue; no backend or database is connected.
- Cart, wishlist, and authentication state are held in memory and reset when the
  page reloads.
- Login and registration, protected routes, checkout, payment simulation, order
  submission, and order history are placeholders for later stories.
- No live demo or project screenshots are available yet.
