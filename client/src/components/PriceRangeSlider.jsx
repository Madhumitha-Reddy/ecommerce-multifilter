import { useRef } from 'react';

const money = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export default function PriceRangeSlider({ bounds, value, onChange }) {
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const span = Math.max(bounds.maxPrice - bounds.minPrice, 1);
  const minPercent = ((value[0] - bounds.minPrice) / span) * 100;
  const maxPercent = ((value[1] - bounds.minPrice) / span) * 100;

  function updateMinimum(event) {
    const next = Math.min(Number(event.target.value), value[1]);
    onChange([next, value[1]]);
  }
  function updateMaximum(event) {
    const next = Math.max(Number(event.target.value), value[0]);
    onChange([value[0], next]);
  }

  return <div className="price-filter">
    <div className="price-values"><span>₹{money.format(value[0])}</span><span>₹{money.format(value[1])}</span></div>
    <div className="range-control" style={{ '--range-start': `${minPercent}%`, '--range-end': `${maxPercent}%` }}>
      <div className="range-track" />
      <input ref={minRef} type="range" min={bounds.minPrice} max={bounds.maxPrice} step="1" value={value[0]} onChange={updateMinimum} aria-label="Minimum price" />
      <input ref={maxRef} type="range" min={bounds.minPrice} max={bounds.maxPrice} step="1" value={value[1]} onChange={updateMaximum} aria-label="Maximum price" />
    </div>
    <div className="range-labels"><span>₹{money.format(bounds.minPrice)}</span><span>₹{money.format(bounds.maxPrice)}</span></div>
  </div>;
}
