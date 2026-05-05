/**
 * components/BookCard.js
 * Creates and returns a book card DOM element.
 */

import { getCoverUrl } from "../utils/api.js";
import { isFavorite } from "../utils/storage.js";

/**
 * @param {Object} book  - raw Open Library doc
 * @param {Function} onToggleFav  - called with (book, button) on click
 * @returns {HTMLElement}
 */
export function createBookCard(book, onToggleFav) {
  const {
    key,
    title = "Unknown Title",
    author_name,
    first_publish_year,
    cover_i,
  } = book;

  const author = author_name ? author_name[0] : "Unknown Author";
  const faved = isFavorite(key);

  const card = document.createElement("article");
  card.className = "book-card";
  card.dataset.key = key;

  // Cover
  const coverWrap = document.createElement("div");
  coverWrap.className = "book-card__cover-wrap";

  if (cover_i) {
    const img = document.createElement("img");
    img.className = "book-card__cover";
    img.src = getCoverUrl(cover_i, "M");
    img.alt = `Cover of ${title}`;
    img.loading = "lazy";
    img.onerror = () => {
      img.replaceWith(noCoverPlaceholder());
    };
    coverWrap.appendChild(img);
  } else {
    coverWrap.appendChild(noCoverPlaceholder());
  }

  // Fav button
  const favBtn = document.createElement("button");
  favBtn.className = `book-card__fav-btn${faved ? " active" : ""}`;
  favBtn.setAttribute(
    "aria-label",
    faved ? "Remove from favorites" : "Add to favorites",
  );
  favBtn.setAttribute(
    "title",
    faved ? "Remove from favorites" : "Add to favorites",
  );
  favBtn.innerHTML = heartSVG();
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    onToggleFav(book, favBtn);
  });
  coverWrap.appendChild(favBtn);

  // Body
  const body = document.createElement("div");
  body.className = "book-card__body";

  const titleEl = document.createElement("h3");
  titleEl.className = "book-card__title";
  titleEl.textContent = title;
  titleEl.title = title;

  const authorEl = document.createElement("p");
  authorEl.className = "book-card__author";
  authorEl.textContent = author;
  authorEl.title = author;

  const yearEl = document.createElement("p");
  yearEl.className = "book-card__year";
  yearEl.textContent = first_publish_year
    ? `Published: ${first_publish_year}`
    : "";

  body.append(titleEl, authorEl, yearEl);
  card.append(coverWrap, body);

  return card;
}

/** Update fav-button state on an existing card */
export function updateCardFavState(key, isFav) {
  const card = document.querySelector(
    `.book-card[data-key="${CSS.escape(key)}"]`,
  );
  if (!card) return;
  const btn = card.querySelector(".book-card__fav-btn");
  if (!btn) return;
  btn.classList.toggle("active", isFav);
  btn.setAttribute(
    "aria-label",
    isFav ? "Remove from favorites" : "Add to favorites",
  );
  btn.title = isFav ? "Remove from favorites" : "Add to favorites";
}

function noCoverPlaceholder() {
  const div = document.createElement("div");
  div.className = "book-card__no-cover";
  div.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <rect x="3" y="2" width="18" height="20" rx="2"/>
      <line x1="7" y1="7" x2="17" y2="7"/>
      <line x1="7" y1="11" x2="17" y2="11"/>
      <line x1="7" y1="15" x2="13" y2="15"/>
    </svg>
    <span>No cover</span>
  `;
  return div;
}

function heartSVG() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`;
}
