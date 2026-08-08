export function unwrap(data) {
  if (!data?.success) throw new Error(data?.message || 'Request failed.');
  return data;
}
