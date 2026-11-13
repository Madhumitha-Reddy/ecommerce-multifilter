import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api', timeout: 12000 });

export async function fetchFilters(signal) {
  const { data } = await api.get('/products/filters', { signal });
  return data.filters;
}

export async function fetchProducts(params, signal) {
  const query = { ...params, categories: params.categories.join(',') };
  const { data } = await api.get('/products', { params: query, signal });
  return data;
}
