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
    poster.alt = `${movie.title} poster`
    // poster.setAttribute()
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

    movieCard.onclick = ((e) => {
        console.log(e.target)
    })
}

function displayMovies(moviesPromise, grid){
    moviesPromise.then(response => {
        const movies = response.results

        console.log(movies.length)
        // empty movie screen
        if(movies.length <= 0){
            const sadFace = document.createElement("h1")
            sadFace.id = "sad-face"
            sadFace.innerText = ":("

            const noMovieText = document.createElement("p")
            noMovieText.id = "no-movie-text"
            noMovieText.innerText = `No movies were found for "${currSearch}".`

            const noMovieFoundView = document.createElement("section")
            noMovieFoundView.id = "no-movie-found-view"
            noMovieFoundView.appendChild(sadFace)
            noMovieFoundView.appendChild(noMovieText)
            document.querySelector("#page").appendChild(noMovieFoundView)
        }
        
         // if we reach the end of the movie list, remove the load more button
        if(pageNo >= response.total_pages || searchPageNo >= response.total_pages){
            document.querySelector("#load-more-movies-btn").display = "none"
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
    // the line below allows us to return to our original location on the now playing list
    const scrollLocation = document.querySelector("#page").scrollTop
    mainGrid.style.display = "none"
    loadMoreBtn.style.display = "none"
    searchForm.style.display = "none"
    document.querySelector("#now-playing-header").style.display = "none"

    // add close icon to the right and the current state
    const closeSearchBtn = document.createElement("button")
    closeSearchBtn.innerText = "\u2715"
    closeSearchBtn.id = "close-search-btn"

    const searchHeaderText = document.createElement("h4")
    searchHeaderText.classList.add("result-mode")
    searchHeaderText.id = "search-header-text"
    searchHeaderText.innerText = "Search Results"

    const searchHeader = document.createElement("section")
    searchHeader.id = "search-header"
    searchHeader.classList.add("grid-header")
    searchHeader.appendChild(closeSearchBtn)
    searchHeader.appendChild(searchHeaderText)

    // create search grid
    const searchGrid = document.createElement("section")
    searchGrid.classList.add("grid")
    searchGrid.id = "search-grid"
    document.querySelector("#page").insertBefore(searchGrid, loadMoreBtn)
    document.querySelector("#page").insertBefore(searchHeader, searchGrid)
    displayMovies(searchMoviesPromise, searchGrid)

    closeSearchBtn.addEventListener("click", () => {
        inSearch = false;
        const noMovieFoundView = document.querySelector("#no-movie-found-view")
        noMovieFoundView === null ? null: noMovieFoundView.remove()
        mainGrid.style.display = "flex"
        loadMoreBtn.style.display = ""
        searchForm.style.display = ""
        document.querySelector("#now-playing-header").style.display = "block"
        searchPageNo = 0
        searchGrid.remove()
        searchHeader.remove()
        searchedMovie.value = currSearch = ""
        document.querySelector("#page").scrollTop = scrollLocation
    })

})

// this helps to keep the search/cancel button in sight at all times
const gridHeader = document.querySelector("#page");
gridHeader.style.height = `calc(100vh - ${document.querySelector("#header").clientHeight}px - 10vh)`
console.log(gridHeader.clientHeight)