// Api url
const KEY = "ee793e36b0b7a0ed13af01890f5dab32";
const TRENDING = `https://api.themoviedb.org/3/trending/movie/week?api_key=${KEY}&language=en-US`;
const TOPRATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${KEY}&language=en-US`;
const UPCOMING = `https://api.themoviedb.org/3/movie/upcoming?api_key=${KEY}&language=en-US`;

const getMovies = async (searchTerm, page = 1) => {// la respuesta es de a 20 peliculas suempre
  const response = await fetch(`${searchTerm}&page=${page}`);// luego agrego termino de pagina en url e query param

  const data = await response.json();
  console.log('data ==> ', data);
  return data;
}
