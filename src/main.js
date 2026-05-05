import { searchBooks } from "./utils/api.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "./utils/storage.js";
import { debounce } from "./utils/debounce.js";
import { createBookCard, updateCardFavState } from "./components/BookCard.js";
import { renderFavorites } from "./components/FavoritesList.js";
import { initTheme } from "./components/ThemeManager.js";

let allBooks = [];
let activeAuthor = null;

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsGrid = document.getElementById("resultsGrid");
const statusMsg = document.getElementById("statusMsg");
const filtersBar = document.getElementById("filtersBar");
const authorFilters = document.getElementById("authorFilters");
const clearFilterBtn = document.getElementById("clearFilterBtn");

initTheme();
renderFavorites(getFavorites(), handleRemoveFav);

async function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    authorFilters.innerHTML = "";
    clearBtn.classList.add("d-none");
    showStatus("info", bookshelfSVG(), "Enter a query to start searching");
    return;
  }

  activeAuthor = null;
  showStatus("loading", spinnerHTML(), "Searching…");
  resultsGrid.innerHTML = "";

  try {
    allBooks = await searchBooks(query);
    clearBtn.classList.remove("d-none");
    renderResults(allBooks);
    buildAuthorFilters(allBooks);
  } catch (err) {
    if (err.message === "NO_RESULTS") {
      showStatus(
        "info",
        magnifierSVG(),
        "No books found. Try a different query.",
      );
    } else if (err.message === "EMPTY_QUERY") {
      showStatus("info", bookshelfSVG(), "Enter a query to start searching");
    } else {
      showStatus(
        "error",
        warnSVG(),
        "Network error. Please check your connection and try again.",
      );
    }
    allBooks = [];
    filtersBar.innerHTML = "";
  }
}

const debouncedSearch = debounce(handleSearch, 420);
// const debouncedSearch = handleSearch;

searchInput.addEventListener("input", () => {
  console.log("Input event, value:", searchInput.value);
  !searchInput.value && !searchInput.value.trim()
    ? clearBtn.classList.add("d-none")
    : clearBtn.classList.remove("d-none");
  debouncedSearch();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSearch();
  }
});

searchBtn.addEventListener("click", handleSearch);

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.classList.add("d-none");
  allBooks = [];
  activeAuthor = null;
  filtersBar.innerHTML = "";
  resultsGrid.innerHTML = "";
  showStatus("info", bookshelfSVG(), "Enter a query to start searching");
  searchInput.focus();
});

function renderResults(books) {
  resultsGrid.innerHTML = "";

  if (!books.length) {
    showStatus("info", magnifierSVG(), "No books match this filter.");
    return;
  }

  statusMsg.className = "d-none";
  resultsGrid.className = "books-grid";
  const fragment = document.createDocumentFragment();
  books.forEach((book) => {
    const card = createBookCard(book, handleToggleFav);
    fragment.appendChild(card);
  });
  resultsGrid.appendChild(fragment);
}

function buildAuthorFilters(books) {
  const authorSet = new Set();
  books.forEach((b) => {
    if (b.author_name)
      b.author_name.slice(0, 2).forEach((a) => authorSet.add(a));
  });

  const authors = [...authorSet].slice(0, 10); // cap at 10 chips

  if (authors.length === 0) {
    filtersBar.innerHTML = "";
    return;
  }

  authorFilters.innerHTML = "";
  authors.forEach((author) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = author;
    chip.title = author;
    chip.dataset.author = author;
    chip.addEventListener("click", () => handleAuthorFilter(author, chip));
    authorFilters.appendChild(chip);
  });
}

function handleAuthorFilter(author, chip) {
  if (activeAuthor === author) {
    activeAuthor = null;
    chip.classList.remove("active");
    renderResults(allBooks);
    return;
  }

  activeAuthor = author;
  document
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");

  const filtered = allBooks.filter(
    (b) => b.author_name && b.author_name.includes(author),
  );
  renderResults(filtered);
}

clearFilterBtn.addEventListener("click", () => {
  activeAuthor = null;
  document
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.remove("active"));
  renderResults(allBooks);
});

function handleToggleFav(book, btn) {
  if (isFavorite(book.key)) {
    const updated = removeFavorite(book.key);
    btn.classList.remove("active");
    btn.setAttribute("aria-label", "Add to favorites");
    renderFavorites(updated, handleRemoveFav);
  } else {
    const updated = addFavorite(book);
    btn.classList.add("active");
    btn.setAttribute("aria-label", "Remove from favorites");
    renderFavorites(updated, handleRemoveFav);
  }
}

function handleRemoveFav(key) {
  const updated = removeFavorite(key);
  renderFavorites(updated, handleRemoveFav);
  updateCardFavState(key, false);
}

function showStatus(type, iconHTML, message) {
  statusMsg.className =
    `status-msg ${type === "error" ? "d-flex status-msg--error" : ""}`.trim();
  resultsGrid.className = `d-none`;
  statusMsg.innerHTML = `${iconHTML}<p>${message}</p>`;
}

function spinnerHTML() {
  return '<div class="spinner" role="status" aria-label="Loading"></div>';
}

function bookshelfSVG() {
  return `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <rect x="8"  y="12" width="12" height="40" rx="2" fill="var(--accent)"/>
    <rect x="26" y="12" width="12" height="40" rx="2" fill="var(--accent-muted)"/>
    <rect x="44" y="12" width="12" height="40" rx="2" fill="var(--accent)"/>
  </svg>`;
}

function magnifierSVG() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
    <circle cx="27" cy="27" r="18"/>
    <line x1="40" y1="40" x2="58" y2="58"/>
  </svg>`;
}

function warnSVG() {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="var(--danger)" stroke-width="3" aria-hidden="true">
    <path d="M32 8L58 56H6L32 8z"/>
    <line x1="32" y1="28" x2="32" y2="40"/>
    <circle cx="32" cy="48" r="2" fill="var(--danger)" stroke="none"/>
  </svg>`;
}
