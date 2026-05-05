const BASE_URL = "https://openlibrary.org/search.json";
const COVER_URL = "https://covers.openlibrary.org/b/id";

export async function searchBooks(query, limit = 20) {
  // if (!query || !query.trim()) {
  //   throw new Error('EMPTY_QUERY');
  // }

  const params = new URLSearchParams({
    q: query.trim(),
    fields: "key,title,author_name,first_publish_year,cover_i",
    limit: String(limit),
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.docs || data.docs.length === 0) {
    throw new Error("NO_RESULTS");
  }

  return data.docs;
}

export function getCoverUrl(coverId, size = "M") {
  return `${COVER_URL}/${coverId}-${size}.jpg`;
}
