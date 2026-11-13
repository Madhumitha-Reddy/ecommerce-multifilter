import { Star } from 'lucide-react';

const choices = [1, 2, 3, 4, 5];
export default function RatingFilter({ selected, onChange }) {
  return <div className="filter-options rating-options">
    {choices.map((rating) => <label className="radio-row" key={rating}>
      <input type="radio" name="rating" checked={selected === rating} onChange={() => onChange(selected === rating ? null : rating)} />
      <span className="custom-radio" aria-hidden="true" />
      <span className="rating-stars" aria-label={`${rating} star${rating > 1 ? 's' : ''}`}>
        {Array.from({ length: rating }, (_, index) => <Star key={index} size={13} fill="currentColor" />)}
      </span>
      <span>{rating === 5 ? '5 Stars Only' : `${rating} ${rating === 1 ? 'Star' : 'Stars'} & Above`}</span>
    </label>)}
    {selected && <button className="text-button clear-rating" type="button" onClick={() => onChange(null)}>Clear rating</button>}
  </div>;
}
