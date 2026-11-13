import { ChevronDown } from 'lucide-react';

export default function SortDropdown({ value, onChange }) {
  return <label className="sort-control"><span>Sort by</span><span className="select-wrap"><select value={value} onChange={(event) => onChange(event.target.value)}>
    <option value="recommended">Recommended</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option><option value="rating_desc">Top Rated First</option>
  </select><ChevronDown size={15} /></span></label>;
}
