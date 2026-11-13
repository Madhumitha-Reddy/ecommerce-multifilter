export default function LoadingState() {
  return <div className="product-grid" aria-label="Loading products" aria-busy="true">{Array.from({ length: 8 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-image shimmer" /><div className="skeleton-line shimmer short" /><div className="skeleton-line shimmer" /><div className="skeleton-line shimmer medium" /></div>)}</div>;
}
