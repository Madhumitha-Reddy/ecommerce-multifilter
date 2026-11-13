import { useState } from 'react';
import { Heart, Star } from 'lucide-react';

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const fallbackImages = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85',
  Apparel: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
  Footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85'
};

export default function ProductCard({ product }) {
  const [saved, setSaved] = useState(false);
  const [image, setImage] = useState(product.image || fallbackImages[product.category]);
  return <article className="product-card">
    <div className="product-image-wrap"><img src={image} alt={product.name} loading="lazy" onError={() => setImage(fallbackImages[product.category])} />
      <button className={`favorite-button ${saved ? 'is-saved' : ''}`} onClick={() => setSaved(!saved)} aria-label={saved ? 'Remove from saved items' : 'Save item'}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>
      {product.stock < 5 && <span className="stock-badge">Only {product.stock} left</span>}
    </div>
    <div className="product-info"><p className="product-brand">{product.brand}</p><h3 title={product.name}>{product.name}</h3>
      <div className="product-rating"><span className="rating-pill"><Star size={12} fill="currentColor" />{product.rating.toFixed(1)}</span><span className="category-tag">{product.category}</span></div>
      <div className="product-bottom"><span className="product-price">{currency.format(product.price)}</span><span className="delivery-note">Free delivery</span></div>
    </div>
  </article>;
}
