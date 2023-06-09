const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${movieAPI.API_READ_ACCESS_TOKEN}`
    }
};

let pageNo = 0
const getURL = () => {
    return `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${++pageNo}`
}
async function fetchMovies(url, options){
    result = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));
    return result.results
}

moviesPromise = fetchMovies(getURL(), options)
async function generateCards(movie){
    // create poster image
    const poster = document.createElement("img")
    poster.src = "https://image.tmdb.org/t/p/w342" +  movie.poster_path
    poster.classList.add("movie-poster")
    
    // create title element
    const title = document.createElement("p")
    title.classList.add("movie-title")
    title.innerText = movie.title

    // create votes element
    const movieVotes = document.createElement("p")
    movieVotes.classList.add("movie-votes")
    movieVotes.innerText = `⭐️ ${movie.vote_average}`

    // load more button
    const loadMoreBtn = document.createElement("button")
    loadMoreBtn.id = "load-more-movies-btn"
    loadMoreBtn.innerText = "LOAD MORE"


    const movieGrid = document.querySelector("#movies-grid")
    const movieCard = document.createElement("div")
    movieCard.classList.add("movie-card")
    movieCard.appendChild(poster)
    movieCard.appendChild(title)
    movieCard.appendChild(movieVotes)
    movieCard.appendChild(loadMoreBtn)
    movieGrid.appendChild(movieCard)
    
}

// moviesPromise.then(movies => generateCards(movies[0]))
moviesPromise.then(movies => [0,1,2,3,4,5].forEach(i => generateCards(movies[i])))













// const firstMovie = movies["results"][0]

// function generateCards(firstMovie){
//     // create star
//     let star = document.createElement("span")
//     star.classList.add("star")
//     const starContent = document.createTextNode("⭐️");
//     star.appendChild(starContent);

//     let rating = document.createElement("span")
//     rating.classList.add("star")
//     const ratingContent = document.createTextNode(firstMovie.vote_average);
//     rating.appendChild(ratingContent);

//     //create average container
//     let avgContainer = document.createElement("div")
//     avgContainer.classList.add("star")
//     avgContainer.appendChild(star);
//     avgContainer.appendChild(rating);
//     // document.body.appendChild(avgContainer)

//     let img = document.createElement("img")
//     img.src = "https://image.tmdb.org/t/p/w342" + firstMovie.poster_path
//     // document.body.insertBefore(img, avgContainer)

//     let name = document.createElement("div")
//     name.classList.add("name")
//     name.innerText = firstMovie.original_title

//     let movie = document.createElement("section")
//     movie.classList.add("movie")
//     movie.appendChild(img)
//     movie.appendChild(avgContainer)
//     movie.appendChild(name)
//     document.body.appendChild(movie)
// }

// generateCards(firstMovie)