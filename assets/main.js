// Elementos DOM
const btnContainer = document.querySelector(".pagination");
const prevBTN = document.querySelector(".left");
const nextBTN = document.querySelector(".right");
const cardsContainer = document.querySelector(".cards-container");
const pageNumber = document.querySelector(".page-number");
const filterButtons = document.querySelectorAll(".btn");  // Todos los botones tienen un atributo data-filter
const filterContaiener = document.querySelector(".filter-container");

const ImgBaseUrl = "https://image.tmdb.org/t/p/original";  // URL base para las imágenes

// Estado de la aplicación
const appState = {
  page: null,
  total: null,
  searchParameter: TRENDING,  // Parámetro de búsqueda predeterminado, se actualiza al seleccionar diferentes categorías
};

// Función para mostrar un indicador de carga (loader ring) mientras se obtienen y renderizan las películas
const renderLoader = () => {
  return `   
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `;
};

// Plantilla para crear la estructura HTML de una card
const createCardTemplate = (movie) => {
  const { poster_path, title, vote_average, release_date } = movie;  // Desestructuración de la película
  return `
    <div class="card">
      <img loading="lazy" src="${poster_path ? ImgBaseUrl + poster_path : './assets/img/placeholder.png'}" alt="${title}" class="card-img" />
      <div class="card-popularity">${formatVoteAverage(vote_average)}% de popularidad</div>
      <div class="card-content">
          <h2>${title}</h2>
          <p>Fecha de estreno: ${formatDate(release_date)}</p>
      </div>
    </div>
  `;
};

// Función para renderizar las cards de películas en el contenedor
const renderCards = (movies) => {
  cardsContainer.innerHTML = movies.map(movie => createCardTemplate(movie)).join('');
};

// Función para cargar y mostrar las tarjetas con un retraso y desplazamiento suave con scroll desde arriba
const loadAndShow = (movies) => {
  setTimeout(() => {
    renderCards(movies.results);
    filterContaiener.scrollIntoView({
      behavior: 'smooth',
    });
  }, 1500);
};


// Función principal para obtener y mostrar películas
const showMovies = async () => {
  cardsContainer.innerHTML = renderLoader();  // Muestra el indicador de carga
  const movies = await getMovies(appState.searchParameter);  // Obtiene las películas de la API
  appState.total = movies.total_pages;
  appState.page = movies.page;
  setPaginationState();  // Actualiza el número de página
  loadAndShow(movies);  // Muestra las tarjetas con un retraso
};


// Función para actualizar el número de página en la interfaz
const setPaginationState = () => {
  pageNumber.innerHTML = appState.page;
};

// Funciones para cambiar de página (paginación)
const changePage = async () => {
  cardsContainer.innerHTML = renderLoader();  // Muestra el indicador de carga al cambiar de página
  const movies = await getMovies(appState.searchParameter, appState.page);
  setPaginationState();//actualizo num de pagina
  loadAndShow(movies);
};


// Funciones para avanzar y retroceder páginas
const nextPage = () => {
  if (appState.page === appState.total) return;
  appState.page++;
  changePage();
};

const previousPage = () => {
  if (appState.page === 1) return;
  appState.page--;
  changePage();
};

// Función para seleccionar el parámetro de búsqueda según el botón activado en menu sup
const parameterSelector = (selectedParameter) => {
  return selectedParameter === 'TOPRATED'
    ? TOPRATED
    : selectedParameter === 'UPCOMING'
      ? UPCOMING
      : TRENDING;
};

// Función para establecer el estilo activo en el botón seleccionado y actualizar el estado de búsqueda
const setActiveButton = (selectedParameter) => {
  const buttons = [...filterButtons];

  buttons.forEach((btn) => {
    if (btn.dataset.filter === selectedParameter) {
      btn.classList.add('btn--active');
    } else {
      btn.classList.remove('btn--active');
    }
  });
};

// Función para cambiar el parámetro de búsqueda al hacer clic en un botón
const changeSearchParameter = (e) => {
  if (!e.target.classList.contains('btn') && !e.target.classList.contains('btn--active')) return;// si no estoy apretando un button
  const selectedParameter = e.target.dataset.filter;
  appState.searchParameter = parameterSelector(selectedParameter);// cambio en el appstate deacuerdo a lo devuelto ne parameterSelector
  setActiveButton(selectedParameter);
  showMovies();
};

// Funciones de formato de datos
const formatVoteAverage = (vote) => {
  return Math.floor(vote * 10);
};

const formatDate = (date) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};


const init = async () => {
  window.addEventListener("DOMContentLoaded", showMovies);  // Cuando la ventana se carga, muestra las películas
  nextBTN.addEventListener('click', nextPage);
  prevBTN.addEventListener('click', previousPage);
  filterContaiener.addEventListener('click', changeSearchParameter);
};

init(); 
