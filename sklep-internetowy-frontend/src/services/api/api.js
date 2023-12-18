export async function getProducts() {
  const res = await fetch("http://localhost:3001/produkty");
  const data = await res.json();
  return data;
}
