export default function CategoryFilter({ categories, selected, onChange }) {
  return <div className="filter-options">
    {categories.map((category) => <label className="check-row" key={category}>
      <input type="checkbox" checked={selected.includes(category)} onChange={() => onChange(category)} />
      <span className="custom-check" aria-hidden="true" />
      <span>{category}</span>
    </label>)}
    {!categories.length && <p className="muted small-copy">Categories will appear when products are available.</p>}
  </div>;
}
