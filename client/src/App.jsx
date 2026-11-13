import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, Menu, PackageSearch, RotateCcw, Sparkles } from 'lucide-react';
import FilterSidebar from './components/FilterSidebar.jsx';
import SortDropdown from './components/SortDropdown.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import LoadingState from './components/LoadingState.jsx';
import EmptyState from './components/EmptyState.jsx';
import { fetchFilters } from './services/productService.js';
import { useProducts } from './hooks/useProducts.js';

export default function App() {
  const [metadata, setMetadata] = useState(null);
  const [filtersError, setFiltersError] = useState('');
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState([0, 0]);
  const [rating, setRating] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [page, setPage] = useState(1);
  const [priceReady, setPriceReady] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const bounds = metadata || { minPrice: 0, maxPrice: 0, categories: [] };

  useEffect(() => {
    const controller = new AbortController();
    fetchFilters(controller.signal).then((data) => {
      setMetadata(data);
      setPrice([data.minPrice, data.maxPrice]);
      setPriceReady(true);
    }).catch((error) => {
      if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') setFiltersError(error.response?.data?.message || 'Could not connect to the product catalog.');
    });
    return () => controller.abort();
  }, []);

  const filters = useMemo(() => {
    const fullPriceRange = price[0] === bounds.minPrice && price[1] === bounds.maxPrice;
    return { categories, minPrice: fullPriceRange ? undefined : price[0], maxPrice: fullPriceRange ? undefined : price[1], minRating: rating ?? undefined, sortBy };
  }, [categories, price, bounds.minPrice, bounds.maxPrice, rating, sortBy]);
  const { products, totalProducts, totalPages, loading, error } = useProducts(filters, page, priceReady);

  function resetFilters() {
    setCategories([]);
    setPrice([bounds.minPrice, bounds.maxPrice]);
    setRating(null);
    setSortBy('recommended');
    setPage(1);
    setMobileFiltersOpen(false);
  }
  function toggleCategory(category) {
    setCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
    setPage(1);
  }
  function changePrice(next) {
    setPrice(next);
    setPage(1);
    setPriceReady(false);
    window.clearTimeout(window.priceFilterTimer);
    window.priceFilterTimer = window.setTimeout(() => setPriceReady(true), 260);
  }

  const displayError = filtersError || error;
  const catalogReady = Boolean(metadata);
  return <div className="app-shell">
    <div className="announcement"><Sparkles size={13} /> Find your everyday favorites, all in one place <ArrowUpRight size={13} /></div>
    <header className="site-header"><a className="wordmark" href="#top"><span className="brand-mark">c.</span> commonplace</a><nav className="desktop-nav"><a className="nav-active" href="#catalog">Shop all</a><a href="#catalog">New arrivals</a><a href="#catalog">Our edit</a></nav><div className="header-right"><span className="header-tagline">A little good, every day.</span><button className="mobile-filter-trigger" onClick={() => setMobileFiltersOpen(true)}><Menu size={17} /> Filters</button></div></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span /> THE EVERYDAY EDIT</div><h1>Good things.<br /><em>Well chosen.</em></h1><p>Considered essentials for the way you live, work, and wander. Find something you'll reach for every day.</p><a className="hero-link" href="#catalog" onClick={(event) => { event.preventDefault(); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.history.replaceState(null, '', '#catalog'); }}>Explore the collection <ArrowDown size={15} /></a></div><div className="hero-art"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=85" alt="A warm, thoughtfully styled retail space"/><div className="hero-art-label"><span>THE COMMONPLACE COLLECTION</span><strong>Made for real life.</strong></div><span className="hero-number">01 <i>/ 03</i></span></div></section>
      <div className="collection-ribbon"><div><span className="ribbon-icon"><PackageSearch size={17} /></span><span>Thoughtfully picked. Ready for you.</span></div><div className="ribbon-side">Free shipping on orders over ₹2,000 <span>✳</span></div></div>
      <section className="catalog-layout" id="catalog">
        <FilterSidebar categories={bounds.categories || []} selectedCategories={categories} onCategory={toggleCategory} bounds={bounds} price={price} onPrice={changePrice} rating={rating} onRating={(value) => { setRating(value); setPage(1); }} onReset={resetFilters} open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} />
        <div className="catalog-main"><div className="catalog-heading"><div><p className="eyebrow catalog-eyebrow">FIND YOUR NEXT FAVORITE</p><h2>Shop the collection</h2><p className="catalog-subtitle">Everyday essentials, chosen with care.</p></div><div className="catalog-controls"><button className="mobile-filter-trigger in-catalog" onClick={() => setMobileFiltersOpen(true)}><Menu size={16} /> Filters</button><SortDropdown value={sortBy} onChange={(value) => { setSortBy(value); setPage(1); }} /></div></div>
          <div className="results-row"><p>{loading ? <span className="muted">Finding your picks…</span> : <><strong>{totalProducts.toLocaleString('en-IN')}</strong> {totalProducts === 1 ? 'item' : 'items'}<span className="results-dot">·</span><span>Updated just for you</span></>}</p><span className="results-decoration"><span /> LIVE CATALOG</span></div>
          {!catalogReady && !displayError ? <LoadingState /> : displayError ? <div className="error-state"><div className="empty-icon"><RotateCcw size={24} /></div><h2>We couldn't reach the catalog.</h2><p>{displayError}</p><button className="primary-button" onClick={() => window.location.reload()}>Try again</button></div> : loading ? <LoadingState /> : products.length ? <ProductGrid products={products} /> : <EmptyState onReset={resetFilters} />}
          {!loading && !displayError && totalPages > 1 && <div className="pagination"><button disabled={page <= 1} onClick={() => { setPage((current) => current - 1); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}>← Previous</button><span>Page <strong>{page}</strong> of {totalPages}</span><button disabled={page >= totalPages} onClick={() => { setPage((current) => current + 1); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); }}>Next <ArrowUpRight size={14} /></button></div>}
        </div>
      </section>
      <section className="closing-banner"><span className="closing-sparkle">✳</span><div><p>THE THOUGHTFUL WAY TO SHOP</p><h2>Less scrolling. More finding.</h2></div><span className="closing-note">A good thing is just around the corner.</span></section>
    </main>
    <footer className="site-footer"><a className="wordmark" href="#top"><span className="brand-mark">c.</span> commonplace</a><span>Good things, for everyday.</span><span>© 2026 Commonplace Market</span></footer>
  </div>;
}
