export async function getProducts() {
  const res = await fetch("http://localhost:3001/produkty");
  const data = await res.json();
  return data;
}

export async function getSizes(productName) {
  try {
    const response = await fetch(
      `http://localhost:3001/produkty/${productName}/rozmiary`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return [];
  }
}
