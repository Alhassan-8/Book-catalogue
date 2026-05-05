import { getCoverUrl } from "../utils/api.js";

export function renderFavorites(favorites, onRemove) {
  const list = document.getElementById("favList");
  const empty = document.getElementById("favEmpty");
  const count = document.getElementById("favCount");

  count.textContent = favorites.length;
  list.innerHTML = "";

  if (favorites.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  favorites.forEach((book) => {
    const item = createFavItem(book, onRemove);
    list.appendChild(item);
  });
}

function createFavItem(book, onRemove) {
  const { key, title = "Unknown Title", author_name, cover_i } = book;
  const author = author_name ? author_name[0] : "Unknown Author";

  const li = document.createElement("li");
  li.className = "fav-item";
  li.dataset.key = key;

  const img = document.createElement("img");
  img.className = "fav-item__thumb";
  img.alt = title;
  img.loading = "lazy";
  if (cover_i) {
    img.src = getCoverUrl(cover_i, "S");
    img.onerror = () => {
      img.src = "";
      img.style.background = "var(--surface-alt)";
    };
  } else {
    img.src = "";
    img.style.background = "var(--surface-alt)";
  }

  const info = document.createElement("div");
  info.className = "fav-item__info";

  const titleEl = document.createElement("p");
  titleEl.className = "fav-item__title";
  titleEl.textContent = title;
  titleEl.title = title;

  const authorEl = document.createElement("p");
  authorEl.className = "fav-item__author";
  authorEl.textContent = author;

  info.append(titleEl, authorEl);

  const removeBtn = document.createElement("button");
  removeBtn.className = "fav-item__remove";
  removeBtn.setAttribute("aria-label", `Remove ${title} from favorites`);
  removeBtn.title = "Remove";
  removeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>`;
  removeBtn.addEventListener("click", () => onRemove(key));

  li.append(img, info, removeBtn);
  return li;
}
