import { useMemo, useState } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Aero Lite Sneaker',
    category: 'Men',
    price: 119,
    rating: 4.8,
    badge: 'Best seller',
    description: 'Lightweight comfort built for daily movement.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Urban Drift Tote',
    category: 'Accessories',
    price: 74,
    rating: 4.7,
    badge: 'New',
    description: 'Roomy, refined storage for work and weekends.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Luna Knit Set',
    category: 'Women',
    price: 146,
    rating: 4.9,
    badge: 'Trending',
    description: 'Soft layering essentials in a relaxed silhouette.',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Marlow Ceramic Vase',
    category: 'Home',
    price: 58,
    rating: 4.6,
    badge: 'Limited',
    description: 'A sculptural accent for shelves and tablescapes.',
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Summit Trail Jacket',
    category: 'Men',
    price: 189,
    rating: 4.9,
    badge: 'Hot',
    description: 'Weather-ready layering with relaxed comfort.',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Coco Daydream Dress',
    category: 'Women',
    price: 132,
    rating: 4.8,
    badge: 'Editor’s pick',
    description: 'An easy silhouette with elevated everyday polish.',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  },
]

const categories = ['All', 'Men', 'Women', 'Accessories', 'Home']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([
    { id: 1, quantity: 1 },
    { id: 4, quantity: 2 },
  ])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [search, selectedCategory])

  const cartItems = cart
    .map((item) => ({
      ...products.find((product) => product.id === item.id),
      quantity: item.quantity,
    }))
    .filter(Boolean)

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const shipping = subtotal > 200 ? 0 : 18
  const total = subtotal + shipping

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id)

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { id: product.id, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  return (
    <div className="shop-app">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">A modern lifestyle shop</p>
            <h1>Shopease</h1>
          </div>
        </div>

        <label className="search-box" aria-label="Search products">
          <span>⌕</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search essentials"
          />
        </label>

        <button type="button" className="cart-button" aria-label="Shopping cart">
          Cart
          <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
      </header>

      <main className="page-shell">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow accent">New season arrivals</p>
            <h2>Refresh your everyday essentials.</h2>
            <p>
              Discover premium pieces made for comfort, style, and effortless
              living.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-button">
                Shop new arrivals
              </button>
              <button type="button" className="secondary-button">
                Explore offers
              </button>
            </div>
            <div className="hero-metrics">
              <div>
                <strong>12k+</strong>
                <span>happy shoppers</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>average rating</span>
              </div>
              <div>
                <strong>48h</strong>
                <span>delivery promise</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Featured product image">
            <img
              src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80"
              alt="Featured lifestyle product"
            />
            <div className="floating-card">
              <span>Trending now</span>
              <strong>Summer collection</strong>
              <small>Up to 30% off</small>
            </div>
          </div>
        </section>

        <section className="catalog-layout">
          <aside className="filter-panel">
            <p className="panel-label">Browse by category</p>
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    category === selectedCategory ? 'category active' : 'category'
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="promo-box">
              <p className="panel-label">Member offer</p>
              <h3>Free shipping over $200</h3>
              <p>Enjoy exclusive drops and early access to new arrivals.</p>
            </div>
          </aside>

          <section className="catalog-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Curated picks</p>
                <h3>{selectedCategory} collection</h3>
              </div>
              <span>{filteredProducts.length} items</span>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} />
                    <span className="badge">{product.badge}</span>
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span>{product.category}</span>
                      <span>★ {product.rating}</span>
                    </div>
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <div className="price-row">
                      <strong>{formatCurrency(product.price)}</strong>
                      <button
                        type="button"
                        className="add-button"
                        onClick={() => addToCart(product)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-panel">
            <div className="cart-header">
              <p className="panel-label">Your cart</p>
              <span>{cartItems.length} items</span>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Your bag is empty.</p>
                <small>Add a few favorites to get started.</small>
              </div>
            ) : (
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-copy">
                      <strong>{item.name}</strong>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                    <div className="quantity-controls">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="totals">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong>
              </div>
              <div className="grand-total">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>

            <button type="button" className="checkout-button">
              Proceed to checkout
            </button>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
