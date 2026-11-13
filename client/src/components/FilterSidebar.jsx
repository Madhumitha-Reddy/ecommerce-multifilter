import { SlidersHorizontal, X } from 'lucide-react';
import CategoryFilter from './CategoryFilter.jsx';
import PriceRangeSlider from './PriceRangeSlider.jsx';
import RatingFilter from './RatingFilter.jsx';

export default function FilterSidebar({ categories, selectedCategories, onCategory, bounds, price, onPrice, rating, onRating, onReset, open, onClose }) {
  return <>
    {open && <button className="drawer-scrim" onClick={onClose} aria-label="Close filters" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-heading"><div><SlidersHorizontal size={17} /><h2>Filters</h2></div><button className="icon-button drawer-close" onClick={onClose} aria-label="Close filters"><X size={19} /></button></div>
      <section className="filter-section"><div className="section-title"><h3>Category</h3><span className="section-count">{selectedCategories.length || 'All'}</span></div><CategoryFilter categories={categories} selected={selectedCategories} onChange={onCategory} /></section>
      <section className="filter-section"><div className="section-title"><h3>Price range</h3></div><PriceRangeSlider bounds={bounds} value={price} onChange={onPrice} /></section>
      <section className="filter-section"><div className="section-title"><h3>Customer rating</h3></div><RatingFilter selected={rating} onChange={onRating} /></section>
      <button className="reset-sidebar" type="button" onClick={onReset}>Reset all filters</button>
      <div className="sidebar-note"><span className="note-dot" /> Curated for everyday living</div>
    </aside>
  </>;
}
