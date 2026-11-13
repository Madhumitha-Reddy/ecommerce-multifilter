import { SearchX } from 'lucide-react';

export default function EmptyState({ onReset }) {
  return <div className="empty-state"><div className="empty-icon"><SearchX size={27} /></div><h2>No items match your criteria.</h2><p>Try widening your price range or clearing a filter to see more.</p><button className="primary-button" onClick={onReset}>Reset Filters</button></div>;
}
