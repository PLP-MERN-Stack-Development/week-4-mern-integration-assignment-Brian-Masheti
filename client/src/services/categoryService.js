const API_URL = 'http://192.168.100.7:5000/api/categories';

// Get all categories
export async function getCategories() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

// Delete a category
export async function deleteCategory(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete category');
  return response.json();
}

// Update a category
export async function updateCategory(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update category');
  return response.json();
}

// Create a new category
export async function createCategory(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
}
