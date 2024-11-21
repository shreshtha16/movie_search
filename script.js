const API_KEY = "ff23e7";
const API_URL = "https://www.omdbapi.com/";
const searchInput = document.getElementById("search-input");
const moviesContainer = document.getElementById("movies-container");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

let currentQuery = "";
let currentPage = 1;
let totalResults = 0;

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

async function fetchMovies(query, page = 1) {
  const url = `${API_URL}?apikey=${API_KEY}&s=${query}&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function renderMovies(movies) {
  moviesContainer.innerHTML = movies
    .map(
      (movie) => `
    <div class="movie-card">
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    </div>`
    )
    .join("");
}

function updatePagination() {
  pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(totalResults / 10)}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= Math.ceil(totalResults / 10);
}

async function searchMovies(query) {
  if (!query) {
    moviesContainer.innerHTML = "<p>Please enter a search query.</p>";
    return;
  }

  const data = await fetchMovies(query, currentPage);
  if (data.Response === "True") {
    totalResults = parseInt(data.totalResults, 10);
    renderMovies(data.Search);
    updatePagination();
  } else {
    moviesContainer.innerHTML = `<p>${data.Error}</p>`;
  }
}

searchInput.addEventListener(
  "input",
  debounce((e) => {
    currentQuery = e.target.value.trim();
    currentPage = 1;
    searchMovies(currentQuery);
  }, 500)
);

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    searchMovies(currentQuery);
  }
});

nextPageBtn.addEventListener("click", () => {
  if (currentPage < Math.ceil(totalResults / 10)) {
    currentPage++;
    searchMovies(currentQuery);
  }
});
