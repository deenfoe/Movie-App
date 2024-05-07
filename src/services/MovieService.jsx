import { format } from 'date-fns'

export default class MovieService {
  imgBase = 'https://image.tmdb.org/t/p/w500'

  noPosterImg = '../images/noposter.png'

  apiBase = 'https://api.themoviedb.org/3/'

  apiKey = 'bab1c18ef22e355aec717a50e04b4fac'

  createImageUrl(path) {
    if (path) {
      return `${this.imgBase}${path}`
    }
    return this.noPosterImg
  }

  async createGuestSession() {
    try {
      const response = await fetch(`${this.apiBase}authentication/guest_session/new?api_key=${this.apiKey}`)
      if (!response.ok) {
        throw new Error(`Не удалось создать guest session. Статус: ${response.status}.`)
      }
      const data = await response.json()
      const guestSessionId = data.guest_session_id

      return guestSessionId
    } catch (error) {
      return null
    }
  }

  async rateMovie(guestSessionId, movieId, rating) {
    try {
      const response = await fetch(
        `${this.apiBase}movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            value: rating,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Не удалось отправить рейтинг. Статус: ${response.status}.`)
      }

      return await response.json()
    } catch (error) {
      return { error: error.message }
    }
  }

  async getRatedMovies(guestSessionId, page = 1) {
    try {
      const response = await fetch(
        `${this.apiBase}guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&page=${page}`
      )
      if (!response.ok) {
        throw new Error(`Не удалось получить оцененные фильмы. Статус: ${response.status}.`)
      }

      const data = await response.json()
      const totalResults = data.total_results
      const movies = data.results.map((movie) => {
        let overview = movie.overview.trim()
        if (overview) {
          if (overview.length > 160) {
            const lastIndex = overview.lastIndexOf(' ', 160)
            overview = overview.substring(0, lastIndex !== -1 ? lastIndex : 160)
            const deleteChars = [',', '.', '?', '!', ';', ':', '—', '«', '»']
            if (deleteChars.includes(overview[overview.length - 1])) {
              overview = overview.slice(0, -1)
            }
            overview += '...'
          } else {
            const deleteChars = [',', '.', '?', '!', ';', ':', '—', '«', '»']
            if (!deleteChars.includes(overview[overview.length - 1])) {
              overview += '.'
            }
          }
        } else {
          overview = 'Нет описания фильма.'
        }
        return {
          id: movie.id,
          title: movie.title,
          overview,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
          voteAverage: movie.vote_average === 0 ? '0' : parseFloat(movie.vote_average).toFixed(1),
          imageUrl: this.createImageUrl(movie.poster_path),
          formattedDate: this.formatReleaseDate(movie.release_date),
          genreIds: movie.genre_ids,
        }
      })
      return { movies, totalResults }
    } catch (error) {
      return { movies: [], totalResults: 0 }
    }
  }

  formatReleaseDate = (dateString) => {
    if (typeof dateString === 'string' && !Number.isNaN(Date.parse(dateString))) {
      return format(new Date(dateString), 'MMMM d, yyyy')
    }
    return format(new Date(), 'MMMM d, yyyy')
  }

  async getData(url) {
    const response = await fetch(`${this.apiBase}${url}&api_key=${this.apiKey}`)

    if (!response.ok) {
      throw new Error(`Не удалось получить данные по адресу ${url}. Статус: ${response.status}.`)
    }

    return response.json()
  }

  async getMovies(query, page = 1) {
    this.lastQuery = query // Сохраняем последний запрос
    const res = await this.getData(`search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`)
    const totalResults = res.total_results
    const movies = res.results.map((movie) => {
      let overview = movie.overview.trim()
      if (overview) {
        if (overview.length > 160) {
          const lastIndex = overview.lastIndexOf(' ', 160)
          overview = overview.substring(0, lastIndex !== -1 ? lastIndex : 160)
          const deleteChars = [',', '.', '?', '!', ';', ':']
          if (deleteChars.includes(overview[overview.length - 1])) {
            overview = overview.slice(0, -1)
          }
          overview += '...'
        } else {
          const deleteChars = [',', '.', '?', '!', ';', ':']
          if (!deleteChars.includes(overview[overview.length - 1])) {
            overview += '.'
          }
        }
      } else {
        overview = 'Нет описания фильма.'
      }
      return {
        id: movie.id,
        title: movie.title,
        overview,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average === 0 ? '0' : parseFloat(movie.vote_average).toFixed(1),
        imageUrl: this.createImageUrl(movie.poster_path),
        formattedDate: this.formatReleaseDate(movie.release_date),
        genreIds: movie.genre_ids,
      }
    })
    return { movies, totalResults }
  }

  async getGenres() {
    return this.getData('genre/movie/list?language=en')
  }

  handleTabChange = (tabKey) => {
    this.setState({ headerCurrentTab: tabKey })
  }
}
