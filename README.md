# Simple Books Catalogue

A small web application that lets you search for books by title or author using the Open Library API, view results as cards, and manage a personal favorites list.

---

## Task

[View the full assignment document](https://drive.google.com/file/d/1swszcMU9rF_-zRJaA2VchPuU_d7yrAbs/view?usp=sharing)

---

## How to run the app

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)

### Development server

```bash
# Install dependencies
npm install

# Start the dev server (opens http://localhost:3000 automatically)
npm run dev
```

### Production build

```bash
# Build optimised output to /dist
npm run build

# Preview the production build locally
npm run preview
```

The production build outputs **three files** inside `dist/`:

| File               | Description                    |
| ------------------ | ------------------------------ |
| `index.html`       | Entry point HTML               |
| `assets/app.js`    | All JavaScript (single bundle) |
| `assets/style.css` | All CSS (single stylesheet)    |

---

## Folder structure

```
books-catalogue/
├── index.html              # App shell / entry point
├── vite.config.js          # Vite bundler configuration
├── package.json            # Project metadata & scripts
├── README.md               # This file
├── public/
│   └── favicon.svg         # Browser tab icon
└── src/
    ├── main.js             # Application entry — wires up all modules
    ├── styles/
    │   └── main.css        # Global styles, CSS variables, theme tokens
    ├── components/
    │   ├── BookCard.js     # Book card DOM factory + fav-state helper
    │   ├── FavoritesList.js # favorites sidebar renderer
    │   └── ThemeManager.js # Theme pill switcher (Light / Dark / Sepia)
    └── utils/
        ├── api.js          # Open Library API fetch helpers
        ├── storage.js      # localStorage read/write for favorites & theme
        └── debounce.js     # Generic debounce utility
```

### Directory descriptions

| Directory / File  | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `src/components/` | UI components — each file owns one piece of the interface        |
| `src/utils/`      | Pure utility modules with no DOM dependencies                    |
| `src/styles/`     | All CSS, including three colour themes via CSS custom properties |
| `public/`         | Static assets served as-is (favicon, future icons)               |

---

## Features

- **Book search** — query the Open Library API by title, author, or keyword
- **On-the-fly search** — results update automatically as you type (debounced)
- **Book cards** — cover image, title, author, year, and add-to-favorites button
- **Favorites** — persisted in `localStorage`; survive page reloads
- **Author filter** — chip buttons to filter results by author
- **Theme switcher** — Light, Dark, and Sepia themes, persisted in `localStorage`
- **Responsive layout** — adapts to desktop and mobile viewports
- **API states handled** — Loading spinner, empty query prompt, no results, network error
