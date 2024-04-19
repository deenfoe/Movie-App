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
      loading: true,
      error: false,
      notFound: false,
      searchQuery: '',
    }
  }

  componentDidMount() {
    const query = 'fast'
    this.movieService
      .getMovies(query)
      .then((movies) => {
        if (movies.length === 0) {
          this.setState({ notFound: true, loading: false, searchQuery: this.movieService.lastQuery })
        } else {
          this.setState({ movies, loading: false, searchQuery: this.movieService.lastQuery })
        }
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false })
      })
  }

  render() {
    const { movies, loading, error, notFound, searchQuery } = this.state
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
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </>
    )
  }
}
