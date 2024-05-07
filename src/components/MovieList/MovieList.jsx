import React, { Component } from 'react'
import { Alert, Spin } from 'antd'

import MovieCard from '../MovieCard/MovieCard'
import MovieService from '../../services/MovieService'
import './MovieList.css'

export default class MovieList extends Component {
  movieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      genres: [],
      loading: false,
      error: false,
      notFound: false,
      searchQuery: '',
    }
  }

  componentDidMount() {
    const { searchQuery } = this.props
    this.fetchDataBasedOnTab(searchQuery)
    this.fetchGenres()
  }

  componentDidUpdate(prevProps) {
    const { searchQuery, currentPage, headerCurrentTab } = this.props

    // Проверяем, изменился ли фактически searchQuery или currentPage
    const queryChanged = searchQuery !== prevProps.searchQuery
    const pageChanged = currentPage !== prevProps.currentPage
    const tabChanged = headerCurrentTab !== prevProps.headerCurrentTab

    if (tabChanged) {
      this.setState({ headerCurrentTab }, () => {
        if (headerCurrentTab === '2') {
          this.fetchRatedMovies()
        } else {
          this.fetchMovies(searchQuery, currentPage)
        }
      })
    } else if (queryChanged || pageChanged) {
      this.fetchDataBasedOnTab(searchQuery)
    }
  }

  fetchDataBasedOnTab = (query) => {
    const { guestSessionId, headerCurrentTab } = this.props
    if (headerCurrentTab === '1') {
      this.fetchMovies(query)
    } else if (headerCurrentTab === '2' && guestSessionId) {
      // Теперь проверяем, что guestSessionId не пустой перед вызовом fetchRatedMovies
      this.fetchRatedMovies(guestSessionId)
    }
  }

  fetchRatedMovies = async () => {
    const { guestSessionId, onTotalResults } = this.props
    if (guestSessionId) {
      try {
        const { movies, totalResults } = await this.movieService.getRatedMovies(guestSessionId)
        this.setState({ movies })
        if (movies.length === 0) {
          this.setState({ notFound: true })
        } else {
          this.setState({ notFound: false })
        }
        if (onTotalResults) {
          onTotalResults(totalResults)
        }
      } catch (error) {
        this.setState({ error: error.message })
      }
    }
  }

  fetchMovies = (query, page) => {
    this.setState({ loading: true })

    this.movieService
      .getMovies(query, page)
      .then(({ movies, totalResults }) => {
        if (movies.length === 0) {
          this.setState({
            notFound: query.trim() !== '',
            loading: false,
            movies: [],
            searchQuery: query,
          })
        } else {
          this.setState({ movies, loading: false, searchQuery: query, notFound: false })
        }
        const { onTotalResults } = this.props
        onTotalResults(totalResults)
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false })
      })
  }

  fetchGenres = async () => {
    try {
      const { genres } = await this.movieService.getGenres()
      this.setState({ genres })
    } catch (error) {
      this.setState({ error: 'Произошла ошибка при загрузке жанров' })
    }
  }

  render() {
    const { movies, loading, error, notFound, searchQuery, genres, headerCurrentTab } = this.state
    const { guestSessionId, movieRatings, updateMovieRating } = this.props
    if (notFound && headerCurrentTab === '2') {
      return (
        <Alert message="Нет оцененных фильмов" description="Вы ещё не оценили ни одного фильма." type="info" showIcon />
      )
    }

    return (
      <>
        {loading && <Spin size="large" className="spin" />}

        {error && <Alert message="Error" description={error} type="error" showIcon />}

        {notFound && (
          <Alert
            message="Не найдено"
            description={`Фильмов по запросу "${searchQuery}" не найдено.`}
            type="info"
            showIcon
          />
        )}

        {!loading && !error && !notFound && (
          <ul className="card-list">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                genres={genres}
                guestSessionId={guestSessionId}
                userRating={movieRatings[movie.id]}
                updateMovieRating={updateMovieRating}
              />
            ))}
          </ul>
        )}
      </>
    )
  }
}
