import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { addToCart, clearCartMessage, removeFromCart, setCartQuantity } from './store/cartSlice'
import { loadProducts } from './store/productsSlice'
import { toggleWishlist } from './store/wishlistSlice'
import './App.css'

const categories = ['All', 'Men', 'Women', 'Accessories', 'Home']
const currentYear = new Date().getFullYear()

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

function Header() {
  const cartItems = useSelector((state) => state.cart.items)
  const wishlistIds = useSelector((state) => state.wishlist.productIds)
  const location = useLocation()
  const navigate = useNavigate()
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const currentSearch =
    location.pathname === '/products'
      ? new URLSearchParams(location.search).get('q') ?? ''
      : ''

  const submitSearch = (event) => {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('q')?.toString().trim() ?? ''
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products')
  }

  return (
    <header className="topbar">
      <Link className="brand-block" to="/" aria-label="Shopease home">
        <span className="brand-mark">S</span>
        <span>
          <span className="eyebrow">A modern lifestyle shop</span>
          <span className="brand-name">Shopease</span>
        </span>
      </Link>

      <form
        key={`${location.pathname}${location.search}`}
        className="search-box"
        role="search"
        onSubmit={submitSearch}
      >
        <span aria-hidden="true">⌕</span>
        <input
          name="q"
          aria-label="Search products by name"
          type="search"
          defaultValue={currentSearch}
          placeholder="Search essentials"
        />
      </form>

      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/wishlist">Wishlist <span>{wishlistIds.length}</span></NavLink>
        <NavLink to="/cart" className="nav-cart">Cart <span>{cartCount}</span></NavLink>
      </nav>
    </header>
  )
}

function CartFeedback() {
  const dispatch = useDispatch()
  const message = useSelector((state) => state.cart.message)

  if (!message) return null

  return (
    <div className="cart-feedback" role="status">
      <span>{message}</span>
      <button
        type="button"
        aria-label="Dismiss cart message"
        onClick={() => dispatch(clearCartMessage())}
      >
        ×
      </button>
    </div>
  )
}

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const saved = useSelector((state) =>
    state.wishlist.productIds.includes(product.id),
  )
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.productId === product.id),
  )
  const atStockLimit = cartItem?.quantity >= product.stock

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} />
        </Link>
        <span className="badge">{product.badge}</span>
        <button
          type="button"
          className={saved ? 'wishlist-toggle saved' : 'wishlist-toggle'}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={saved}
          onClick={() => dispatch(toggleWishlist(product.id))}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>{product.category}</span>
          <span aria-label={`${product.rating} out of 5 stars`}>★ {product.rating}</span>
        </div>
        <Link className="product-title" to={`/products/${product.id}`}>
          {product.name}
        </Link>
        <p>{product.description}</p>
        <div className="price-row">
          <strong>{formatCurrency(product.price)}</strong>
          <button
            type="button"
            className="add-button"
            disabled={product.stock === 0 || atStockLimit}
            onClick={() =>
              dispatch(addToCart({ productId: product.id, stock: product.stock }))
            }
          >
            {product.stock === 0
              ? 'Out of stock'
              : atStockLimit
                ? 'Stock limit'
                : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}

function ProductGrid({ items }) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">⌕</span>
        <h3>No products found</h3>
        <p>Try another search or adjust your filters to see more products.</p>
        <Link className="secondary-button" to="/products">Browse all products</Link>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {items.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}

function ProductListState({ children }) {
  const { status, error } = useSelector((state) => state.products)

  if (status === 'loading' || status === 'idle') {
    return <div className="page-message" role="status">Loading products…</div>
  }
  if (status === 'failed') {
    return (
      <div className="page-message error-message" role="alert">
        Products could not be loaded: {error}
      </div>
    )
  }
  return children
}

function HomePage() {
  const products = useSelector((state) => state.products.items)

  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow accent">New season arrivals</p>
          <h1>Refresh your everyday essentials.</h1>
          <p>
            Discover thoughtful pieces made for comfort, style, and effortless
            living.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/products">Shop the collection</Link>
            <Link className="secondary-button" to="/wishlist">View wishlist</Link>
          </div>
          <div className="hero-metrics">
            <div><strong>12k+</strong><span>happy shoppers</span></div>
            <div><strong>4.9/5</strong><span>average rating</span></div>
            <div><strong>48h</strong><span>delivery promise</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80"
            alt="A curated selection from the ShopEase collection"
          />
          <div className="floating-card">
            <span>Trending now</span>
            <strong>Summer collection</strong>
            <small>Find your next favorite</small>
          </div>
        </div>
      </section>

      <section className="home-featured" aria-labelledby="featured-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated picks</p>
            <h2 id="featured-heading">Shop the collection</h2>
          </div>
          <Link to="/products" className="text-link">View all products →</Link>
        </div>
        <ProductListState>
          <ProductGrid items={products.slice(0, 3)} />
        </ProductListState>
      </section>
    </main>
  )
}

function ProductsPage() {
  const products = useSelector((state) => state.products.items)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''
  const [category, setCategory] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  const filteredProducts = useMemo(() => {
    const min = minPrice === '' ? Number.NEGATIVE_INFINITY : Number(minPrice)
    const max = maxPrice === '' ? Number.POSITIVE_INFINITY : Number(maxPrice)
    const query = searchQuery.trim().toLocaleLowerCase()
    const result = products.filter((product) =>
      product.name.toLocaleLowerCase().includes(query) &&
      (category === 'All' || product.category === category) &&
      product.price >= min &&
      product.price <= max,
    )

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating-desc') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [category, maxPrice, minPrice, products, searchQuery, sortBy])

  const clearFilters = () => {
    setCategory('All')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('featured')
    setSearchParams({})
  }

  return (
    <main className="page-shell">
      <div className="page-title">
        <div>
          <p className="eyebrow">Find something you love</p>
          <h1>Products</h1>
        </div>
        <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}</span>
      </div>
      <ProductListState>
        <div className="catalog-layout">
          <aside className="filter-panel" aria-label="Product filters">
            <div className="filter-title">
              <h2>Filters</h2>
              <button type="button" className="text-button" onClick={clearFilters}>Clear all</button>
            </div>
            <label className="field-label" htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <fieldset className="price-filter">
              <legend>Price range</legend>
              <div className="price-inputs">
                <label>
                  <span>Min</span>
                  <input
                    type="number"
                    min="0"
                    aria-label="Minimum price"
                    placeholder="$0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                  />
                </label>
                <label>
                  <span>Max</span>
                  <input
                    type="number"
                    min="0"
                    aria-label="Maximum price"
                    placeholder="No limit"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                  />
                </label>
              </div>
              {minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice) && (
                <p className="field-error" role="alert">Minimum price must be less than maximum price.</p>
              )}
            </fieldset>
            <label className="field-label" htmlFor="sort-products">Sort by</label>
            <select
              id="sort-products"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating-desc">Rating: high to low</option>
            </select>
            <div className="promo-box">
              <p className="panel-label">Member offer</p>
              <h3>Free shipping over $200</h3>
              <p>Enjoy complimentary delivery on qualifying orders.</p>
            </div>
          </aside>

          <section className="catalog-panel" aria-label="Product results">
            {searchQuery && (
              <div className="search-summary">
                <span>Results for “{searchQuery}”</span>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setSearchParams({})}
                >
                  Clear search
                </button>
              </div>
            )}
            <ProductGrid items={filteredProducts} />
          </section>
        </div>
      </ProductListState>
    </main>
  )
}

function ProductDetailsPage() {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const product = useSelector((state) =>
    state.products.items.find((item) => item.id === Number(productId)),
  )
  const status = useSelector((state) => state.products.status)
  const saved = useSelector((state) =>
    state.wishlist.productIds.includes(Number(productId)),
  )
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.productId === Number(productId)),
  )

  if (status === 'loading' || status === 'idle') {
    return <main className="page-message" role="status">Loading product…</main>
  }
  if (status === 'failed') {
    return <main className="page-message error-message" role="alert">Product details could not be loaded.</main>
  }
  if (!product) {
    return (
      <main className="page-message not-found-product">
        <p className="eyebrow">Product unavailable</p>
        <h1>We couldn’t find that product.</h1>
        <p>It may have been removed or the link may be incorrect.</p>
        <Link className="primary-button" to="/products">Back to products</Link>
      </main>
    )
  }

  const atStockLimit = cartItem?.quantity >= product.stock

  return (
    <main className="page-shell">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span><span>{product.name}</span>
      </nav>
      <section className="detail-card">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
          <span className="badge">{product.badge}</span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-rating" aria-label={`${product.rating} out of 5 stars`}>
            <span>★ {product.rating}</span> <span>Customer rating</span>
          </p>
          <strong className="detail-price">{formatCurrency(product.price)}</strong>
          <p className="detail-description">{product.description}</p>
          <p className={product.stock > 0 ? 'stock-status' : 'stock-status out-of-stock'}>
            <span aria-hidden="true">{product.stock > 0 ? '●' : '●'}</span>
            {product.stock > 0 ? `${product.stock} in stock` : 'Currently out of stock'}
          </p>
          <div className="detail-actions">
            <button
              type="button"
              className="primary-button"
              disabled={product.stock === 0 || atStockLimit}
              onClick={() =>
                dispatch(addToCart({ productId: product.id, stock: product.stock }))
              }
            >
              {product.stock === 0 ? 'Out of stock' : atStockLimit ? 'Stock limit reached' : 'Add to cart'}
            </button>
            <button
              type="button"
              className="secondary-button"
              aria-pressed={saved}
              onClick={() => dispatch(toggleWishlist(product.id))}
            >
              {saved ? '♥ Saved to wishlist' : '♡ Add to wishlist'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

function CartPage() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const cart = useSelector((state) => state.cart.items)
  const cartItems = cart.flatMap((entry) => {
    const product = products.find((item) => item.id === entry.productId)
    return product ? [{ ...product, quantity: entry.quantity }] : []
  })
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 || subtotal > 200 ? 0 : 18

  return (
    <main className="page-shell">
      <div className="page-title">
        <div><p className="eyebrow">Ready when you are</p><h1>Your cart</h1></div>
        <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
      </div>
      {cartItems.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">🛍</span>
          <h2>Your cart is empty</h2>
          <p>Explore the collection and add something you love.</p>
          <Link className="primary-button" to="/products">Browse products</Link>
        </div>
      ) : (
        <div className="cart-page-layout">
          <section className="cart-list" aria-label="Cart items">
            {cartItems.map((item) => (
              <article className="cart-line" key={item.id}>
                <Link to={`/products/${item.id}`}><img src={item.image} alt={item.name} /></Link>
                <div className="cart-line-info">
                  <Link to={`/products/${item.id}`}>{item.name}</Link>
                  <span>{formatCurrency(item.price)} · {item.stock} in stock</span>
                  <button type="button" className="text-button remove-button" onClick={() => dispatch(removeFromCart(item.id))}>
                    Remove
                  </button>
                </div>
                <div className="quantity-controls" aria-label={`Quantity for ${item.name}`}>
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name} quantity`}
                    onClick={() => dispatch(setCartQuantity({
                      productId: item.id,
                      quantity: item.quantity - 1,
                      stock: item.stock,
                    }))}
                  >−</button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.name} quantity`}
                    disabled={item.quantity >= item.stock}
                    onClick={() => dispatch(setCartQuantity({
                      productId: item.id,
                      quantity: item.quantity + 1,
                      stock: item.stock,
                    }))}
                  >+</button>
                </div>
                <strong className="line-total">{formatCurrency(item.price * item.quantity)}</strong>
              </article>
            ))}
          </section>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div><span>Shipping</span><strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong></div>
            {subtotal > 0 && subtotal <= 200 && (
              <p className="shipping-hint">Add {formatCurrency(201 - subtotal)} more for free shipping.</p>
            )}
            <div className="summary-total"><span>Total</span><strong>{formatCurrency(subtotal + shipping)}</strong></div>
            <Link className="checkout-button" to="/checkout">Continue to checkout</Link>
            <Link className="text-link continue-shopping" to="/products">Continue shopping</Link>
          </aside>
        </div>
      )}
    </main>
  )
}

function WishlistPage() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const wishlistIds = useSelector((state) => state.wishlist.productIds)
  const cart = useSelector((state) => state.cart.items)
  const wishlistItems = wishlistIds.flatMap((id) => {
    const product = products.find((item) => item.id === id)
    return product ? [product] : []
  })

  const moveToCart = (product) => {
    const currentQuantity = cart.find((item) => item.productId === product.id)?.quantity ?? 0
    if (product.stock > currentQuantity) {
      dispatch(addToCart({ productId: product.id, stock: product.stock }))
      dispatch(toggleWishlist(product.id))
    }
  }

  return (
    <main className="page-shell">
      <div className="page-title">
        <div><p className="eyebrow">Saved for later</p><h1>Your wishlist</h1></div>
        <span>{wishlistItems.length} saved</span>
      </div>
      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">♡</span>
          <h2>Your wishlist is waiting</h2>
          <p>Save products you love and they’ll be ready for you here.</p>
          <Link className="primary-button" to="/products">Explore products</Link>
        </div>
      ) : (
        <div className="product-grid wishlist-grid">
          {wishlistItems.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <Link to={`/products/${product.id}`}><img src={product.image} alt={product.name} /></Link>
                <button type="button" className="wishlist-toggle saved" aria-label={`Remove ${product.name} from wishlist`} onClick={() => dispatch(toggleWishlist(product.id))}>♥</button>
              </div>
              <div className="product-info">
                <div className="product-meta"><span>{product.category}</span><span>★ {product.rating}</span></div>
                <Link className="product-title" to={`/products/${product.id}`}>{product.name}</Link>
                <p>{product.description}</p>
                <div className="price-row">
                  <strong>{formatCurrency(product.price)}</strong>
                  <button
                    type="button"
                    className="add-button"
                    disabled={product.stock === 0 || (cart.find((item) => item.productId === product.id)?.quantity ?? 0) >= product.stock}
                    onClick={() => moveToCart(product)}
                  >
                    {product.stock === 0 ? 'Out of stock' : 'Move to cart'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

function InformationalPage({ title, description, link, linkLabel }) {
  return (
    <main className="page-message">
      <p className="eyebrow">Coming in the next story</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className="primary-button" to={link}>{linkLabel}</Link>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="page-message">
      <p className="eyebrow">404 · Page not found</p>
      <h1>This page isn’t here.</h1>
      <p>Check the address or return to the ShopEase home page.</p>
      <Link className="primary-button" to="/">Go home</Link>
    </main>
  )
}

function AppLayout() {
  const dispatch = useDispatch()
  const status = useSelector((state) => state.products.status)

  useEffect(() => {
    if (status === 'idle') dispatch(loadProducts())
  }, [dispatch, status])

  return (
    <div className="shop-app">
      <Header />
      <CartFeedback />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<InformationalPage title="Welcome back" description="Customer login will be available with the authentication story." link="/register" linkLabel="Create an account" />} />
        <Route path="/register" element={<InformationalPage title="Join ShopEase" description="Account registration will be available with the authentication story." link="/login" linkLabel="Already have an account? Log in" />} />
        <Route path="/checkout" element={<InformationalPage title="Checkout" description="Checkout and simulated order placement will be implemented in US-09." link="/cart" linkLabel="Return to cart" />} />
        <Route path="/orders" element={<InformationalPage title="Your orders" description="Order history will be available after customer accounts and order APIs are implemented." link="/products" linkLabel="Continue shopping" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="site-footer">
        <span>© {currentYear} ShopEase</span>
        <span>Thoughtful finds for everyday living.</span>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
