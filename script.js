const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${movieAPI.API_READ_ACCESS_TOKEN}`
    }
};

let pageNo = 0
let searchPageNo = 0
let inSearch = false // used to switch urls to display content for either search or now playing
let currSearch = ""

const getURL = () => `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${++pageNo}`
const getSearchURL = (movieName) => `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=${++searchPageNo}`

async function fetchMovies(url, options){
    result = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));
    return result
}

function generateCards(movie, grid){
    // create poster image
    const poster = document.createElement("img")
    poster.src = "https://image.tmdb.org/t/p/w342" +  movie.poster_path
    poster.classList.add("movie-poster")
    // incase the poster is not available
    poster.addEventListener("error", () => {
        poster.src = "assets/logo.png"
        poster.style.objectFit = "contain"
    })
    
    // create title element
    const title = document.createElement("p")
    title.classList.add("movie-title")
    title.innerText = movie.title

    // create votes element
    const movieVotes = document.createElement("p")
    movieVotes.classList.add("movie-votes")
    movieVotes.innerText = `⭐️ ${movie.vote_average}`

    const movieCard = document.createElement("div")
    movieCard.classList.add("movie-card")
    movieCard.appendChild(poster)
    movieCard.appendChild(title)
    movieCard.appendChild(movieVotes)
    grid.appendChild(movieCard)
}

function displayMovies(moviesPromise, grid){
    moviesPromise.then(response => {
        const movies = response.results
        // if(inSearch){console.log(movies.length)} // for debugging purposes
        if(movies.length <= 0){

        }
        
         // if we reach the end of the movie list, remove the load more button
        if(pageNo >= response.total_pages || searchPageNo >= response.total_pages){
            document.querySelector("#load-more-movies-btn").remove()
        }
        else if(searchPageNo < response.total_pages){
            loadMoreBtn.style.display = "inline"
        }
        movies.forEach(movie => generateCards(movie, grid))
        
    })
}

moviesPromise = fetchMovies(getURL(), options)
const mainGrid = document.querySelector("#movies-grid")

// display first set of movies
displayMovies(moviesPromise, mainGrid)

const loadMoreBtn = document.querySelector("#load-more-movies-btn")
loadMoreBtn.addEventListener("click", () => {
    url = inSearch ? getSearchURL(currSearch): getURL()
    grid = inSearch ? document.querySelector("#search-grid"): mainGrid
    displayMovies(fetchMovies(url, options), grid)
})

const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault()
    inSearch = true
    const searchedMovie = document.getElementById("search-input")
    currSearch = searchedMovie.value
    searchMoviesPromise = fetchMovies(getSearchURL(searchedMovie.value), options)
    // temporarily remove previous content and load more button
    const mainGrid = document.querySelector("#movies-grid")
    mainGrid.style.display = "none"
    loadMoreBtn.style.display = "none"
    searchForm.style.display = "none"

    // create search grid
    const searchGrid = document.createElement("section")
    searchGrid.classList.add("grid")
    searchGrid.id = "search-grid"
    document.querySelector("#page").insertBefore(searchGrid, loadMoreBtn)
    displayMovies(searchMoviesPromise, searchGrid)
})
