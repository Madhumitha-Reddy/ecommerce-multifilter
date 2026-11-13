import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService.js';

export function useProducts(filters, page, priceReady) {
  const [result, setResult] = useState({ products: [], totalProducts: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!priceReady) return undefined;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetchProducts({ ...filters, page, limit: 12 }, controller.signal)
      .then((data) => setResult(data))
      .catch((requestError) => {
        if (requestError.name === 'CanceledError' || requestError.code === 'ERR_CANCELED') return;
        setError(requestError.response?.data?.message || 'Unable to load products. Check that the API and database are running.');
        setResult({ products: [], totalProducts: 0, totalPages: 0 });
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [filters, page, priceReady]);

  return { ...result, loading, error };
}
