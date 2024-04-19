/* eslint-disable */

import { format } from 'date-fns'

export default class MovieService {
  imgBase = 'https://image.tmdb.org/t/p/w500'

  apiBase = 'https://api.themoviedb.org/3/search/movie'

  apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYWIxYzE4ZWYyMmUzNTVhZWM3MTdhNTBlMDRiNGZhYyIsInN1YiI6IjY2MWE2MjFlOGMzMTU5MDE5M2MxNjcwZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wpvGMLEvC4owgiVPinqMb1U0U6ojx1uu6j2LKPJCKM8'

  createImageUrl(path) {
    return `${this.imgBase}${path}`
  }

  formatReleaseDate(dateString) {
    if (typeof dateString === 'string' && !Number.isNaN(Date.parse(dateString))) {
      return format(new Date(dateString), 'MMMM d, yyyy')
    }
    return format(new Date(), 'MMMM d, yyyy')
  }

  async getResource(url) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this.apiKey}`)

    const res = await fetch(`${this.apiBase}${url}`, { headers })

    if (!res.ok) {
      throw new Error(`Не удалось получить данные по адресу ${url}. Статус: ${res.status}.`)
    }

    return res.json()
  }

  async getMovies(query) {
    this.lastQuery = query // Сохраняем последний запрос
    const res = await this.getResource(`?query=${query}&include_adult=false&language=en-US&page=1`)
    const movies = res.results.map((movie) => {
      let overview = movie.overview.substring(0, 180)
      const spaceIndex = overview.lastIndexOf(' ', 177)
      const newlineIndex = overview.lastIndexOf('\n', 177)
      const cutIndex = Math.max(spaceIndex, newlineIndex)
      overview = cutIndex !== -1 ? overview.substring(0, cutIndex).trim() : overview.trim()
      const overviewEdited =
        overview === '' ? 'Нет описания фильма.' : `${overview}${overview.length < 180 ? '...' : ''}`
      return {
        id: movie.id,
        title: movie.title,
        overview: overviewEdited,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        imageUrl: this.createImageUrl(movie.poster_path),
        formattedDate: this.formatReleaseDate(movie.release_date),
      }
    })
    return movies
  }
}
